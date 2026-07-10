const fs = require('fs');
const path = require('path');

const PL_DIR = path.join(__dirname, '../pl');
const EN_DIR = path.join(__dirname, '../en');
const OUT_PL_DIR = path.join(__dirname, '../src/content/theatres/pl');
const OUT_EN_DIR = path.join(__dirname, '../src/content/theatres/en');

// Ensure output directories exist
fs.mkdirSync(OUT_PL_DIR, { recursive: true });
fs.mkdirSync(OUT_EN_DIR, { recursive: true });

// Map of file names to consistent IDs
const fileMap = [
  { pl: 'teatr-baltazar.html', en: 'baltazar.html', id: 'baltazar' },
  { pl: 'teatr-danza-mobile.html', en: 'danza-mobile.html', id: 'danza-mobile' },
  { pl: 'teatr-krug-ii.html', en: 'krug-ii.html', id: 'krug-ii' },
  { pl: 'teatr-lik.html', en: 'lik.html', id: 'lik' },
  { pl: 'teatr-otczapy.html', en: 'otczapy-theater.html', id: 'otczapy' },
  { pl: 'teatr-parostky-szczesliwi-wygnancy.html', en: 'parostky-happy-exiles.html', id: 'parostky-happy-exiles' },
  { pl: 'teatr-parostky.html', en: 'parostky.html', id: 'parostky' },
  { pl: 'teatr-rambazamba.html', en: 'rambazamba.html', id: 'rambazamba' },
  { pl: 'teatr-tur.html', en: 'tur.html', id: 'tur' },
  { pl: 'trupa-mtt.html', en: 'troupe-mtt.html', id: 'mtt' }
];

// Helper to extract regex matches
function getMatch(content, regex, defaultVal = '') {
  const match = content.match(regex);
  return match ? match[1].trim() : defaultVal;
}

// Robust section text extraction
function extractSectionContent(content, headingRegex) {
  const headingMatch = content.match(headingRegex);
  if (!headingMatch) return '';
  const startIndex = headingMatch.index + headingMatch[0].length;
  
  const subContent = content.substring(startIndex);
  // End section at next <section>, next <h2> or end of the current section
  const endMatch = subContent.match(/(?:<\/div>\s*<\/section>|<section|<h2|<\/section>)/i);
  const sectionText = endMatch ? subContent.substring(0, endMatch.index) : subContent;
  
  const paragraphs = sectionText.match(/<p>[\s\S]*?<\/p>/g);
  return paragraphs ? paragraphs.join('\n').trim() : '';
}

