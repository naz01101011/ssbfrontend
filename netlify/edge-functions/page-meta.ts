// Serves the SPA shell with real metadata, so crawlers and link-preview
// scrapers (Facebook etc.) see it without running JavaScript:
//  - /stiri/<slug>: the article's title, description, canonical, Open Graph
//    tags, NewsArticle structured data and the article text itself; a real
//    404 for unknown slugs
//  - /, /stiri, /contact, /cookies, /confidentialitate: their title,
//    description, canonical and Open Graph tags; the home page also gets the
//    latest headlines as links, and organization structured data
// The React app then takes over as usual.
//
// Edge function invocations are limited on the Free plan (1M per month; at
// the limit every site on the account is paused), so:
//  - the paths are limited to the ones above
//  - responses are cached at the edge; cached responses are not invocations
//  - any error falls back to the plain shell, never to an error page
//  - every invocation logs one line (Netlify > Cloud compute > Edge Function
//    logs), so invocations can be counted without the billing page
import type { SanityPost } from './lib/meta.ts';
import {
  articleRootMarkup,
  articleTags,
  headlineMarkup,
  injectIntoRoot,
  injectIntoShell,
  isArchivePath,
  latestUrl,
  notFoundTags,
  sanityUrl,
  slugFromPath,
  staticTags,
} from './lib/meta.ts';
import type { Headline } from './lib/meta.ts';

type Context = { next: () => Promise<Response> };

const ARTICLE_TTL = 6 * 60 * 60; // seconds
const NOT_FOUND_TTL = 5 * 60; // short, so a newly published article appears quickly
const HOME_TTL = 5 * 60; // headlines change through the day
const HOME_FALLBACK_TTL = 60; // Sanity was unreachable: try again soon
const STATIC_TTL = 24 * 60 * 60; // changes only with a deploy, which clears the cache
const SANITY_TIMEOUT_MS = 2500;

const respond = (html: string, status: number, ttl: number): Response =>
  new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // browsers always revalidate; only the edge keeps a copy
      'cache-control': 'public, max-age=0, must-revalidate',
      'netlify-cdn-cache-control': `public, s-maxage=${ttl}`,
      // Query strings are part of the cache key by default, and Facebook adds a
      // unique ?fbclid= to every shared link. These pages do not depend on any
      // query parameter, so vary only on one that never occurs.
      'netlify-vary': 'query=_unused',
    },
  });

const fetchJson = async (url: string) => {
  const res = await fetch(url, { signal: AbortSignal.timeout(SANITY_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Sanity responded ${res.status}`);
  return (await res.json()).result;
};

export default async (request: Request, context: Context): Promise<Response> => {
  const started = Date.now();
  const ms = () => `${Date.now() - started}ms`;
  const shell = await context.next();
  if (!shell.ok || !(shell.headers.get('content-type') ?? '').includes('text/html')) {
    console.log(`page-meta passthrough ${shell.status} ${ms()}`);
    return shell;
  }
  const html = await shell.text();
  const plainShell = () => new Response(html, { status: shell.status, headers: shell.headers });

  try {
    const pathname = new URL(request.url).pathname;

    if (isArchivePath(pathname)) {
      console.log(`page-meta archive passthrough ${ms()}`);
      return plainShell();
    }

    // home, archive and the static pages
    const page = staticTags(pathname);
    if (page) {
      let body = injectIntoShell(html, page.title, page.tags);
      let ttl = STATIC_TTL;
      let note = '';
      if (pathname === '/') {
        try {
          const posts: Headline[] = (await fetchJson(latestUrl())) ?? [];
          body = injectIntoRoot(body, headlineMarkup(posts));
          ttl = HOME_TTL;
          note = ` ${posts.length} headlines`;
        } catch (err) {
          // still worth serving the tags; just do not keep it long
          console.error(`page-meta home headlines failed ${ms()}:`, err);
          ttl = HOME_FALLBACK_TTL;
          note = ' no headlines';
        }
      }
      console.log(`page-meta 200 ${ms()} ${pathname}${note}`);
      return respond(body, 200, ttl);
    }

    // articles
    const slug = slugFromPath(pathname);

    if (slug === null) {
      const { title, tags } = notFoundTags();
      console.log(`page-meta 404 bad-path ${ms()} ${pathname.slice(0, 120)}`);
      return respond(injectIntoShell(html, title, tags), 404, NOT_FOUND_TTL);
    }

    const post: SanityPost | null = await fetchJson(sanityUrl(slug));

    if (!post || !post.title) {
      const { title, tags } = notFoundTags();
      console.log(`page-meta 404 ${ms()} ${slug}`);
      return respond(injectIntoShell(html, title, tags), 404, NOT_FOUND_TTL);
    }

    const { title, tags } = articleTags(slug, post);
    const withBody = injectIntoRoot(injectIntoShell(html, title, tags), articleRootMarkup(post));
    console.log(`page-meta 200 ${ms()} ${slug}`);
    return respond(withBody, 200, ARTICLE_TTL);
  } catch (err) {
    console.error(`page-meta fallback ${ms()}:`, err);
    return plainShell();
  }
};

export const config = {
  path: ['/', '/stiri', '/stiri/*', '/contact', '/cookies', '/confidentialitate'],
  cache: 'manual',
};
