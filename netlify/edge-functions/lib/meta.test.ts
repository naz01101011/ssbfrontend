import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import handler, { config } from '../page-meta.ts';
import {
  STATIC_PAGES, articleTags, describe, escapeHtml, headlineMarkup, imageUrl, injectIntoRoot, injectIntoShell, isArchivePath, slugFromPath, sanityUrl, staticTags,
} from './meta.ts';

const SHELL = '<!doctype html><html><head><title>Stiri de Sibiu</title></head><body><div id="root"></div></body></html>';
const REF = 'image-213fdeee9ba23486f4fe38894758e3b7f1c594a3-1800x1584-jpg';

// keep the per-invocation log lines out of the test output
console.log = () => {};

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

test('config: only the listed paths, edge caching on', () => {
  assert.deepEqual(config.path, ['/', '/stiri', '/stiri/*', '/contact', '/cookies', '/confidentialitate']);
  assert.equal(config.cache, 'manual');
});

test('STATIC_PAGES match the <Helmet> of each page, so the HTML and the app agree', () => {
  const files: Record<string, string> = {
    '/': 'Home', '/stiri': 'Stiri', '/contact': 'Contact', '/cookies': 'Cookies', '/confidentialitate': 'Privacy',
  };
  for (const [path, file] of Object.entries(files)) {
    const src = fs.readFileSync(new URL(`../../../src/pages/${file}.js`, import.meta.url), 'utf8');
    const get = (re: RegExp) => re.exec(src)?.[1];
    assert.equal(get(/<title>([^<]*)<\/title>/), STATIC_PAGES[path].title, `${file} title`);
    assert.equal(get(/name="description" content="([^"]*)"/), STATIC_PAGES[path].description, `${file} description`);
    assert.equal(get(/rel="canonical" href="([^"]*)"/), STATIC_PAGES[path].canonical, `${file} canonical`);
  }
});

test('staticTags: marked data-edge; home adds organization JSON-LD, others do not', () => {
  const home = staticTags('/')!;
  const lines = home.tags.split('\n').map((l) => l.trim());
  assert.ok(lines.filter((l) => !l.startsWith('<script')).every((l) => l.includes('data-edge="1"')));
  const ld = /<script type="application\/ld\+json">(.*)<\/script>/.exec(home.tags);
  assert.ok(ld);
  const data = JSON.parse(ld![1]);
  assert.deepEqual(data['@graph'].map((x: { '@type': string }) => x['@type']), ['NewsMediaOrganization', 'WebSite']);
  assert.ok(!staticTags('/contact')!.tags.includes('ld+json'));
  assert.equal(staticTags('/nope'), null);
});

test('headlineMarkup: escapes, encodes slugs, skips incomplete entries, has the h1', () => {
  const out = headlineMarkup([
    { title: '  A & <b> ', slug: 'a b' }, { title: 'no slug' }, { slug: 'no-title' }, { title: '   ', slug: 'blank' },
  ]);
  assert.ok(out.includes('<h1>'));
  assert.ok(out.includes('<li><a href="/stiri/a%20b">A &amp; &lt;b&gt;</a></li>'));
  assert.equal(out.match(/<li>/g)?.length, 1);
});

test('injectIntoRoot', () => {
  assert.ok(injectIntoRoot(SHELL, '<p>x</p>').includes('<div id="root"><p>x</p></div>'));
  assert.equal(injectIntoRoot('<body></body>', 'x'), '<body></body>');
});

test('slugFromPath', () => {
  assert.equal(slugFromPath('/stiri/abc-1'), 'abc-1');
  assert.equal(slugFromPath('/stiri/abc-1/'), 'abc-1');
  assert.equal(slugFromPath('/stiri/%20a%20b'), ' a b');
  assert.equal(slugFromPath('/stiri/a/b'), null);
  assert.equal(slugFromPath('/stiri/'), null);
  assert.equal(slugFromPath('/stiri/%E0%A4%A'), null);
});

test('isArchivePath: only the archive with trailing slashes', () => {
  assert.equal(isArchivePath('/stiri/'), true);
  assert.equal(isArchivePath('/stiri//'), true);
  assert.equal(isArchivePath('/stiri'), false);
  assert.equal(isArchivePath('/stiri/a'), false);
  assert.equal(isArchivePath('/stiri/a/'), false);
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
  assert.ok(tags.includes('og:image:width" content="1200"') && tags.includes('og:image:height" content="630"'));
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
    assert.equal(res.headers.get('netlify-vary'), 'query=_unused');
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

test('handler: home gets metadata, JSON-LD and headline links; 5 minute cache', async () => {
  await withFetch(sanity([{ title: 'Prima stire', slug: 'prima-stire' }, { title: 'A doua', slug: 'a-doua' }]), async () => {
    const res = await handler(req('/'), ctx());
    const html = await res.text();
    assert.equal(res.status, 200);
    assert.ok(html.includes('<title data-edge="1">Stiri de Sibiu</title>'));
    assert.ok(html.includes('ld+json'));
    assert.ok(html.includes('<div id="root"><div class="sr-only"><h1>'));
    assert.ok(html.includes('href="/stiri/prima-stire"'));
    assert.match(res.headers.get('netlify-cdn-cache-control')!, /s-maxage=300$/);
    assert.equal(res.headers.get('netlify-vary'), 'query=_unused');
  });
});

test('handler: home still gets its tags when Sanity fails, with a short cache', async () => {
  const origErr = console.error; console.error = () => {};
  await withFetch((async () => new Response('boom', { status: 500 })) as typeof fetch, async () => {
    const res = await handler(req('/'), ctx());
    const html = await res.text();
    assert.equal(res.status, 200);
    assert.ok(html.includes('rel="canonical"'));
    assert.ok(!html.includes('sr-only'));
    assert.match(res.headers.get('netlify-cdn-cache-control')!, /s-maxage=60$/);
  });
  console.error = origErr;
});

test('handler: static pages never call Sanity and cache for a day', async () => {
  let fetched = 0;
  await withFetch((async () => { fetched++; return new Response('{}'); }) as typeof fetch, async () => {
    for (const p of ['/stiri', '/contact', '/cookies', '/confidentialitate']) {
      const res = await handler(req(p), ctx());
      const html = await res.text();
      assert.equal(res.status, 200, p);
      assert.ok(html.includes('rel="canonical"'), p);
      assert.ok(!html.includes('sr-only'), p);
      assert.match(res.headers.get('netlify-cdn-cache-control')!, /s-maxage=86400$/, p);
    }
    assert.equal(fetched, 0);
  });
});

test('handler: /stiri/ is the archive: plain shell with status 200, no Sanity call', async () => {
  let fetched = 0;
  const c = ctx();
  await withFetch((async () => { fetched++; return new Response('{}'); }) as typeof fetch, async () => {
    const res = await handler(req('/stiri/?x=1'), c);
    assert.equal(res.status, 200);
    assert.equal(await res.text(), SHELL);
    assert.equal(res.headers.get('netlify-cdn-cache-control'), null);
    assert.equal(fetched, 0);
    assert.equal(c.calls(), 1);
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
