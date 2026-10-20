import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = 'https://masska.org';

export default defineConfig({
  site,
  output: 'static',
  build: {
    format: 'file'
  },
  integrations: [
    sitemap({
      // Stand-in ensemble pages (zespol-xx / ensemble-xx) are noindex, so they stay out of the
      // sitemap as well; real ensembles get their own slugs and are listed automatically
      filter: (page) => !/\/(zespol|ensemble)-[a-z]{2}(\.html)?$/.test(page),
      // With build.format 'file' the sitemap lists extensionless URLs, but the pages live at
      // /pl/program.html and the canonical links say so: list the real addresses
      serialize(item) {
        const path = item.url.slice(site.length).replace(/\/$/, '');
        const url = ['', '/pl', '/en'].includes(path) ? `${site}${path}/` : `${site}${path}.html`;
        return { ...item, url };
      },
    }),
  ],
});
