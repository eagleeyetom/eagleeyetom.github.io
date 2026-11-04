// Draws the YouTube graphics of the channel into design/youtube/:
//   avatar-kapelusz.png, avatar-masska.png   profile picture, 800x800 (YouTube shows it as a circle)
//   baner.png, baner-strefy.png              channel banner 2560x1440, and a copy with the safe areas marked
//   znak-wodny.png                           video watermark, 150x150, transparent
//   miniatury/*.jpg                          video thumbnails 1280x720: the festival trailer, and one per
//                                            performance from src/content/theatres (pl and en)
//
//   python tools/promo/assets.py             (once: the poster cut-outs the graphics use)
//   node tools/youtube/render.mjs
//
// Run again after the ensembles' data changes: the thumbnails follow the content files. A photo of
// the performance (first picture of its gallery) is printed in the poster's red and black.
import { chromium } from '@playwright/test';
import matter from 'gray-matter';
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const out = join(root, 'design', 'youtube');
mkdirSync(join(out, 'miniatury'), { recursive: true });

const args = ['--allow-file-access-from-files'];
const browser = await chromium.launch({ channel: 'chrome', args }).catch(() => chromium.launch({ args }));
const page = await browser.newPage({ deviceScaleFactor: 1 });
await page.goto(pathToFileURL(join(here, 'youtube.html')).href);
await page.evaluate(() => window.ready);

async function shoot(kind, data, file, { jpeg = false } = {}) {
    const [width, height] = await page.evaluate(([k, d]) => window.draw(k, d), [kind, data]);
    await page.setViewportSize({ width, height });
    const path = join(out, file);
    await page.locator('#art').screenshot(jpeg ? { path, type: 'jpeg', quality: 92 } : { path, omitBackground: true });
    console.log(`  design/youtube/${file}`);
}

await shoot('avatar-hat', {}, 'avatar-kapelusz.png');
await shoot('avatar-masska', {}, 'avatar-masska.png');
await shoot('banner', {}, 'baner.png');
await shoot('banner', { guides: true }, 'baner-strefy.png');
await shoot('watermark', {}, 'znak-wodny.png');

// The festival trailer
await shoot('thumbnail', {
    kicker: 'Zapowiedź', title: '25 lat Masski',
    subtitle: 'XXV Jubileuszowy Międzynarodowy Przegląd Teatralny', footer: '13 · 15–18.11.2026',
}, 'miniatury/zapowiedz-pl.jpg', { jpeg: true });
await shoot('thumbnail', {
    kicker: 'Trailer', title: '25 years of Masska',
    subtitle: 'XXV Anniversary International Theatre Review', footer: '13 · 15–18.11.2026',
}, 'miniatury/zapowiedz-en.jpg', { jpeg: true });

// One per performance, in both languages
for (const lang of ['pl', 'en']) {
    const dir = join(root, 'src', 'content', 'theatres', lang);
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
        const d = matter(readFileSync(join(dir, file), 'utf8')).data;
        const photo = d.gallery?.[0]?.src;
        await shoot('thumbnail', {
            kicker: lang === 'pl' ? `Scena online · ${d.country}` : `Online stage · ${d.country}`,
            flag: d.countryCode,
            title: d.showTitle,
            subtitle: d.name,
            footer: 'XXV · 2026',
            photo: photo ? pathToFileURL(join(root, 'public', photo)).href : undefined,
        }, `miniatury/spektakl-${lang}-${d.id}.jpg`, { jpeg: true });
    }
}

await browser.close();
