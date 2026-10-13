import { z } from 'zod';

// content.json for the vintage-textbook style ("style": "textbook").
// Figure coordinates (labels, focus) are pixels in the ORIGINAL 1024-wide source photo;
// the plate shows rows PLATE_Y0..PLATE_Y0+398 of it (title and source line cropped off).
const rect = z.tuple([z.number(), z.number(), z.number(), z.number()]);

const item = z.object({
  n: z.string().min(1).max(28).describe('Name as in the draft'),
  v: z.string().min(1).max(12).describe('Fibre value, e.g. "~2,6 g"'),
  note: z.string().min(1).max(50),
  fig: z.string().min(1).max(14).describe('Short label printed on the figure'),
  labels: z.array(rect).min(1).max(3).describe('Baked-in photo labels to cover, [x1,y1,x2,y2]'),
  focus: z.tuple([z.number(), z.number()]).describe('Point the camera zooms to'),
});

const plate = z.object({
  title: z.string().min(1).max(16),
  sub: z.string().min(1).max(36),
  warn: z.boolean().optional(),
  image: z.string().min(1),
  caption: z.string().min(1).max(40),
  items: z.array(item).min(2).max(5),
});

const bar = z.object({ label: z.string().max(10), lo: z.number(), hi: z.number(), v: z.string().max(14) });

export const contentSchema = z.object({
  style: z.literal('textbook'),
  title: z.string().min(1),
  fps: z.number().int().min(12).max(60).default(24),
  runningHead: z.string().min(1).max(34),
  firstPage: z.number().int(),
  hook: z.object({
    kicker: z.string().max(30),
    question: z.array(z.string().max(16)).min(1).max(4),
    options: z.array(z.string().max(10)).length(2),
    answer: z.number().int().min(0).max(1),
    stamp: z.string().max(14),
  }),
  cover: z.object({
    series: z.string().max(30),
    chapter: z.string().max(12),
    title: z.string().max(14),
    subtitle: z.string().max(20),
    sub: z.string().max(40),
    introHead: z.string().max(20),
    intro: z.string().max(220),
  }),
  plates: z.array(plate).min(1).max(4),
  notes: z.object({
    title: z.string().max(18),
    sub: z.string().max(40),
    points: z.array(z.object({ h: z.string().max(28), b: z.string().max(110), bars: z.array(bar).max(3).optional() })).min(2).max(3),
  }),
  end: z.object({
    refsHead: z.string().max(20),
    refs: z.array(z.string().max(100)).min(1).max(3),
    save: z.string().max(24),
    ask: z.string().max(80),
    fin: z.string().max(24),
  }),
});

export type TextbookContent = z.infer<typeof contentSchema>;
