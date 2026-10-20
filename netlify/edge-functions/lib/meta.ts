// Pure helpers for the article edge function. No Deno- or Netlify-specific
// APIs here, so they can be tested with plain Node (`yarn test:edge`).

export const SITE = 'https://www.stiridesibiu.ro';
export const SANITY_PROJECT = 'w58sh5v7';
export const SANITY_DATASET = 'production';

export type SanityPost = {
  title?: string;
  publishedAt?: string;
  excerpt?: Block[];
  firstBlock?: Block;
  img?: {
    asset?: { _ref?: string };
    hotspot?: { x: number; y: number };
  };
};

type Block = { children?: { text?: string }[] };

export const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const blockText = (b?: Block): string =>
  (b?.children ?? [])
    .map((c) => c.text ?? '')
    .join('')
    .replace(/\s+/g, ' ')
    .trim();

export const describe = (post: SanityPost, max = 200): string => {
  const text = blockText(post.excerpt?.[0]) || blockText(post.firstBlock);
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
};

// "image-<id>-<width>x<height>-<ext>" -> CDN URL, with the editor's focal point
export const imageUrl = (img: SanityPost['img'], w = 1200, h = 630): string => {
  const m = /^image-([a-f0-9]+)-(\d+x\d+)-([a-z0-9]+)$/i.exec(img?.asset?._ref ?? '');
  if (!m) return '';
  const params = new URLSearchParams({ w: String(w), h: String(h), fit: 'crop', q: '60', auto: 'format' });
  if (img?.hotspot) {
    params.set('crop', 'focalpoint');
    params.set('fp-x', String(img.hotspot.x));
    params.set('fp-y', String(img.hotspot.y));
  }
  return `https://cdn.sanity.io/images/${SANITY_PROJECT}/${SANITY_DATASET}/${m[1]}-${m[2]}.${m[3]}?${params}`;
};

export const articleUrl = (slug: string): string => `${SITE}/stiri/${encodeURIComponent(slug)}`;

// Injected tags carry data-edge so the app can remove them once it has put its
// own tags in place (see src/edgeMeta.js). react-helmet-async v3 on React 19
// only adds tags; it never replaces ones that came with the HTML.
const tag = (html: string): string => html.replace(/^<(\w+)/, '<$1 data-edge="1"');

export const articleTags = (slug: string, post: SanityPost): { title: string; tags: string } => {
  const title = (post.title ?? '').trim();
  const description = describe(post);
  const url = articleUrl(slug);
  const image = imageUrl(post.img);
  const t = [
    description && `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    description && `<meta property="og:description" content="${escapeHtml(description)}" />`,
    image && `<meta property="og:image" content="${escapeHtml(image)}" />`,
    post.publishedAt && `<meta property="article:published_time" content="${escapeHtml(post.publishedAt)}" />`,
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`,
  ]
    .filter(Boolean)
    .map((x) => tag(x as string));
  return { title, tags: t.join('\n    ') };
};

export const notFoundTags = (): { title: string; tags: string } => ({
  title: 'Articol negăsit',
  tags: tag('<meta name="robots" content="noindex" />'),
});

// Replace the shell's <title> and add our tags at the end of <head>.
export const injectIntoShell = (html: string, title: string, tags: string): string =>
  html
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title data-edge="1">${escapeHtml(title)}</title>`)
    .replace('</head>', () => `    ${tags}\n</head>`);

// "/stiri/some-slug" -> "some-slug"; null when the path is not a single segment
export const slugFromPath = (pathname: string): string | null => {
  const m = /^\/stiri\/([^/]+)\/?$/.exec(pathname);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return null;
  }
};

export const POST_QUERY =
  '*[slug.current == $slug][0]{ title, publishedAt, excerpt, "firstBlock": body[0], "img": mainImage{ asset, hotspot } }';

export const sanityUrl = (slug: string): string => {
  const u = new URL(`https://${SANITY_PROJECT}.apicdn.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}`);
  u.searchParams.set('query', POST_QUERY);
  u.searchParams.set('$slug', JSON.stringify(slug));
  return u.toString();
};
