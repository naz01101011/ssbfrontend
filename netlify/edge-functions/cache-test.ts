// THROWAWAY EXPERIMENT - do not merge. Finds out which cache headers make
// Netlify cache an edge function response. Each variant returns the time it
// was rendered; if a repeat request shows the same time, it was cached.
type Context = { next: () => Promise<Response> };

const V: Record<string, Record<string, string>> = {
  a: { 'netlify-cdn-cache-control': 'public, max-age=3600' },
  b: { 'netlify-cdn-cache-control': 'public, s-maxage=3600' },
  c: { 'cache-control': 'public, s-maxage=3600' },
  d: { 'cache-control': 'public, max-age=3600' },
  // what article-meta.ts does today (without context.next())
  f: { 'cache-control': 'public, max-age=0, must-revalidate', 'netlify-cdn-cache-control': 'public, s-maxage=3600' },
  // same as f, plus a context.next() call first (also what article-meta.ts does)
  e: { 'cache-control': 'public, max-age=0, must-revalidate', 'netlify-cdn-cache-control': 'public, s-maxage=3600' },
  // f plus an explicit Netlify-Vary on query
  g: { 'cache-control': 'public, max-age=0, must-revalidate', 'netlify-cdn-cache-control': 'public, s-maxage=3600', 'netlify-vary': 'query=none' },
};

export default async (request: Request, context: Context): Promise<Response> => {
  const variant = new URL(request.url).pathname.split('/')[2] ?? '';
  const headers = V[variant];
  if (!headers) return new Response('unknown variant', { status: 404 });
  if (variant === 'e') await context.next();
  const at = new Date().toISOString();
  return new Response(`variant ${variant} rendered at ${at}\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'x-rendered-at': at, ...headers },
  });
};

export const config = { path: '/cache-test/*', cache: 'manual' };
