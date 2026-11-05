// Static checks on the built site (dist/): no browser, no dependencies.
//   npm run build && npm run test:static
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative, sep, posix } from 'node:path';
import { execFileSync } from 'node:child_process';

const DIST = resolve('dist');
const SITE = 'https://masska.org';

assert.ok(existsSync(DIST), 'dist/ not found: run "npm run build" first');

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}

const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
// 404.html is the one page served at any depth, so it is root-absolute on purpose and
// has its own test below; the others are checked as a set
const pages = new Map(
  htmlFiles.filter((file) => relative(DIST, file) !== '404.html').map((file) => {
    const html = readFileSync(file, 'utf8');
    const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '');
    return [file, { file, html, body, name: relative(DIST, file).split(sep).join('/') }];
  }),
);

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map((m) => m[0]);

/** Resolves a link from a page to a file in dist (null for external links). */
function target(page, url) {
  if (/^(mailto:|tel:|javascript:|data:)/.test(url)) return null;
  let path = url.split('#')[0].split('?')[0];
  if (url.startsWith(SITE)) path = path.slice(SITE.length) || '/';
  else if (/^https?:|^\/\//.test(url)) return null;
  let full = path.startsWith('/') ? join(DIST, path) : path === '' ? page.file : resolve(dirname(page.file), decodeURIComponent(path));
  if (existsSync(full) && statSync(full).isDirectory()) full = join(full, 'index.html');
  return full;
}

const problems = (list) => assert.deepEqual(list, [], `\n${list.join('\n')}`);

test('the build produced the expected pages', () => {
  for (const name of ['index.html', 'pl/index.html', 'en/index.html', 'pl/program.html', 'en/program.html', 'pl/online.html', 'en/online.html', 'pl/kontakt.html', 'en/contact.html']) {
    assert.ok(pages.has(join(DIST, ...name.split('/'))), `${name} is missing`);
  }
});

test('every link, image, script and stylesheet points to an existing file', () => {
  const bad = [];
  for (const page of pages.values()) {
    const refs = [
      ...[...page.body.matchAll(/<(?:a|link)\b[^>]*\shref="([^"]*)"/g)].map((m) => m[1]),
      ...[...page.html.matchAll(/<(?:img|script|source|iframe)\b[^>]*\ssrc="([^"]*)"/g)].map((m) => m[1]),
    ];
    for (const url of refs) {
      if (url.trim() === '') {
        bad.push(`${page.name}: empty URL`);
        continue;
      }
      const file = target(page, url);
      if (file && !existsSync(file)) bad.push(`${page.name}: ${url}`);
    }
  }
  problems(bad);
});

test('anchors (#id) lead to an element that exists', () => {
  const bad = [];
  for (const page of pages.values()) {
    for (const m of page.body.matchAll(/<a\b[^>]*\shref="([^"]*#[^"]+)"/g)) {
      const url = m[1];
      const id = url.split('#')[1];
      const file = target(page, url);
      const dest = file && pages.get(file);
      if (dest && !new RegExp(`\\sid="${id}"`).test(dest.html)) bad.push(`${page.name}: ${url}`);
    }
  }
  problems(bad);
});

test('pages work when opened from disk: no root-absolute links or assets', () => {
  const bad = [];
  for (const page of pages.values()) {
    for (const m of page.html.matchAll(/\s(?:href|src)="(\/[^/"][^"]*)"/g)) bad.push(`${page.name}: ${m[1]}`);
  }
  problems(bad);
});

test('urls in the stylesheets exist (fonts, textures, flags)', () => {
  const bad = [];
  const sheets = walk(DIST).filter((f) => f.endsWith('.css'));
  assert.ok(sheets.length > 0);
  for (const sheet of sheets) {
    const css = readFileSync(sheet, 'utf8');
    for (const m of css.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) {
      const url = m[2];
      if (/^(data:|https?:|#)/.test(url)) continue;
      const file = resolve(dirname(sheet), url.split('?')[0].split('#')[0]);
      if (!existsSync(file)) bad.push(`${relative(DIST, sheet)}: ${url}`);
    }
  }
  problems(bad);
});

test('the ink-edge texture is inlined, so masks also work from disk', () => {
  const css = readFileSync(join(DIST, 'assets', 'styles.css'), 'utf8');
  assert.match(css, /mask:\s*url\("data:image\/webp;base64,/);
  assert.doesNotMatch(css, /mask:\s*url\(['"]?img\//);
});

test('no duplicate ids on a page', () => {
  const bad = [];
  for (const page of pages.values()) {
    const seen = new Set();
    for (const m of page.body.matchAll(/\sid="([^"]+)"/g)) {
      if (seen.has(m[1])) bad.push(`${page.name}: #${m[1]}`);
      seen.add(m[1]);
    }
  }
  problems(bad);
});

test('every image has an alt attribute', () => {
  const bad = [];
  for (const page of pages.values()) {
    for (const tag of tags(page.body, 'img')) if (attr(tag, 'alt') === undefined) bad.push(`${page.name}: ${tag.slice(0, 80)}`);
  }
  problems(bad);
});

test('one h1 per page and no skipped heading levels', () => {
  const bad = [];
  for (const page of pages.values()) {
    if (page.name === 'index.html') continue; // the language chooser
    const levels = [...page.body.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
    if (levels.filter((l) => l === 1).length !== 1) bad.push(`${page.name}: ${levels.filter((l) => l === 1).length} x h1`);
    levels.reduce((prev, level) => {
      if (prev && level > prev + 1) bad.push(`${page.name}: h${prev} then h${level}`);
      return level;
    }, 0);
  }
  problems(bad);
});

test('titles, descriptions, canonical, language and share image are present', () => {
  const bad = [];
  for (const page of pages.values()) {
    const need = (ok, what) => ok || bad.push(`${page.name}: ${what}`);
    need(/<html[^>]*\slang="(pl|en)"/.test(page.html), 'html lang');
    need(/<title>[^<]{5,}<\/title>/.test(page.html), 'title');
    need(/<meta name="description" content="[^"]{20,}"/.test(page.html), 'description');
    need((page.html.match(/<link rel="canonical"/g) ?? []).length === 1, 'one canonical link');
    need(/<meta property="og:image" content="https:\/\/masska\.org\/[^"]+"/.test(page.html), 'og:image');
  }
  problems(bad);
});

test('hreflang alternates point to real pages that link back', () => {
  const bad = [];
  const alternates = (page) =>
    Object.fromEntries(
      tags(page.html, 'link')
        .filter((t) => attr(t, 'rel') === 'alternate' && attr(t, 'hreflang'))
        .map((t) => [attr(t, 'hreflang'), attr(t, 'href')]),
    );
  const pageAt = (url) => pages.get(target({ file: join(DIST, 'index.html') }, url));
  for (const page of pages.values()) {
    const own = `${SITE}/${page.name.replace(/index\.html$/, '')}`;
    for (const [lang, url] of Object.entries(alternates(page))) {
      if (lang === 'x-default') continue;
      const other = pageAt(url);
      if (!other) {
        bad.push(`${page.name}: hreflang ${lang} -> ${url} does not exist`);
        continue;
      }
      if (!Object.values(alternates(other)).includes(own) && !Object.values(alternates(other)).includes(own.replace(/\/$/, '/index.html'))) {
        bad.push(`${page.name}: ${url} does not link back`);
      }
    }
  }
  problems(bad);
});

test('sitemap lists real pages, and exactly the indexable ones', () => {
  const xml = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const listed = new Set();
  const bad = [];
  for (const url of urls) {
    const file = target({ file: join(DIST, 'index.html') }, url);
    if (!file || !existsSync(file)) bad.push(`sitemap: ${url} has no file`);
    else listed.add(file);
  }
  for (const page of pages.values()) {
    const noindex = /<meta name="robots" content="[^"]*noindex/.test(page.html);
    const inMap = listed.has(page.file);
    if (noindex && inMap) bad.push(`${page.name}: noindex but in the sitemap`);
    if (!noindex && !inMap) bad.push(`${page.name}: indexable but not in the sitemap`);
  }
  problems(bad);
});

test('robots.txt points at the sitemap', () => {
  const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
  assert.match(robots, /Sitemap: https:\/\/masska\.org\/sitemap-index\.xml/);
  assert.ok(existsSync(join(DIST, 'sitemap-index.xml')));
});

test('structured data is valid JSON and carries confirmed dates', () => {
  for (const page of pages.values()) {
    for (const m of page.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const data = JSON.parse(m[1]);
      assert.equal(data['@context'], 'https://schema.org', page.name);
      if (data['@type'] === 'Festival') assert.match(data.startDate, /^2026-11-13/, page.name);
    }
  }
});

test('the site script has valid syntax', () => {
  execFileSync(process.execPath, ['--check', join(DIST, 'assets', 'app.js')]);
});

test('no stale 2025 programme data left on the programme pages', () => {
  for (const name of ['pl/program.html', 'en/program.html']) {
    const text = pages.get(join(DIST, ...name.split('/'))).body.replace(/<[^>]+>/g, ' ');
    assert.doesNotMatch(text, /2025/, name);
  }
});

test('404.html is there, kept out of search engines and leads home in both languages', () => {
  const file = join(DIST, '404.html');
  assert.ok(existsSync(file), '404.html missing');
  const html = readFileSync(file, 'utf8');
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.match(html, /href="\/pl\/"/);
  assert.match(html, /href="\/en\/"/);
  assert.match(html, /\/assets\/styles\.css\?v=[a-z0-9]+"/, 'the stylesheet carries the build version');
  assert.ok(existsSync(join(DIST, 'assets', 'styles.css')));
});

test('every page has a title and a description of its own, of a length search results can show', () => {
  const titles = new Map();
  const bad = [];
  for (const page of pages.values()) {
    const title = page.html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    const description = page.html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
    titles.set(title, [...(titles.get(title) ?? []), page.name]);
    if (title.length < 10 || title.length > 70) bad.push(`${page.name}: title of ${title.length} characters`);
    if (description.length < 70 || description.length > 165) bad.push(`${page.name}: description of ${description.length} characters`);
  }
  for (const [title, names] of titles) if (names.length > 1) bad.push(`the title "${title}" is used by ${names.join(', ')}`);
  problems(bad);
});

test('event markup sits on the pages about the festival and the ensembles, with a place online and one per festival day', () => {
  const bad = [];
  for (const page of pages.values()) {
    const types = [...page.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const festival = types.find((d) => d['@type'] === 'Festival');
    const aboutFestival = /^(pl|en)\/(index|program)\.html$/.test(page.name);
    if (aboutFestival && !festival) bad.push(`${page.name}: no Festival markup`);
    if (!aboutFestival && festival) bad.push(`${page.name}: Festival markup on a page that is not about the festival`);
    for (const event of types.filter((d) => ['Festival', 'TheaterEvent'].includes(d['@type']))) {
      if (!event.location.some((l) => l['@type'] === 'VirtualLocation')) bad.push(`${page.name}: no online location`);
      if (event['@type'] === 'Festival' && !(event.subEvent?.length >= 5)) bad.push(`${page.name}: the festival days are missing`);
    }
  }
  problems(bad);
});

test('the home page of the site (/) names the site, and the pages leave indexing to the search engines', () => {
  const root = pages.get(join(DIST, 'index.html'));
  const site = [...root.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])).find((d) => d['@type'] === 'WebSite');
  assert.equal(site?.name, 'MASSKA');
  const noindex = [...pages.values()].filter((p) => /<meta name="robots" content="[^"]*noindex/.test(p.html)).map((p) => p.name);
  // no stand-in ensembles any more: nothing in the built site is kept out of the index
  assert.deepEqual(noindex, []);
});

test('the pages of the old site are redirected, www goes to the bare domain, and the sitemap has its new address', () => {
  const htaccess = readFileSync('public/.htaccess', 'utf8');
  assert.match(htaccess, /RewriteCond %\{HTTP_HOST\} \^www\\./);
  assert.match(htaccess, /RewriteRule \^sitemap\\.xml\$ \/sitemap-index\.xml \[R=301,L\]/);
  // the ensemble pages of the 2025 edition that search engines know (from its sitemap)
  const old = [
    'pl/teatr-danza-mobile', 'pl/teatr-krug-ii', 'pl/teatr-lik', 'pl/teatr-otczapy', 'pl/teatr-parostky-szczesliwi-wygnancy',
    'pl/teatr-parostky', 'pl/teatr-rambazamba', 'pl/teatr-tur', 'pl/trupa-mtt',
    'en/danza-mobile', 'en/krug-ii', 'en/lik', 'en/otczapy-theater', 'en/parostky-happy-exiles', 'en/parostky',
    'en/rambazamba', 'en/troupe-mtt', 'en/tur',
  ];
  const rules = [...htaccess.matchAll(/RewriteRule \^((?:pl|en)\/\([^ ]+\)\\.html\$) \/(pl|en)\/online\.html \[R=301,L\]/g)].map((m) => new RegExp(m[1]));
  const bad = old.filter((path) => !rules.some((rule) => rule.test(`${path}.html`)) || existsSync(join(DIST, `${path}.html`)));
  problems(bad);
});

test('the programme pages list every entry of the programme, in both languages, with no filler left', () => {
  const expected = 26; // 4 + 4 + 5 + the gala + 6 + 6 entries, see src/data/program.ts
  for (const name of ['pl/program.html', 'en/program.html']) {
    const page = pages.get(join(DIST, ...name.split('/')));
    assert.equal((page.body.match(/<time class="program__time"/g) ?? []).length, expected, name);
    assert.doesNotMatch(page.body, /lorem|ipsum|zaślepk|placeholder/i, name);
    const festival = [...page.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])).find((d) => d['@type'] === 'Festival');
    assert.equal(festival.subEvent.length, expected, `${name}: one Event per entry in the structured data`);
    assert.ok(festival.subEvent.every((e) => /^2026-11-1[3-8]T\d\d:\d\d:00\+01:00$/.test(e.startDate)), name);
  }
  const pl = pages.get(join(DIST, 'pl', 'program.html')).body;
  for (const text of ['Dziadek', 'Amatorzy', 'Mamuszki 14', 'Toż/samość', 'Kto szuka, też błądzi', 'W kolejce… ale po co?']) assert.ok(pl.includes(text), text);
});
