// Renders a clip page to an MP4 video (1920x1080, 30 fps) with ffmpeg.
//
//   python tools/promo/assets.py                         (once: the poster cut-outs the clips use)
//   node tools/promo/render.mjs [pl|en] [clip|stage] [out.mp4]
//
// clip  - the poster on white (clip.html), saved as design/promo/masska-2026-zapowiedz-<lang>.mp4
// stage - the dark theatre with spotlights (stage.html), saved as design/promo/masska-2026-scena-<lang>.mp4
//
// Needs ffmpeg on the PATH and the Playwright browser of the tests (npx playwright install chromium,
// or Chrome installed).
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const lang = process.argv[2] === 'en' ? 'en' : 'pl';
const name = process.argv[3] === 'stage' ? 'stage' : 'clip';
const out = resolve(process.argv[4] ?? resolve(here, '../../design/promo', `masska-2026-${name === 'stage' ? 'scena' : 'zapowiedz'}-${lang}.mp4`));
const FPS = 30;
const SECONDS = 10;

mkdirSync(dirname(out), { recursive: true });

// The page reads its fonts and cut-outs from disk, which Chrome allows only with this switch
const args = ['--allow-file-access-from-files'];
const browser = await chromium.launch({ channel: 'chrome', args }).catch(() => chromium.launch({ args }));
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(`${pathToFileURL(resolve(here, `${name}.html`)).href}?lang=${lang}`);
await page.evaluate(() => window.ready);

const ffmpeg = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    out,
], { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((ok, fail) => ffmpeg.on('close', (code) => (code === 0 ? ok() : fail(new Error(`ffmpeg exited with ${code}`)))));

const frames = FPS * SECONDS;
for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.render(t), i / FPS);
    const png = await page.screenshot({ type: 'png' });
    if (!ffmpeg.stdin.write(png)) await new Promise((r) => ffmpeg.stdin.once('drain', r));
    if (i % FPS === 0) process.stdout.write(`${i / FPS}s `);
}
ffmpeg.stdin.end();
await done;
await browser.close();
console.log(`\n${out}`);
