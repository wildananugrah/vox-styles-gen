import { z } from 'zod';

// Collage style ("style": "collage"): one speaker, a talk boiled down to numbered lessons.
// Every visible string lives in content.json; the layout is fixed by the engine, so the
// limits below are what fits it. Markup in captions: ==text== yellow highlighter.

const time = z.string().regex(/^\d{1,2}:\d{2}(:\d{2})?$/, 'mm:ss or h:mm:ss');
const strip = (max = 17) => z.string().max(max).describe('Barlow Condensed caps on a tilted strip');
const caption = z.string().max(150).describe('Archivo caption; ==text== for the highlighter, at most 2 per caption')
  .refine((s) => (s.match(/==(.+?)==/g) || []).length <= 2, 'at most 2 ==highlights==');

const hero = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('quote'), text: z.string().max(64).describe('Newsreader italic pull quote') }),
  z.object({ kind: z.literal('big'), text: z.string().max(6).describe('huge word or number, circled'), sub: z.string().max(32) }),
]);

export const lessonSchema = z.object({
  title: z.tuple([strip(15), strip()]),
  time,
  stamp: z.string().max(10),
  cross: z.boolean().optional().describe('scribble a red X over the stamp'),
  hero,
  caption,
  note: z.string().max(20).describe('Caveat Brush handwriting'),
});

export const contentSchema = z.object({
  style: z.literal('collage'),
  fps: z.number().int().default(30),
  title: z.string(),
  photo: z.object({ cutout: z.string(), face: z.string() }).describe('files under public/, made by scripts/cutout.mjs'),
  badge: z.string().max(40).describe('text around the round face badge'),
  hook: z.object({ tape: z.string().max(34), strips: z.tuple([strip(20), strip()]), caption, note: z.string().max(18), stamp: z.string().max(10) }),
  intro: z.object({ tape: z.string().max(34), strips: z.tuple([z.string().max(9), z.string().max(9)]), quote: z.string().max(26), caption: caption.max(70), note: z.string().max(18), stamp: z.string().max(8) }),
  lessons: z.array(lessonSchema).min(3).max(7),
  bonus: z.object({
    tape: z.string().max(40), strips: z.tuple([strip(), strip()]), stamp: z.string().max(14),
    items: z.array(z.object({ word: z.string().max(10), text: z.string().max(22) })).length(3),
    note: z.string().max(20),
  }),
  end: z.object({ strips: z.tuple([strip(12), strip(12)]), caption: caption.max(60), note: z.string().max(18), tape: z.string().max(34) }),
});

export type CollageContent = z.infer<typeof contentSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
