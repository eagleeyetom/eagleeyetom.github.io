import { z, defineCollection } from 'astro:content';

const theatresCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    showTitle: z.string(),
    countryCode: z.string().length(2),
    badgeText: z.string(),
    genre: z.string(),
    duration: z.string(),
    subtitles: z.string(),
    city: z.string(),
    accessibility: z.string().optional(),
    language: z.string().optional(),
    videoYtId: z.string(),
    videoTitle: z.string(),
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
    })),
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
