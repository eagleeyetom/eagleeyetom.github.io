import { z, defineCollection } from 'astro:content';

const theatresCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    showTitle: z.string(),
    countryCode: z.string().length(2),
    // Country as written on the page ("Japonia" / "Japan") and the world region it is filed under
    country: z.string(),
    region: z.enum(['europe', 'asia', 'americas', 'africa', 'oceania']),
    // true while the entry is a stand-in: the page says so and is kept out of search engines
    placeholder: z.boolean().default(false),
    // Free text, e.g. "od XX do XX listopada 2026"; shown on the card and the page
    availability: z.string().optional(),
    badgeText: z.string(),
    genre: z.string(),
    duration: z.string(),
    subtitles: z.string(),
    city: z.string(),
    accessibility: z.string().optional(),
    language: z.string().optional(),
    // Without a video the page shows a "coming online" panel instead of the player
    videoYtId: z.string().optional(),
    videoTitle: z.string().optional(),
    recordingUrl: z.string().optional(),
    quote: z.string().optional(),
    contactRole: z.string().optional(),
    contactName: z.string().optional(),
    contactEmail: z.string().optional(),
    contactSocialText: z.string().optional(),
    contactSocialUrl: z.string().optional(),
    gallery: z.array(z.object({
      src: z.string(),
      alt: z.string()
    })).default([]),
    credits: z.object({
      title: z.string(),
      items: z.array(z.object({
        label: z.string(),
        value: z.string()
      }))
    }).optional(),
    synopsis: z.string(),
    aboutShow: z.string(),
    about: z.string().optional(),
    history: z.string().optional()
  })
});

export const collections = {
  theatres: theatresCollection,
};
