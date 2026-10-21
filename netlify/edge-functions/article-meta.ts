// Serves the SPA shell for /stiri/<slug> with the article's real <title>,
// description, canonical and Open Graph tags, so crawlers and link-preview
// scrapers (Facebook etc.) see them without running JavaScript. Unknown
// slugs get a real 404 status. The React app then takes over as usual.
//
// Edge function invocations are limited on the Free plan (1M per month; at
// the limit every site on the account is paused), so:
//  - the path is limited to /stiri/*
//  - responses are cached at the edge; cached responses are not invocations
//  - any error falls back to the plain shell, never to an error page
//  - every invocation logs one line (Netlify > Cloud compute > Edge Function
//    logs), so invocations can be counted without the billing page
import type { SanityPost } from './lib/meta.ts';
import {
  articleTags,
  injectIntoShell,
  isArchivePath,
  notFoundTags,
  sanityUrl,
  slugFromPath,
} from './lib/meta.ts';

type Context = { next: () => Promise<Response> };

const FOUND_TTL = 6 * 60 * 60; // seconds
const NOT_FOUND_TTL = 5 * 60; // short, so a newly published article appears quickly
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
      // unique ?fbclid= to every shared link. This page does not depend on any
      // query parameter, so vary only on one that never occurs.
      'netlify-vary': 'query=_unused',
    },
  });

export default async (request: Request, context: Context): Promise<Response> => {
  const started = Date.now();
  const shell = await context.next();
  if (!shell.ok || !(shell.headers.get('content-type') ?? '').includes('text/html')) {
    console.log(`article-meta passthrough ${shell.status} ${Date.now() - started}ms`);
    return shell;
  }
  const html = await shell.text();
  const plainShell = () => new Response(html, { status: shell.status, headers: shell.headers });

  try {
    const pathname = new URL(request.url).pathname;

    if (isArchivePath(pathname)) {
      console.log(`article-meta archive passthrough ${Date.now() - started}ms`);
      return plainShell();
    }

    const slug = slugFromPath(pathname);

    if (slug === null) {
      const { title, tags } = notFoundTags();
      console.log(`article-meta 404 bad-path ${Date.now() - started}ms ${pathname.slice(0, 120)}`);
      return respond(injectIntoShell(html, title, tags), 404, NOT_FOUND_TTL);
    }

    const res = await fetch(sanityUrl(slug), { signal: AbortSignal.timeout(SANITY_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`Sanity responded ${res.status}`);
    const post: SanityPost | null = (await res.json()).result;

    if (!post || !post.title) {
      const { title, tags } = notFoundTags();
      console.log(`article-meta 404 ${Date.now() - started}ms ${slug}`);
      return respond(injectIntoShell(html, title, tags), 404, NOT_FOUND_TTL);
    }

    const { title, tags } = articleTags(slug, post);
    console.log(`article-meta 200 ${Date.now() - started}ms ${slug}`);
    return respond(injectIntoShell(html, title, tags), 200, FOUND_TTL);
  } catch (err) {
    console.error(`article-meta fallback ${Date.now() - started}ms:`, err);
    return plainShell();
  }
};

export const config = {
  path: '/stiri/*',
  cache: 'manual',
};
