import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import handler, { config } from '../page-meta.ts';
import {
  STATIC_PAGES, articleJsonLd, articleRootMarkup, articleTags, describe, escapeHtml, headlineMarkup, imageUrl, injectIntoRoot, injectIntoShell, isArchivePath, portableTextToHtml, slugFromPath, sanityUrl, staticTags,
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
  assert.ok(lines.filter((l) => l.startsWith('<script')).every((l) => l.includes('data-edge-ld="1"')));
  const ld = /<script type="application\/ld\+json"[^>]*>(.*)<\/script>/.exec(home.tags);
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

const span = (text: string, marks: string[] = []) => ({ _type: 'span', text, marks });
const para = (...children: ReturnType<typeof span>[]) => ({ _type: 'block', style: 'normal', children, markDefs: [] as never[] });

test('portableTextToHtml: paragraphs, escaping, line breaks, marks', () => {
  const html = portableTextToHtml([
    para(span('A <b> & "q"\nline2', ['strong', 'em'])),
    para(span('')),
    para(span('  \n ')),
    { _type: 'block', style: 'normal', children: [span('link', ['k1']), span(' bad', ['k2'])],
      markDefs: [{ _key: 'k1', _type: 'link', href: 'https://example.com/?a=1&b="2"' }, { _key: 'k2', _type: 'link', href: 'javascript:alert(1)' }] },
  ]);
  assert.equal(html.match(/<p>/g)?.length, 2, 'empty paragraphs are dropped');
  assert.ok(html.includes('<em><strong>A &lt;b&gt; &amp; &quot;q&quot;<br />line2</strong></em>'));
  assert.ok(html.includes('<a href="https://example.com/?a=1&amp;b=&quot;2&quot;">link</a>'));
  assert.ok(!html.includes('javascript:'), 'unsafe link dropped, text kept');
  assert.ok(html.includes(' bad'));
});

test('portableTextToHtml: headings keep one h1 on the page', () => {
  const h = (style: string) => ({ ...para(span(style)), style });
  const html = portableTextToHtml([h('h1'), h('h2'), h('h3'), h('h4'), h('blockquote'), h('weird')]);
  assert.ok(!html.includes('<h1'));
  assert.ok(html.includes('<h2>h1</h2><h2>h2</h2><h3>h3</h3><h4>h4</h4>'));
  assert.ok(html.includes('<blockquote><p>blockquote</p></blockquote>'));
  assert.ok(html.includes('<p>weird</p>'));
});

test('portableTextToHtml: bullet and numbered lists, two levels, grouped', () => {
  const li = (text: string, listItem: string, level = 1) => ({ ...para(span(text)), listItem, level });
  const html = portableTextToHtml([
    li('a', 'bullet'), li('b', 'bullet'), li('b1', 'bullet', 2), li('c', 'bullet'),
    para(span('between')),
    li('one', 'number'), li('two', 'number'),
  ]);
  assert.equal(html, '<ul><li>a</li><li>b<ul><li>b1</li></ul></li><li>c</li></ul><p>between</p><ol><li>one</li><li>two</li></ol>');
});

test('portableTextToHtml: images, videos, unknown blocks, nothing', () => {
  const html = portableTextToHtml([
    { _type: 'mainImage', asset: { _ref: REF }, alt: 'Alt "x"', caption: ' Cap ' },
    { _type: 'mainImage', asset: { _ref: 'bad' } },
    { _type: 'youtube', url: 'https://youtu.be/abc' },
    { _type: 'fbvideo', url: 'javascript:x' },
    { _type: 'somethingNew', text: 'ignored' },
  ] as never);
  assert.ok(html.includes('<figure><img src="https://cdn.sanity.io/images/w58sh5v7/production/213fdeee9ba23486f4fe38894758e3b7f1c594a3-1800x1584.jpg?w=900'));
  assert.ok(html.includes('alt="Alt &quot;x&quot;"') && html.includes('<figcaption>Cap</figcaption>'));
  assert.equal(html.match(/<figure>/g)?.length, 1);
  assert.ok(html.includes('<a href="https://youtu.be/abc">Video: https://youtu.be/abc</a>'));
  assert.ok(!html.includes('javascript') && !html.includes('ignored'));
  assert.equal(portableTextToHtml(null), '');
  assert.equal(portableTextToHtml(undefined), '');
});

test('portableTextToHtml: output is capped', () => {
  const html = portableTextToHtml(Array.from({ length: 5000 }, () => para(span('x'.repeat(200)))));
  assert.ok(html.length < 260_000);
});

test('articleJsonLd: NewsArticle with images, dates, publisher; author falls back to the organisation', () => {
  const ld = (post: object) => JSON.parse(/<script[^>]*>(.*)<\/script>/.exec(articleJsonLd('a-b', post))![1]);
  const d = ld({ title: 'T'.repeat(200), publishedAt: '2026-10-20T15:01:55Z', _updatedAt: '2026-10-20T15:05:17Z', excerpt: [{ children: [{ text: 'Rezumat' }] }], img: { asset: { _ref: REF }, hotspot: { x: 0.5, y: 0.5 } }, section: 'Sport' });
  assert.equal(d['@type'], 'NewsArticle');
  assert.equal(d.headline.length, 110);
  assert.equal(d.mainEntityOfPage['@id'], 'https://www.stiridesibiu.ro/stiri/a-b');
  assert.equal(d.datePublished, '2026-10-20T15:01:55Z');
  assert.equal(d.dateModified, '2026-10-20T15:05:17Z');
  assert.equal(d.image.length, 3);
  assert.ok(new URL(d.image[2]).searchParams.get('h') === '1200');
  assert.equal(d.author['@type'], 'Organization');
  assert.equal(d.publisher.logo.url, 'https://www.stiridesibiu.ro/logo512.png');
  assert.equal(d.articleSection, 'Sport');
  assert.equal(d.inLanguage, 'ro');
  assert.deepEqual(ld({ title: 'x', authors: ['  Ana Pop ', null] }).author, [{ '@type': 'Person', name: 'Ana Pop' }]);
  const bare = ld({ title: 'x' });
  assert.ok(!('image' in bare) && !('articleSection' in bare) && !('description' in bare));
  assert.ok(!articleJsonLd('a', { title: '</script><b>' }).slice(40, -9).includes('<'), 'no raw < inside the script');
});

test('articleRootMarkup: visually hidden article with the single h1 and the text', () => {
  const html = articleRootMarkup({ title: ' Titlu & co ', body: [para(span('Text'))] as never });
  assert.equal(html, '<article class="sr-only"><h1>Titlu &amp; co</h1><p>Text</p></article>');
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
  const { title, tags } = articleTags('a-b', { title: '  Un "titlu" <x> ', publishedAt: '2026-10-20T15:01:55Z', _updatedAt: '2026-10-20T15:05:17Z', excerpt: [{ children: [{ text: 'Rezumat & co' }] }], img: { asset: { _ref: REF } } });
  assert.equal(title, 'Un "titlu" <x>');
  assert.ok(tags.includes('og:title" content="Un &quot;titlu&quot; &lt;x&gt;"'));
  assert.ok(tags.includes('content="Rezumat &amp; co"'));
  assert.ok(tags.includes('href="https://www.stiridesibiu.ro/stiri/a-b"'));
  assert.ok(tags.includes('summary_large_image'));
  assert.ok(tags.includes('og:image:width" content="1200"') && tags.includes('og:image:height" content="630"'));
  const lines = tags.split('\n').map((l) => l.trim()).filter((l) => !l.startsWith('<script'));
  assert.ok(lines.every((l) => l.startsWith('<') && l.includes('data-edge="1"')), tags);
  assert.ok(tags.includes('<script type="application/ld+json" data-edge-ld="1">'));
  assert.ok(tags.includes('article:modified_time'));
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
  await withFetch(sanity({ title: 'Titlu', excerpt: [{ children: [{ text: 'Rezumat' }] }], body: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Corp', marks: [] }] }], img: { asset: { _ref: REF } } }), async () => {
    const res = await handler(req('/stiri/titlu'), c);
    const html = await res.text();
    assert.equal(res.status, 200);
    assert.ok(html.includes('<title data-edge="1">Titlu</title>'));
    assert.ok(html.includes('og:image'));
    assert.ok(html.includes('<div id="root"><article class="sr-only"><h1>Titlu</h1><p>Corp</p></article></div>'));
    assert.ok(html.includes('"@type":"NewsArticle"'));
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
