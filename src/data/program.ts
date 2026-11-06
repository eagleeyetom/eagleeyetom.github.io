// The programme of the festival, day by day: the one place to change it. The pages (ProgramSchedule)
// and the structured data (one Event per entry, see BaseLayout) are made from this list.
// Titles and names of the ensembles are as announced (in Polish); the words around them (what kind of
// entry it is, the party) are given in both languages.
import { edition, type Lang } from './edition';

type Words = string | { pl: string; en: string };

export type VenueKey = 'wybrzeze' | 'atelier' | 'mamuszki14';

export interface ProgramEntry {
  /** Start, "HH:MM" (Polish time); a party or a gala may also have an end */
  time: string;
  end?: string;
  /** The ensemble, or what the entry is ("Feature film") */
  group: Words;
  /** The title of the performance, when the entry has one */
  show?: string;
  /** A word or two more: "screening", "concert", the house the ensemble comes from */
  note?: Words;
  kind?: 'film' | 'concert' | 'gala';
}

export interface ProgramSession {
  venue: VenueKey;
  entries: ProgramEntry[];
}

export interface ProgramDay {
  date: string;
  sessions: ProgramSession[];
}

// The gala is held at Mamuszki 14 (Sopot); the street is not given in the announcement
export const venues = {
  wybrzeze: { name: edition.venues.wybrzeze.name, street: edition.venues.wybrzeze.street, city: 'Sopot' },
  atelier: { name: edition.venues.atelier.name, street: edition.venues.atelier.street, city: 'Sopot' },
  mamuszki14: { name: 'Mamuszki 14', street: undefined, city: 'Sopot' },
} as const;

export const programDays: ProgramDay[] = [
  {
    date: '2026-11-13',
    sessions: [{
      venue: 'wybrzeze',
      entries: [
        { time: '10:00', group: 'Teatr MarionBrand', show: 'Dziadek' },
        { time: '12:00', group: { pl: 'Film fabularny', en: 'Feature film' }, show: 'Amatorzy', note: { pl: 'projekcja', en: 'screening' }, kind: 'film' },
        { time: '17:00', group: { pl: 'Teatro Estudio 87 i Radio Escénica', en: 'Teatro Estudio 87 and Radio Escénica' }, show: 'Sobre cómo un hombre heterosexual le rompe el corazón a otro' },
        { time: '19:00', group: 'Walny Teatr', show: 'Koncert na klarnet i orkiestrę' },
      ],
    }],
  },
  {
    date: '2026-11-15',
    sessions: [{
      venue: 'atelier',
      entries: [
        { time: '14:00', group: 'Teatr Biuro Rzeczy Osobistych', show: 'Moje miasto ’26' },
        { time: '16:00', group: 'Teatr Ubogi Relacji', show: 'Toż/samość' },
        { time: '17:00', group: 'Teatr Otczapy', show: 'Marvin' },
        { time: '19:30', group: 'Teatr Generacja', show: 'Pokoje – The Rooms' },
      ],
    }],
  },
  {
    date: '2026-11-16',
    sessions: [
      {
        venue: 'atelier',
        entries: [
          { time: '10:00', group: 'Teatr Nemno', show: 'Kamishibai – opowieści japońskie' },
          { time: '11:30', group: 'Teatr Smile', show: '21 elementów' },
          { time: '13:00', group: 'Teatr Euforion', show: '9 kochanek kawalera Dorna' },
          { time: '14:30', group: 'Teatr EF', show: 'Informacja' },
          { time: '17:00', group: { pl: 'Teatro Estudio 87 i Radio Escénica', en: 'Teatro Estudio 87 and Radio Escénica' }, show: 'Sobre cómo un hombre heterosexual le rompe el corazón a otro' },
        ],
      },
      {
        venue: 'mamuszki14',
        entries: [
          { time: '18:30', end: '21:30', group: { pl: 'Gala', en: 'Gala' }, note: { pl: 'zabawa dla uczestników przeglądu', en: 'party for the participants of the review' }, kind: 'gala' },
        ],
      },
    ],
  },
  {
    date: '2026-11-17',
    sessions: [{
      venue: 'atelier',
      entries: [
        { time: '10:00', group: 'Teatr Czy TAK, czy NIE?', show: 'Romeo i Julia, czyli Kwestia Miłości' },
        { time: '11:30', group: 'Teatr Przebudzeni', show: 'Antidotum' },
        { time: '12:30', group: 'Ksawery Męcnarowski', show: 'Z pamiętnika nerwowca', note: { pl: 'monodram', en: 'one-man show' } },
        { time: '13:15', group: 'Teatroterapia Lubelska', show: 'Nieposkromienie' },
        { time: '17:00', group: 'Grupa teatralna Po prostu', show: 'Szeptobajanie' },
        { time: '18:30', group: 'Grupa teatralna Bez przesady', show: 'Kto szuka, też błądzi' },
      ],
    }],
  },
  {
    date: '2026-11-18',
    sessions: [{
      venue: 'atelier',
      entries: [
        { time: '10:00', group: 'Teatr Łątek', show: 'Okienko' },
        { time: '11:30', group: 'Teatr BIS', show: 'A to ci teatr…' },
        { time: '12:30', group: 'Mały Big Band', show: 'Dom Kultury w Łodzi' },
        { time: '13:30', group: 'Teatr Cienie', show: 'Mojae' },
        { time: '14:30', group: 'Remont Pomp', note: { pl: 'koncert', en: 'concert' }, kind: 'concert' },
        { time: '17:00', group: 'Teatr Arlekin', show: 'W kolejce… ale po co?' },
      ],
    }],
  },
];

