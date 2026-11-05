// Browser tests on the built site: accessibility, console errors, layout, and the scripts.
//   npm run build && npm run test:browser
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const PAGES = [
  '/pl/index.html', '/en/index.html',
  '/pl/program.html', '/en/program.html',
  '/pl/online.html', '/en/online.html',
  '/pl/kontakt.html', '/en/contact.html',
  '/pl/cookies.html', '/en/cookies.html',
  '/pl/dla-mediow.html', '/en/press.html',
  '/pl/teatr-baltazar.html', '/en/baltazar.html',
  '/pl/nca-armenia.html', '/en/nca-armenia.html',
];

const langOf = (url) => (url.startsWith('/en/') ? 'en' : 'pl');

/** Pre-sets what a returning visitor would have, so the page under test is not redirected or covered. */
async function visitor(page, { language = 'pl', consent = true, contrast = false } = {}) {
  await page.addInitScript(
    ({ language, consent, contrast }) => {
      try {
        // only the first time, so what the page saves later (language, contrast) is kept
        if (!localStorage.getItem('masskaModernSettings')) {
          localStorage.setItem('masskaModernSettings', JSON.stringify({ contrast, fontScale: 1, language }));
        }
        if (consent && !localStorage.getItem('masskaConsent')) {
          localStorage.setItem('masskaConsent', JSON.stringify({ media: false, analytics: false }));
        }
        sessionStorage.setItem('masskaConfetti', '1');
      } catch {}
    },
    { language, consent, contrast },
  );
}