function parseFile(filePath, lang, id) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Badge and Country Code - search for the exact badge line to avoid greedy/nesting matching issues
  const badgeLine = content.split('\n').find(line => line.includes('class="badge"'));
  const badgeHtml = badgeLine ? badgeLine.match(/<span class="badge">([\s\S]+)<\/span>/)[1].trim() : '';
  const countryCode = getMatch(badgeHtml, /class="fi fi-([a-z]{2})"/, 'pl');
  const badgeText = badgeHtml.replace(/<span[^>]*>.*?<\/span>/g, '').replace(/\s+/g, ' ').replace('·', '·').trim();

  // Name (Ensemble Name)
  const name = getMatch(content, /<h1>([\s\S]*?)<\/h1>/);

  // Synopsis (Intro next to title in hero)
  const synopsisRegex = /<h1>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/;
  const synopsis = getMatch(content, synopsisRegex);

  // Recording URL
  const recordingRegex = /<a class="button primary" href="([^"]+)"/;
  const recordingUrl = getMatch(content, recordingRegex);

  // Info panel details
  const showTitle = getMatch(content, /<dt>(?:Tytuł|Title)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/);
  const city = getMatch(content, /<dt>(?:Miasto|City)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/);
  const genre = getMatch(content, /<dt>(?:Gatunek|Genre)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/);
  const duration = getMatch(content, /<dt>(?:Czas trwania|Runtime)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/);
  const accessibility = getMatch(content, /<dt>(?:Dostępność|Accessibility)<\/dt>\s*<dd>([\s\S]*?)<\/dd>/);

  // Dynamic chips fallback
  const subtitlesRegex = lang === 'pl' ? /Napisy:\s*([^\n<]+)/i : /Subtitles:\s*([^\n<]+)/i;
  const subtitles = getMatch(content, subtitlesRegex, 'PL');

  // Video Section
  const videoYtId = getMatch(content, /data-yt-id="([^"]+)"/);
  const videoTitle = getMatch(content, /data-title="([^"]+)"/);

  // Quote
  const quote = getMatch(content, /<blockquote class="pull-quote">„?([^”]+)”*<\/blockquote>/);

  // Detailed show description
  const aboutShow = extractSectionContent(content, /<h2[^>]*>(?:Opis spektaklu|O spektaklu|Synopsis)<\/h2>/i);

  // About Ensemble
  const about = extractSectionContent(content, /<h2[^>]*>(?:O zespole|About the ensemble)<\/h2>/i);

  // Ensemble History
  const history = extractSectionContent(content, /<h2[^>]*>(?:Historia zespołu|Ensemble history)<\/h2>/i) || undefined;

  // Contact info
  const contactBlock = getMatch(content, /<ul class="contact-list">([\s\S]*?)<\/ul>/);
  let contactRole = undefined;
  let contactName = undefined;
  let contactEmail = undefined;
  let contactSocialText = undefined;
  let contactSocialUrl = undefined;

  if (contactBlock) {
    // Find role/name (look for e.g. "Reżyser: Sofia Nesterova" or "Role: Name")
    const roleNameMatch = contactBlock.match(/<li>([^:]+):\s*([^\n<]+)<\/li>/);
    if (roleNameMatch) {
      const parsedRole = roleNameMatch[1].trim();
      if (parsedRole !== 'Email' && parsedRole !== 'Social media') {
        contactRole = parsedRole;
        contactName = roleNameMatch[2].trim();
      }
    }
    // Find email
    contactEmail = getMatch(contactBlock, /href="mailto:([^"]+)"/);
    // Find social media
    const socialMatch = contactBlock.match(/href="([^"]+)"[^>]*>([^\n<]+)<\/a>/);
    if (socialMatch && !socialMatch[1].startsWith('mailto:')) {
      contactSocialUrl = socialMatch[1].trim();
      contactSocialText = socialMatch[2].trim();
    }
  }

  // Gallery
  const galleryBlock = getMatch(content, /<div class="theatre-gallery__track">([\s\S]*?)<\/div>\s*<\/div>/);
  const gallery = [];
  if (galleryBlock) {
    const figureRegex = /<figure>[\s\S]*?<img src="([^"]+)"[^>]*alt="([^"]+)"[\s\S]*?<\/figure>/g;
    let figMatch;
    while ((figMatch = figureRegex.exec(galleryBlock)) !== null) {
      const imgSrc = figMatch[1].replace(/^\.\.\/assets\//, '/assets/');
      gallery.push({
        src: imgSrc,
        alt: figMatch[2].trim()
      });
    }
  }

  return {
    id,
    name,
    showTitle,
    countryCode,
    badgeText,
    genre,
    duration,
    subtitles,
    city,
    accessibility,
    videoYtId,
    videoTitle,
    recordingUrl: recordingUrl || undefined,
    quote: quote || undefined,
    contactRole,
    contactName,
    contactEmail: contactEmail || undefined,
    contactSocialText,
    contactSocialUrl,
    gallery,
    synopsis,
    aboutShow,
    about,
    history
  };
}

function writeMarkdown(data, outPath) {
  let yaml = '---\n';
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    if (typeof value === 'string') {
      if (value.includes('\n')) {
        yaml += `${key}: |\n` + value.split('\n').map(line => `  ${line}`).join('\n') + '\n';
      } else {
        yaml += `${key}: ${JSON.stringify(value)}\n`;
      }
    } else if (Array.isArray(value)) {
      yaml += `${key}:\n`;
      value.forEach(item => {
        yaml += `  - src: ${JSON.stringify(item.src)}\n`;
        yaml += `    alt: ${JSON.stringify(item.alt)}\n`;
      });
    } else {
      yaml += `${key}: ${JSON.stringify(value)}\n`;
    }
  }
  yaml += '---\n';

  fs.writeFileSync(outPath, yaml, 'utf8');
}

// Run migration
fileMap.forEach(item => {
  // Migrate PL
  try {
    const plPath = path.join(PL_DIR, item.pl);
    if (fs.existsSync(plPath)) {
      const data = parseFile(plPath, 'pl', item.id);
      writeMarkdown(data, path.join(OUT_PL_DIR, `${item.id}.md`));
      console.log(`Migrated PL: ${item.pl} -> ${item.id}.md`);
    }
  } catch (err) {
    console.error(`Error migrating PL ${item.pl}:`, err);
  }

  // Migrate EN
  try {
    const enPath = path.join(EN_DIR, item.en);
    if (fs.existsSync(enPath)) {
      const data = parseFile(enPath, 'en', item.id);
      writeMarkdown(data, path.join(OUT_EN_DIR, `${item.id}.md`));
      console.log(`Migrated EN: ${item.en} -> ${item.id}.md`);
    }
  } catch (err) {
    console.error(`Error migrating EN ${item.en}:`, err);
  }
});

console.log('Migration of theatre profiles completed!');
