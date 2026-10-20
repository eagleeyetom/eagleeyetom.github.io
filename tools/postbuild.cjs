const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');

const plHtml = path.join(distDir, 'pl.html');
const plDestDir = path.join(distDir, 'pl');
const plDestHtml = path.join(plDestDir, 'index.html');

const enHtml = path.join(distDir, 'en.html');
const enDestDir = path.join(distDir, 'en');
const enDestHtml = path.join(enDestDir, 'index.html');

console.log('Running post-build script to align index files...');

// Align Polish index
if (fs.existsSync(plHtml)) {
  if (!fs.existsSync(plDestDir)) {
    fs.mkdirSync(plDestDir, { recursive: true });
  }
  fs.renameSync(plHtml, plDestHtml);
  console.log(`Moved ${plHtml} -> ${plDestHtml}`);
} else {
  console.warn(`Warning: ${plHtml} not found.`);
}

// Align English index
if (fs.existsSync(enHtml)) {
  if (!fs.existsSync(enDestDir)) {
    fs.mkdirSync(enDestDir, { recursive: true });
  }
  fs.renameSync(enHtml, enDestHtml);
  console.log(`Moved ${enHtml} -> ${enDestHtml}`);
} else {
  console.warn(`Warning: ${enHtml} not found.`);
}

// ---------------------------------------------------------------------------
// Make the build work when opened straight from disk (file://) and from any base path.
// Astro emits absolute "/_astro/..." URLs and module scripts; browsers cannot resolve the
// former from file:// and block the latter (modules need CORS). So every page gets
// relative asset URLs and its module scripts inlined as classic scripts.
// ---------------------------------------------------------------------------
console.log('Relativizing asset URLs and inlining page scripts...');

function listFiles(dir, ext) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full, ext);
    return full.endsWith(ext) ? [full] : [];
  });
}

// Reads a built module and the side-effect-only modules it imports (import"./x.js"),
// dependencies first, each wrapped in its own scope so top-level names cannot collide.
function bundleModule(file, seen) {
  if (seen.has(file)) return '';
  seen.add(file);
  let code = fs.readFileSync(file, 'utf8');
  let out = '';
  code = code.replace(/import\s*["']\.\/([^"']+)["']\s*;?/g, (_, dep) => {
    out += bundleModule(path.join(path.dirname(file), dep), seen);
    return '';
  });
  if (/\b(import|export)\b\s*[\w{*"']/.test(code)) {
    throw new Error(`Cannot inline ${file}: it uses import/export beyond side-effect imports`);
  }
  return `${out}(()=>{${code}})();\n`;
}

for (const file of listFiles(distDir, '.html')) {
  const depth = path.relative(distDir, path.dirname(file)).split(path.sep).filter(Boolean).length;
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  let html = fs.readFileSync(file, 'utf8');
  const scripts = [];
  const seen = new Set();

  html = html.replace(
    /<script type="module" src="\/_astro\/([^"]+)"><\/script>/g,
    (_, name) => {
      scripts.push(bundleModule(path.join(distDir, '_astro', name), seen));
      return '';
    }
  );
  html = html.replace(/(href|src)="\/_astro\//g, `$1="${prefix}_astro/`);
  html = html.replace(/url\(\/_astro\//g, `url(${prefix}_astro/`);

  if (scripts.length) {
    const code = scripts.join('');
    if (code.includes('</script')) throw new Error(`Inlined script in ${file} contains </script`);
    html = html.replace('</body>', `<script>${code}</script>\n</body>`);
  }
  fs.writeFileSync(file, html);
}

// Fonts referenced from the built stylesheets sit next to them
for (const file of listFiles(path.join(distDir, '_astro'), '.css')) {
  const css = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, css.replace(/url\(\/_astro\//g, 'url(./'));
}

// CSS masks are fetched with CORS, which file:// pages fail ("null" origin), so the ink-edge
// texture would silently drop out and leave flat edges. Inline it into the stylesheet as a
// data: URI; over http the result is identical.
const styles = path.join(distDir, 'assets', 'styles.css');
if (fs.existsSync(styles)) {
  let css = fs.readFileSync(styles, 'utf8');
  css = css.replace(/url\((['"]?)(img\/[^'")]+\.webp)\1\)(?=\s+repeat-x)/g, (match, _quote, rel) => {
    const file = path.join(distDir, 'assets', rel);
    if (!fs.existsSync(file)) return match;
    return `url("data:image/webp;base64,${fs.readFileSync(file).toString('base64')}")`;
  });
  fs.writeFileSync(styles, css);
  console.log('Inlined mask textures into styles.css');
}

console.log('Post-build alignment complete!');