for (const url of PAGES) {
  test.describe(url, () => {
    for (const contrast of [false, true]) {
      test(`${contrast ? 'high contrast: ' : ''}no console errors and no WCAG 2.2 AA violations`, async ({ page }) => {
        const problems = [];
        page.on('pageerror', (e) => problems.push(`error: ${e.message}`));
        page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
        page.on('requestfailed', (r) => !r.url().startsWith('data:') && problems.push(`failed request: ${r.url()}`));
        page.on('response', (r) => r.status() >= 400 && problems.push(`${r.status()}: ${r.url()}`));

        await visitor(page, { language: langOf(url), contrast });
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        expect(problems).toEqual([]);

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
      });
    }

    for (const width of [320, 375, 768, 1280]) {
      test(`no horizontal scroll at ${width}px`, async ({ page }) => {
        await visitor(page, { language: langOf(url) });
        await page.setViewportSize({ width, height: 800 });
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
}

test.describe('countdown', () => {
  const at = async (page, time) => {
    await page.clock.setFixedTime(new Date(time));
    await visitor(page);
    await page.goto('/pl/index.html');
    return page.locator('[data-countdown]');
  };

  test('counts down to the opening before the festival', async ({ page }) => {
    const box = await at(page, '2026-11-01T12:00:00+01:00');
    await expect(box).toBeVisible();
    await expect(box.locator('[data-countdown-label]')).toContainText('Do otwarcia festiwalu');
    await expect(box.locator('[data-countdown-part]').nth(0)).toHaveText('11');
    await expect(box.locator('[data-countdown-part]').nth(1)).toHaveText('22');
  });

  test('says the festival is on during a festival day', async ({ page }) => {
    const box = await at(page, '2026-11-13T12:00:00+01:00');
    await expect(box.locator('.countdown__live')).toBeVisible();
    await expect(box.locator('.countdown__units')).toBeHidden();
  });

  test('counts to the next day in the break between the 13th and the 15th', async ({ page }) => {
    const box = await at(page, '2026-11-14T12:00:00+01:00');
    await expect(box.locator('[data-countdown-label]')).toContainText('Do kolejnego dnia festiwalu');
    // the 15th starts at 14:00 (the first performance in Teatr Atelier): 26 hours from noon on the 14th
    await expect(box.locator('[data-countdown-part]').nth(0)).toHaveText('1');
    await expect(box.locator('[data-countdown-part]').nth(1)).toHaveText('02');
  });

  test('disappears after the last day', async ({ page }) => {
    const box = await at(page, '2026-11-19T12:00:00+01:00');
    await expect(box).toBeHidden();
  });
});

test.describe('language', () => {
  test('a visitor whose language is English is taken to the English page', async ({ page }) => {
    await visitor(page, { language: 'en' });
    await page.goto('/pl/program.html');
    await expect(page).toHaveURL(/\/en\/program\.html$/);
  });

  test('the language buttons lead to the matching page', async ({ page }) => {
    await visitor(page, { language: 'pl' });
    await page.goto('/pl/kontakt.html');
    await page.getByRole('link', { name: 'EN – English' }).click();
    await expect(page).toHaveURL(/\/en\/contact\.html$/);
  });

  test('the home page of the site sends visitors to their language', async ({ page }) => {
    await visitor(page, { language: 'en' });
    await page.goto('/index.html');
    await expect(page).toHaveURL(/\/en\/$/);
  });
});

test.describe('text size and contrast buttons', () => {
  test('A+ scales the text once (130% is 22.1px, not more)', async ({ page }) => {
    await visitor(page);
    await page.goto('/pl/index.html');
    const plus = page.getByRole('button', { name: /A\+/ });
    for (let i = 0; i < 3; i++) await plus.click();
    await expect(page.locator('[data-font-indicator]')).toHaveText('130%');
    await expect
      .poll(() => page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize)))
      .toBeCloseTo(22.1, 1);
  });

  test('high contrast switches the page and is remembered', async ({ page }) => {
    await visitor(page);
    await page.goto('/pl/index.html');
    await page.getByRole('button', { name: 'Wysoki kontrast' }).click();
    await expect(page.locator('body')).toHaveClass(/high-contrast/);
    await page.reload();
    await expect(page.locator('body')).toHaveClass(/high-contrast/);
  });
});

test.describe('cookie banner', () => {
  test('is shown to a new visitor, can be refused, and stays away afterwards', async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('masskaConfetti', '1'));
    await page.goto('/pl/index.html');
    const banner = page.locator('[data-consent-banner]');
    await expect(banner).toBeVisible();
    await banner.getByRole('button', { name: 'Odrzuć zbędne' }).click();
    await expect(banner).toBeHidden();
    await page.reload();
    await expect(banner).toBeHidden();
    const consent = await page.evaluate(() => JSON.parse(localStorage.getItem('masskaConsent')));
    expect(consent).toEqual({ media: false, analytics: false });
  });

  test('nothing is sent to Google before consent', async ({ page }) => {
    const external = [];
    page.on('request', (r) => /google|youtube|gstatic/.test(new URL(r.url()).hostname) && external.push(r.url()));
    await page.addInitScript(() => sessionStorage.setItem('masskaConfetti', '1'));
    await page.goto('/pl/index.html');
    await page.goto('/pl/teatr-baltazar.html');
    await page.waitForLoadState('networkidle');
    expect(external).toEqual([]);
  });

  test('Google Analytics loads with the id of the property once analytics are accepted, and again on the next page', async ({ page }) => {
    const loaded = [];
    // the script is answered here, so the test sends nothing to Google
    await page.route(/googletagmanager\.com|google-analytics\.com/, (route) => {
      loaded.push(route.request().url());
      return route.fulfill({ contentType: 'text/javascript', body: '' });
    });
    await page.addInitScript(() => sessionStorage.setItem('masskaConfetti', '1'));
    await page.goto('/pl/index.html');
    expect(loaded).toEqual([]);
    await page.locator('[data-consent-banner]').getByRole('button', { name: 'Akceptuj wszystko' }).click();
    await expect.poll(() => loaded.length).toBe(1);
    expect(loaded[0]).toBe('https://www.googletagmanager.com/gtag/js?id=G-CKB0FYJDGK');
    // the page_view comes from this "config" call once the library has loaded
    await expect.poll(() => page.evaluate(() =>
      [...window.dataLayer].map((a) => Array.from(a)).find((a) => a[0] === 'config')?.[1])).toBe('G-CKB0FYJDGK');

    await page.goto('/pl/teatr-baltazar.html');
    // (a visitor whose browser is English is taken on to the English page, which loads it once more)
    await expect.poll(() => loaded.length).toBeGreaterThanOrEqual(2);
  });
});

test.describe('"watch online" buttons', () => {
  // The menu in the header is collapsed, so "visible" is judged by the gate (display), not by the layout
  const gated = (page) => page.locator('[data-online]');
  const shown = async (page) => page.evaluate(() =>
    [...document.querySelectorAll('[data-online]')].map((el) => getComputedStyle(el).display !== 'none'));

  test('are hidden until MASSKA Online starts, also through the festival days', async ({ page }) => {
    await visitor(page);
    await page.clock.setFixedTime(new Date('2026-11-19T23:59:00+01:00'));
    await page.goto('/pl/index.html');
    expect(await gated(page).count()).toBeGreaterThanOrEqual(3); // header, hero, card, footer
    expect(await shown(page)).not.toContain(true);
    await expect(page.locator('html')).not.toHaveClass(/online-live/);
  });

  test('show from 20 November 2026, 0:00 on', async ({ page }) => {
    await visitor(page);
    await page.clock.setFixedTime(new Date('2026-11-20T00:00:30+01:00'));
    await page.goto('/pl/index.html');
    expect(await shown(page)).not.toContain(false);
    await expect(page.locator('.hero-actions').getByRole('link', { name: 'Oglądaj online' })).toBeVisible();
  });

  test('debug mode shows them early, is remembered, and ?debug=0 switches it off', async ({ page }) => {
    await visitor(page);
    await page.clock.setFixedTime(new Date('2026-11-01T12:00:00+01:00'));
    await page.goto('/pl/index.html?debug');
    await expect(page.locator('.hero-actions').getByRole('link', { name: 'Oglądaj online' })).toBeVisible();
    await expect(page.locator('html')).toHaveClass(/debug/);
    await page.goto('/pl/program.html'); // no ?debug here: remembered from the previous page
    await expect(page.locator('.hero-actions').getByRole('link', { name: 'Oglądaj transmisje' })).toBeVisible();
    await page.goto('/pl/index.html?debug=0');
    expect(await shown(page)).not.toContain(true);
    await expect(page.locator('html')).not.toHaveClass(/debug/);
  });

  test('debug mode follows the visitor: ?debug stays in the address when clicking through', async ({ page }) => {
    await visitor(page);
    await page.goto('/pl/index.html?debug');
    await page.locator('.hero-actions').getByRole('link', { name: 'Program' }).click();
    await expect(page).toHaveURL(/\/pl\/program\.html\?debug=1/);
    // even if the browser keeps no storage, the address carries the mode
    await page.evaluate(() => localStorage.removeItem('masskaDebug'));
    await page.locator('.hero-actions').getByRole('link', { name: 'Oglądaj transmisje' }).click();
    await expect(page).toHaveURL(/\/pl\/online\.html\?debug=1/);
    await expect(page.locator('html')).toHaveClass(/debug/);
    // external and in-page links are left alone
    const odd = await page.evaluate(() => [...document.querySelectorAll('a[href]')]
      .filter((a) => a.host !== location.host || a.getAttribute('href').startsWith('#'))
      .filter((a) => a.getAttribute('href').includes('debug')).length);
    expect(odd).toBe(0);
  });

  test('the DEBUG badge switches debug mode off with one click', async ({ page }) => {
    await visitor(page);
    await page.clock.setFixedTime(new Date('2026-11-01T12:00:00+01:00'));
    await page.goto('/pl/index.html?debug');
    await page.getByRole('button', { name: /Tryb debug włączony/ }).click();
    await expect(page).toHaveURL(/\/pl\/index\.html$/);
    await expect(page.locator('html')).not.toHaveClass(/debug/);
    expect(await shown(page)).not.toContain(true);
    // still off on the next page
    await page.goto('/pl/program.html');
    await expect(page.locator('html')).not.toHaveClass(/debug/);
    await expect(page.locator('.debug-badge')).toBeHidden();
  });

  test('the contact FAQ keeps its sentence without the link', async ({ page }) => {
    await visitor(page);
    await page.clock.setFixedTime(new Date('2026-11-01T12:00:00+01:00'));
    await page.goto('/pl/kontakt.html');
    const card = page.locator('article.card', { hasText: 'Czy spektakle są dostępne online?' });
    expect(await card.evaluate((el) => el.querySelector('p').innerText)).toMatch(/na naszej platformie online\.$/);
    expect(await card.locator('a').count()).toBe(0 + (await card.locator('a[data-online]').count()));
    expect(await card.locator('a[data-online]').evaluate((el) => getComputedStyle(el).display)).toBe('none');
    await page.goto('/pl/kontakt.html?debug');
    expect(await card.locator('p').evaluate((el) => el.innerText)).toMatch(/na naszej platformie online\.$/);
    await expect(card.getByRole('link', { name: 'platformie online' })).toBeVisible();
  });
});

test.describe('online stage', () => {
  test('lists the performances; the region filter only appears with more than one region', async ({ page }) => {
    await visitor(page);
    await page.goto('/pl/online.html');
    await expect(page.locator('.stage-card:not([hidden])')).toHaveCount(2);
    await expect(page.locator('[data-stage-filter]')).toHaveCount(0);
  });

  test('the performances start high on the page', async ({ page }) => {
    await visitor(page);
    await page.goto('/pl/online.html');
    const top = await page.locator('.stage-card').first().evaluate((el) => el.getBoundingClientRect().top);
    expect(top).toBeLessThan(800);
  });

  test('a card opens the ensemble page, which links back to the stage', async ({ page }) => {
    await visitor(page);
    await page.goto('/pl/online.html');
    await page.locator('.stage-card a').first().click();
    await expect(page.getByRole('link', { name: /Wróć do sceny online/ })).toBeVisible();
  });

  test('the world map names the countries', async ({ page }) => {
    await visitor(page);
    await page.goto('/pl/online.html');
    await expect(page.getByRole('img', { name: /Kraje uczestniczące:.*Armenia.*Węgry/ })).toBeVisible();
  });
});

test.describe('galleries and carousels', () => {
  test('the ensemble gallery scrolls with its dots', async ({ page }) => {
    await visitor(page);
    await page.goto('/pl/teatr-baltazar.html');
    const dots = page.locator('.gallery-dot');
    await expect(dots).toHaveCount(6);
    await dots.nth(1).click();
    await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
    await expect.poll(() => page.locator('.theatre-gallery__track').evaluate((el) => el.scrollLeft)).toBeGreaterThan(50);
  });

  test('the poster timeline scrolls and opens a preview', async ({ page }) => {
    await visitor(page);
    await page.goto('/pl/index.html');
    const timeline = page.locator('[data-timeline]');
    await expect(timeline.locator('.poster-item')).toHaveCount(14);
    await page.locator('.poster-link').first().click();
    await expect(page.locator('#poster-lightbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#poster-lightbox')).toBeHidden();
  });
});

test.describe('mobile menu', () => {
  test('opens, shows the links and follows one', async ({ page }) => {
    await visitor(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/pl/index.html');
    await page.getByRole('button', { name: 'Menu nawigacji' }).click();
    await page.getByRole('link', { name: 'Program', exact: true }).click();
    await expect(page).toHaveURL(/\/pl\/program\.html$/);
  });
});

test.describe('opened from disk (file://)', () => {
  const file = (path) => pathToFileURL(resolve('dist', path)).href;

  test('styles, textures and links work without a server', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await visitor(page);
    await page.goto(file('pl/index.html'));
    // the stylesheet is applied: the header tools bar has its dark background
    const bar = await page.locator('.utility-bar').evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bar).toBe('rgb(17, 17, 17)');
    // the ink-edge mask is the inlined texture (a file:// page cannot load a mask image from disk)
    const mask = await page.locator('[data-tone="dark"]').first().evaluate((el) => getComputedStyle(el, '::before').maskImage);
    expect(mask).toContain('data:image/webp');
    await page.getByRole('link', { name: 'Program', exact: true }).first().click();
    await expect(page).toHaveURL(/pl\/program\.html$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Program festiwalu');
  });

  test('the language redirect stays on disk', async ({ page }) => {
    await visitor(page, { language: 'en' });
    await page.goto(file('pl/program.html'));
    await expect(page).toHaveURL(/en\/program\.html$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Festival Program');
  });

  test('the language chooser opens a real page', async ({ page }) => {
    await visitor(page, { language: 'pl' });
    await page.goto(file('index.html'));
    await expect(page).toHaveURL(/pl\/index\.html$/);
  });
});
