// Current festival edition: the single place to update dates, venues and numbering.
// Everything marked PLACEHOLDER still waits for the confirmed 2026 details.

export type Lang = 'pl' | 'en';

export const edition = {
  number: 25,
  numeral: 'XXV',
  year: 2026,
  firstYear: 2002,

  // Dates are confirmed: one day on its own (13 October) and then four days (15-18 October).
  // The opening and closing times are still guesses (used by the countdown only).
  datesConfirmed: true,
  start: '2026-10-13T10:00:00+02:00',
  end: '2026-10-18T22:00:00+02:00',
  // The festival days, one per programme day
  days: ['2026-10-13', '2026-10-15', '2026-10-16', '2026-10-17', '2026-10-18'],
  // When each day runs (the countdown follows these; times are guesses until the programme is final)
  schedule: [
    { start: '2026-10-13T10:00:00+02:00', end: '2026-10-13T22:00:00+02:00' },
    { start: '2026-10-15T10:00:00+02:00', end: '2026-10-15T22:00:00+02:00' },
    { start: '2026-10-16T10:00:00+02:00', end: '2026-10-16T22:00:00+02:00' },
    { start: '2026-10-17T10:00:00+02:00', end: '2026-10-17T22:00:00+02:00' },
    { start: '2026-10-18T10:00:00+02:00', end: '2026-10-18T22:00:00+02:00' },
  ],

  dateLabel: {
    pl: '13 oraz 15–18 października 2026',
    en: '13 and 15–18 October 2026',
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

  // Artwork without the title band, used in the hero next to the lettering
  posterArt: '../assets/img/plakaty/2026-art.webp',
  posterArtSize: { width: 900, height: 1142 },
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
  2024: '../assets/img/plakaty/2024.webp',
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

/** "wtorek, 13 października 2026" / "Tuesday, 13 October 2026" */
export function dayLabel(iso: string, lang: Lang): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
