// Current festival edition: the single place to update dates, venues and numbering.
// Everything marked PLACEHOLDER still waits for the confirmed 2026 details.

export type Lang = 'pl' | 'en';

// 13 November is at the chamber stage of Teatr Wybrzeże, 15-18 November at Teatr Atelier
const atelier = {
  name: 'Teatr Atelier im. Agnieszki Osieckiej',
  shortName: 'Teatr Atelier',
  street: 'al. Franciszka Mamuszki 2',
  city: 'Sopot',
  country: 'PL',
  mapsQuery: 'Teatr Atelier im. Agnieszki Osieckiej, al. Franciszka Mamuszki 2, Sopot',
} as const;

const wybrzeze = {
  name: 'Scena Kameralna Teatru Wybrzeże',
  shortName: 'Scena Kameralna Teatru Wybrzeże',
  street: 'al. Bohaterów Monte Cassino 30',
  city: 'Sopot',
  country: 'PL',
  mapsQuery: 'Scena Kameralna Teatru Wybrzeże, al. Bohaterów Monte Cassino 30, Sopot',
} as const;

export const edition = {
  number: 25,
  numeral: 'XXV',
  year: 2026,
  firstYear: 2002,

  // Dates are confirmed: one day on its own (13 November) and then four days (15-18 November).
  // The opening and closing times are still guesses (used by the countdown only).
  datesConfirmed: true,
  start: '2026-11-13T10:00:00+01:00',
  end: '2026-11-18T22:00:00+01:00',
  // The festival days, one per programme day, and where each takes place
  days: [
    { date: '2026-11-13', venue: wybrzeze },
    { date: '2026-11-15', venue: atelier },
    { date: '2026-11-16', venue: atelier },
    { date: '2026-11-17', venue: atelier },
    { date: '2026-11-18', venue: atelier },
  ],
  // The same, grouped for the places where the dates are listed
  places: [
    { when: { pl: '13.11', en: '13 Nov' }, venue: wybrzeze },
    { when: { pl: '15–18.11', en: '15–18 Nov' }, venue: atelier },
  ],
  schedule: [
    { start: '2026-11-13T10:00:00+01:00', end: '2026-11-13T22:00:00+01:00' },
    { start: '2026-11-15T10:00:00+01:00', end: '2026-11-15T22:00:00+01:00' },
    { start: '2026-11-16T10:00:00+01:00', end: '2026-11-16T22:00:00+01:00' },
    { start: '2026-11-17T10:00:00+01:00', end: '2026-11-17T22:00:00+01:00' },
    { start: '2026-11-18T10:00:00+01:00', end: '2026-11-18T22:00:00+01:00' },
  ],

  dateLabel: {
    pl: '13 oraz 15–18 listopada 2026',
    en: '13 and 15–18 November 2026',
  },
  city: { pl: 'Sopot', en: 'Sopot' },

  // The main venue (footer, map): Teatr Atelier; both venues are in `venues` and `places`
  venue: atelier,
  venues: { atelier, wybrzeze },

  // The figure of the poster without its lettering, used in the hero next to the cut-out title
  posterArt: '../assets/img/plakaty/2026-art.webp',
  posterArtSize: { width: 900, height: 1246 },
  posterArtAlt: {
    pl: 'Ilustracja z plakatu XXV edycji MASSKA: postać w czerwonym meloniku, na którym stoją świeczki w kształcie liczby 25. Twarz bez oczu, z rastrowych kropek, ma tylko usta; czarny frak i muszka.',
    en: 'Illustration from the poster of the XXV MASSKA edition: a figure in a red bowler hat with candles shaped like the number 25 on top. The eyeless face, made of halftone dots, has only lips; a black tailcoat and bow tie.',
  },
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

/** "piątek, 13 listopada 2026" / "Friday, 13 November 2026" */
export function dayLabel(iso: string, lang: Lang): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