export const words = (text: Words | undefined, lang: Lang): string | undefined =>
  text === undefined ? undefined : typeof text === 'string' ? text : text[lang];

/** The name of an entry in one line: "Teatr Atelier – Dziadek" */
export function entryName(entry: ProgramEntry, lang: Lang): string {
  const group = words(entry.group, lang)!;
  const note = words(entry.note, lang);
  if (entry.show) return `${group} – ${entry.show}`;
  return note ? `${group} (${note})` : group;
}

export const entryCount = programDays.reduce((n, day) => n + day.sessions.reduce((m, s) => m + s.entries.length, 0), 0);

const schemaType = { film: 'ScreeningEvent', concert: 'MusicEvent', gala: 'Event' } as const;

/** One schema.org Event per entry of the programme (for the festival's structured data) */
export function performanceEvents(lang: Lang) {
  return programDays.flatMap((day) =>
    day.sessions.flatMap((session) => {
      const venue = venues[session.venue];
      return session.entries.map((entry) => ({
        '@type': entry.kind ? schemaType[entry.kind] : 'TheaterEvent',
        name: entryName(entry, lang),
        startDate: `${day.date}T${entry.time}:00+01:00`,
        ...(entry.end ? { endDate: `${day.date}T${entry.end}:00+01:00` } : {}),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: venue.name,
          address: {
            '@type': 'PostalAddress',
            ...(venue.street ? { streetAddress: venue.street } : {}),
            addressLocality: venue.city,
            addressCountry: 'PL',
          },
        },
      }));
    }),
  );
}

// The ensembles of the live festival in Sopot and where they come from (for the map on the online
// stage). Coordinates of the towns from OpenStreetMap; Teatro Estudio 87 works in two cities.
const poland = { pl: 'Polska', en: 'Poland' };
const colombia = { pl: 'Kolumbia', en: 'Colombia' };

export interface LiveEnsemble {
  name: string;
  city: string;
  country: { pl: string; en: string };
  countryCode: string;
  lat: number;
  lon: number;
}

