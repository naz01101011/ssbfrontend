import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler, { config } from '../article-meta.ts';
import {
  articleTags, describe, escapeHtml, imageUrl, injectIntoShell, slugFromPath, sanityUrl,
} from './meta.ts';

const SHELL = '<!doctype html><html><head><title>Stiri de Sibiu</title></head><body><div id="root"></div></body></html>';
const REF = 'image-213fdeee9ba23486f4fe38894758e3b7f1c594a3-1800x1584-jpg';

const ctx = () => {
  let calls = 0;
  return { calls: () => calls, next: async () => { calls++; return new Response(SHELL, { headers: { 'content-type': 'text/html' } }); } };
};
const withFetch = async (impl: typeof fetch, fn: () => Promise<void>) => {
  const orig = globalThis.fetch; globalThis.fetch = impl;
  try { await fn(); } finally { globalThis.fetch = orig; }
};
const sanity = (result: unknown) => (async () => new Response(JSON.stringify({ result }))) as typeof fetch;
const req = (path: string) => new Request('https://www.stiridesibiu.ro' + path);

test('config: limited to /stiri/*, edge caching on', () => {
  assert.equal(config.path, '/stiri/*');
  assert.equal(config.cache, 'manual');
});

test('slugFromPath', () => {
  assert.equal(slugFromPath('/stiri/abc-1'), 'abc-1');
  assert.equal(slugFromPath('/stiri/abc-1/'), 'abc-1');
  assert.equal(slugFromPath('/stiri/%20a%20b'), ' a b');
  assert.equal(slugFromPath('/stiri/a/b'), null);
  assert.equal(slugFromPath('/stiri/'), null);
  assert.equal(slugFromPath('/stiri/%E0%A4%A'), null);
});

test('escapeHtml', () => assert.equal(escapeHtml('a"<b>&'), 'a&quot;&lt;b&gt;&amp;'));

test('describe: excerpt first, then body, truncated on a word', () => {
  assert.equal(describe({ excerpt: [{ children: [{ text: ' Hello  ' }, { text: 'world' }] }] }), 'Hello world');
  assert.equal(describe({ firstBlock: { children: [{ text: 'From body' }] } }), 'From body');
  const long = describe({ excerpt: [{ children: [{ text: 'word '.repeat(100) }] }] });
  assert.ok(long.length <= 201 && long.endsWith('…'));
  assert.equal(describe({}), '');
});

test('imageUrl: crop uses the focal point; bad refs give nothing', () => {
  const u = new URL(imageUrl({ asset: { _ref: REF }, hotspot: { x: 0.4, y: 0.6 } }));
  assert.equal(u.hostname, 'cdn.sanity.io');
  assert.equal(u.pathname, '/images/w58sh5v7/production/213fdeee9ba23486f4fe38894758e3b7f1c594a3-1800x1584.jpg');
  assert.equal(u.searchParams.get('fp-x'), '0.4');
  assert.equal(u.searchParams.get('crop'), 'focalpoint');
  assert.equal(imageUrl({ asset: { _ref: 'nope' } }), '');
  assert.equal(imageUrl(undefined), '');
});

test('articleTags: all tags marked data-edge, values escaped', () => {
  const { title, tags } = articleTags('a-b', { title: '  Un "titlu" <x> ', publishedAt: '2026-10-20T15:01:55Z', excerpt: [{ children: [{ text: 'Rezumat & co' }] }], img: { asset: { _ref: REF } } });
  assert.equal(title, 'Un "titlu" <x>');
  assert.ok(tags.includes('og:title" content="Un &quot;titlu&quot; &lt;x&gt;"'));
  assert.ok(tags.includes('content="Rezumat &amp; co"'));
  assert.ok(tags.includes('href="https://www.stiridesibiu.ro/stiri/a-b"'));
  assert.ok(tags.includes('summary_large_image'));
  const lines = tags.split('\n').map((l) => l.trim());
  assert.ok(lines.every((l) => l.startsWith('<') && l.includes('data-edge="1"')), tags);
});

test('injectIntoShell: one title, tags before </head>', () => {
  const out = injectIntoShell(SHELL, 'T & U', '<meta data-edge="1" name="x" />');
  assert.equal(out.match(/<title/g)?.length, 1);
  assert.ok(out.includes('<title data-edge="1">T &amp; U</title>'));
  assert.ok(out.indexOf('name="x"') < out.indexOf('</head>'));
  assert.ok(out.includes('<div id="root"></div>'));
});

test('sanityUrl passes the slug as a parameter', () => {
  const u = new URL(sanityUrl('x" || true'));
  assert.equal(u.searchParams.get('$slug'), JSON.stringify('x" || true'));
  assert.ok(!u.searchParams.get('query')!.includes('true'));
});

test('handler: article -> 200, injected tags, edge cache headers', async () => {
  const c = ctx();
  await withFetch(sanity({ title: 'Titlu', excerpt: [{ children: [{ text: 'Rezumat' }] }], img: { asset: { _ref: REF } } }), async () => {
    const res = await handler(req('/stiri/titlu'), c);
    const html = await res.text();
    assert.equal(res.status, 200);
    assert.ok(html.includes('<title data-edge="1">Titlu</title>'));
    assert.ok(html.includes('og:image'));
    assert.match(res.headers.get('netlify-cdn-cache-control')!, /s-maxage=21600/);
    assert.equal(res.headers.get('cache-control'), 'public, max-age=0, must-revalidate');
    assert.equal(c.calls(), 1);
  });
});

test('handler: unknown slug -> real 404 with noindex, short cache', async () => {
  await withFetch(sanity(null), async () => {
    const res = await handler(req('/stiri/nu-exista'), ctx());
    assert.equal(res.status, 404);
    assert.ok((await res.text()).includes('noindex'));
    assert.match(res.headers.get('netlify-cdn-cache-control')!, /s-maxage=300/);
  });
});

test('handler: multi-segment path -> 404 without calling Sanity', async () => {
  let fetched = 0;
  await withFetch((async () => { fetched++; return new Response('{}'); }) as typeof fetch, async () => {
    const res = await handler(req('/stiri/a/b'), ctx());
    assert.equal(res.status, 404);
    assert.equal(fetched, 0);
  });
});

test('handler: Sanity errors and timeouts fall back to the plain shell, uncached', async () => {
  for (const impl of [
    (async () => new Response('boom', { status: 500 })) as typeof fetch,
    (async () => { throw new Error('network'); }) as typeof fetch,
    (async () => new Response('not json')) as typeof fetch,
  ]) {
    const c = ctx();
    const origErr = console.error; console.error = () => {};
    await withFetch(impl, async () => {
      const res = await handler(req('/stiri/x'), c);
      assert.equal(res.status, 200);
      assert.equal(await res.text(), SHELL);
      assert.equal(res.headers.get('netlify-cdn-cache-control'), null);
      assert.equal(c.calls(), 1, 'next() must be called exactly once');
    });
    console.error = origErr;
  }
});

test('handler: non-HTML shell is passed through untouched', async () => {
  const c = { next: async () => new Response('x', { status: 404, headers: { 'content-type': 'text/plain' } }) };
  const res = await handler(req('/stiri/x'), c);
  assert.equal(res.status, 404);
  assert.equal(await res.text(), 'x');
});
