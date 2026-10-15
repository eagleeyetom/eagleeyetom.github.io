// Current festival edition: the single place to update dates, venues and numbering.
// Everything marked PLACEHOLDER still waits for the confirmed 2026 details.

export type Lang = 'pl' | 'en';

export const edition = {
  number: 25,
  numeral: 'XXV',
  year: 2026,
  firstYear: 2002,

  // PLACEHOLDER: set to true once the dates below are final; until then the page
  // marks dates as provisional and the countdown says so
  datesConfirmed: false,
  // PLACEHOLDER dates (used by the countdown and structured data)
  start: '2026-11-16T10:00:00+01:00',
  end: '2026-11-20T22:00:00+01:00',

  dateLabel: {
    pl: 'XX–XX listopada 2026', // PLACEHOLDER
    en: 'XX–XX November 2026', // PLACEHOLDER
  },
  city: { pl: 'Sopot', en: 'Sopot' },

  // Masska always takes place at Teatr Atelier
  venue: {
    name: 'Teatr Atelier im. Agnieszki Osieckiej',
    shortName: 'Teatr Atelier',
    street: 'al. Franciszka Mamuszki 2',
    city: 'Sopot',
    country: 'PL',
    mapsQuery: 'Teatr Atelier im. Agnieszki Osieckiej, al. Franciszka Mamuszki 2, Sopot',
  },

  poster: '../assets/img/plakaty/2026.webp',
  posterSize: { width: 900, height: 1277 },
} as const;

export function editionNumeral(year: number): string {
  const n = year - edition.firstYear + 1;
  const table: [number, string][] = [
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let rest = n;
  let out = '';
  for (const [value, symbol] of table) {
    while (rest >= value) {
      out += symbol;
      rest -= value;
    }
  }
  return out;
}

export interface PosterEntry {
  year: number;
  numeral: string;
  src: string | null;
}

// Posters newest first; null where the archive has no poster yet
const posterFiles: Record<number, string | null> = {
  2026: '../assets/img/plakaty/2026.webp',
  2025: '../assets/img/plakaty/2025.webp',
  2024: null,
  2023: '../assets/img/plakaty/2023.webp',
  2022: '../assets/img/plakaty/2022.webp',
  2021: '../assets/img/plakaty/2021.webp',
  2020: '../assets/img/plakaty/2020.webp',
  2019: '../assets/img/plakaty/2019.webp',
  2018: '../assets/img/plakaty/2018.webp',
  2017: '../assets/img/plakaty/2017.webp',
  2016: '../assets/img/plakaty/2016.webp',
  2015: '../assets/img/plakaty/2015.webp',
  2014: '../assets/img/plakaty/2014.webp',
  2013: '../assets/img/plakaty/2013.webp',
};

export const posterArchive: PosterEntry[] = Object.entries(posterFiles)
  .map(([year, src]) => ({ year: Number(year), numeral: editionNumeral(Number(year)), src }))
  .sort((a, b) => b.year - a.year);