export const liveEnsembles: LiveEnsemble[] = [
  { name: 'Teatr Ubogi Relacji', city: 'Sopot', country: poland, countryCode: 'pl', lat: 54.445, lon: 18.568 },
  { name: 'Teatr Biuro Rzeczy Osobistych', city: 'Gdynia', country: poland, countryCode: 'pl', lat: 54.516, lon: 18.54 },
  { name: 'Teatr Przebudzeni', city: 'Ostróda', country: poland, countryCode: 'pl', lat: 53.703, lon: 19.962 },
  { name: 'Stanisław Wojciechowski', city: 'Pruszcz Gdański', country: poland, countryCode: 'pl', lat: 54.261, lon: 18.646 },
  { name: 'Walny Teatr', city: 'Dzięgiel', country: poland, countryCode: 'pl', lat: 53.879, lon: 17.431 },
  { name: 'Teatr Otczapy', city: 'Września', country: poland, countryCode: 'pl', lat: 52.325, lon: 17.565 },
  { name: 'Teatr Nemno', city: 'Rzeszów', country: poland, countryCode: 'pl', lat: 50.037, lon: 22.005 },
  { name: 'Teatr Smile', city: 'Łódź', country: poland, countryCode: 'pl', lat: 51.769, lon: 19.457 },
  { name: 'Teatr Euforion', city: 'Wrocław', country: poland, countryCode: 'pl', lat: 51.109, lon: 17.033 },
  { name: 'Teatr EF', city: 'Bielsko-Biała', country: poland, countryCode: 'pl', lat: 49.822, lon: 19.045 },
  { name: 'Ksawery Męcnarowski', city: 'Bielsko-Biała', country: poland, countryCode: 'pl', lat: 49.822, lon: 19.045 },
  { name: 'Teatroterapia Lubelska', city: 'Lublin', country: poland, countryCode: 'pl', lat: 51.251, lon: 22.57 },
  { name: 'Teatr Łątek', city: 'Supraśl', country: poland, countryCode: 'pl', lat: 53.21, lon: 23.336 },
  { name: 'Teatr BIS', city: 'Gdynia', country: poland, countryCode: 'pl', lat: 54.516, lon: 18.54 },
  { name: 'Mały Big Band', city: 'Łódź', country: poland, countryCode: 'pl', lat: 51.769, lon: 19.457 },
  { name: 'Teatr Cienie', city: 'Jarosław', country: poland, countryCode: 'pl', lat: 50.016, lon: 22.68 },
  { name: 'Remont Pomp', city: 'Gdańsk', country: poland, countryCode: 'pl', lat: 54.348, lon: 18.654 },
  { name: 'Teatr Arlekin', city: 'Iława', country: poland, countryCode: 'pl', lat: 53.598, lon: 19.561 },
  { name: 'Teatro Estudio 87', city: 'Bogotá', country: colombia, countryCode: 'co', lat: 4.653, lon: -74.084 },
  { name: 'Teatro Estudio 87', city: 'Medellín', country: colombia, countryCode: 'co', lat: 6.27, lon: -75.603 },
  { name: 'Teatr Generacja (TeAtRAkcja)', city: 'Sopot', country: poland, countryCode: 'pl', lat: 54.445, lon: 18.568 },
  { name: 'Agata Frankiewicz', city: 'Łódź', country: poland, countryCode: 'pl', lat: 51.769, lon: 19.457 },
  { name: 'Teatr „Czy TAK, czy NIE?”', city: 'Toruń', country: poland, countryCode: 'pl', lat: 53.01, lon: 18.605 },
  { name: 'Grupa Teatralna „Po prostu”', city: 'Odolanów', country: poland, countryCode: 'pl', lat: 51.574, lon: 17.674 },
  { name: 'Mała Motoryka', city: 'Gdańsk', country: poland, countryCode: 'pl', lat: 54.348, lon: 18.654 },
  { name: 'Bez Przesady – Teatr po pracy', city: 'Ostróda', country: poland, countryCode: 'pl', lat: 53.703, lon: 19.962 },
];
