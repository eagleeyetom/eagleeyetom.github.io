const fs = require('fs');
const path = require('path');

const PL_DIR = path.join(__dirname, '../pl');
const EN_DIR = path.join(__dirname, '../en');
const OUT_PL_DIR = path.join(__dirname, '../src/pages/pl');
const OUT_EN_DIR = path.join(__dirname, '../src/pages/en');

// Ensure directories exist
fs.mkdirSync(OUT_PL_DIR, { recursive: true });
fs.mkdirSync(OUT_EN_DIR, { recursive: true });

const pages = [
  { pl: 'index.html', en: 'index.html', outPl: 'index.astro', outEn: 'index.astro', redirectToPreferredLanguage: false },
  { pl: 'program.html', en: 'program.html', outPl: 'program.astro', outEn: 'program.astro' },
  { pl: 'kontakt.html', en: 'contact.html', outPl: 'kontakt.astro', outEn: 'contact.astro' },
  { pl: 'cookies.html', en: 'cookies.html', outPl: 'cookies.astro', outEn: 'cookies.astro' }
];

function getMatch(content, regex, defaultVal = '') {
  const match = content.match(regex);
  return match ? match[1].trim() : defaultVal;
}

function migratePage(filePath, outPath, lang, redirectToPreferredLanguage = true) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Title and Description
  const title = getMatch(content, /<title>([\s\S]*?)<\/title>/);
  const description = getMatch(content, /<meta name="description"\s+content="([^"]+)"/) || getMatch(content, /<meta content="([^"]+)"\s+name="description"/);

  // Extract <main> content
  const mainRegex = /<main[^>]*>([\s\S]*?)<\/main>/i;
  let mainContent = getMatch(content, mainRegex);

  // Strip partners section to avoid duplication (since BaseLayout already renders <Partners />)
  const partnersRegex = /<section[^>]*aria-labelledby="(?:partnerzy|partners-title)"[\s\S]*?<\/section>/gi;
  mainContent = mainContent.replace(partnersRegex, '');

  // Strip scripts if they import app.js (since BaseLayout imports it globally)
  mainContent = mainContent.replace(/<script[^>]*app\.js[^>]*><\/script>/gi, '');

  // Replace relative asset paths with absolute paths
  mainContent = mainContent.replace(/\.\.\/assets\//g, '/assets/');

  // Determine if partners should be shown (showPartners is false for contact and cookies)
  const showPartners = !outPath.includes('kontakt') && !outPath.includes('contact') && !outPath.includes('cookies');

  const astroContent = `---
import BaseLayout from '${outPath.includes('pl/') ? '../../layouts/BaseLayout.astro' : '../../layouts/BaseLayout.astro'}';

// Static page generated automatically from HTML
---
<BaseLayout
  title="${title}"
  description="${description}"
  lang="${lang}"
  showPartners={${showPartners}}
  redirectToPreferredLanguage={${redirectToPreferredLanguage}}
>
${mainContent}
</BaseLayout>
`;

  fs.writeFileSync(outPath, astroContent, 'utf8');
}

// Migrate pages
pages.forEach(item => {
  // Polish Page
  try {
    const plPath = path.join(PL_DIR, item.pl);
    if (fs.existsSync(plPath)) {
      const outPlPath = path.join(OUT_PL_DIR, item.outPl);
      migratePage(plPath, outPlPath, 'pl', item.redirectToPreferredLanguage);
      console.log(`Migrated static PL page: ${item.pl} -> ${item.outPl}`);
    }
  } catch (err) {
    console.error(`Error migrating static PL page ${item.pl}:`, err);
  }

  // English Page
  try {
    const enPath = path.join(EN_DIR, item.en);
    if (fs.existsSync(enPath)) {
      const outEnPath = path.join(OUT_EN_DIR, item.outEn);
      migratePage(enPath, outEnPath, 'en', item.redirectToPreferredLanguage);
      console.log(`Migrated static EN page: ${item.en} -> ${item.outEn}`);
    }
  } catch (err) {
    console.error(`Error migrating static EN page ${item.en}:`, err);
  }
});

console.log('Migration of static pages completed!');
