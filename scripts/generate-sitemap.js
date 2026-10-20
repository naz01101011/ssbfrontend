// Generates public/sitemap.xml (and sitemap-N.xml + an index when there are
// more URLs than the 50,000 a single sitemap may hold) from Sanity.
// Runs automatically before `yarn build`. If Sanity cannot be reached it
// still writes the static pages and warns, so a Sanity outage does not
// block a deploy.
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.stiridesibiu.ro';
const API = 'https://w58sh5v7.apicdn.sanity.io/v1/data/query/production';
const PAGE_SIZE = 5000;
const MAX_URLS = 45000;
const OUT = path.join(__dirname, '..', 'public');

const STATIC_PAGES = ['/', '/stiri', '/contact', '/cookies', '/confidentialitate'];

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const query = async (groq, params) => {
  const url = new URL(API);
  url.searchParams.set('query', groq);
  Object.entries(params).forEach(([k, v]) =>
    url.searchParams.set('$' + k, JSON.stringify(v))
  );
  const res = await fetch(url);
  if (!res.ok) throw new Error('Sanity responded ' + res.status);
  return (await res.json()).result;
};

const fetchPosts = async () => {
  const posts = [];
  let last = '';
  for (;;) {
    const page = await query(
      `*[_type == "post" && defined(slug.current) && _id > $last] | order(_id) [0...${PAGE_SIZE}] { _id, "slug": slug.current, "updated": _updatedAt }`,
      { last }
    );
    posts.push(...page);
    if (page.length < PAGE_SIZE) return posts;
    last = page[page.length - 1]._id;
  }
};

const urlset = (entries) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  entries
    .map(
      (e) =>
        `  <url><loc>${esc(SITE + e.loc)}</loc>` +
        (e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : '') +
        `</url>`
    )
    .join('\n') +
  `\n</urlset>\n`;

const write = (name, content) =>
  fs.writeFileSync(path.join(OUT, name), content);

const main = async () => {
  const entries = STATIC_PAGES.map((loc) => ({ loc }));
  try {
    const posts = await fetchPosts();
    posts.forEach((p) =>
      entries.push({ loc: '/stiri/' + encodeURIComponent(p.slug), lastmod: p.updated })
    );
  } catch (err) {
    console.warn('WARNING: could not fetch posts for the sitemap (' + err.message + '); writing static pages only.');
  }

  // clear sitemaps from a previous run
  fs.readdirSync(OUT)
    .filter((f) => /^sitemap(-\d+)?\.xml$/.test(f))
    .forEach((f) => fs.unlinkSync(path.join(OUT, f)));

  if (entries.length <= MAX_URLS) {
    write('sitemap.xml', urlset(entries));
  } else {
    const files = [];
    for (let i = 0; i * MAX_URLS < entries.length; i++) {
      const name = `sitemap-${i + 1}.xml`;
      write(name, urlset(entries.slice(i * MAX_URLS, (i + 1) * MAX_URLS)));
      files.push(name);
    }
    write(
      'sitemap.xml',
      `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        files.map((f) => `  <sitemap><loc>${SITE}/${f}</loc></sitemap>`).join('\n') +
        `\n</sitemapindex>\n`
    );
  }
  console.log(`sitemap: ${entries.length} URLs`);
};

main();
