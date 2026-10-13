import { z } from 'zod';
import { countHighlights } from './markup';

// Visible length of a line once markup is stripped ({count}/{chapters} counted as 2 digits).
const visLen = (s: string) => s.replace(/==|__/g, '').replace(/\{(count|chapters)\}/g, '00').length;

const line = (max: number) =>
  z
    .string()
    .min(1)
    .refine((s) => visLen(s) <= max, { message: `at most ${max} visible characters` })
    .refine((s) => countHighlights(s) <= 2, { message: 'at most 2 ==highlights== per line' });

const card = z.object({
  n: z.string().min(1).describe('Name exactly as in the draft'),
  i: z.string().min(2).max(3).describe('2-3 letter stamp initials'),
  meta: z.string().min(1).describe('One short mono line: role, author, source'),
  tags: z.array(z.string().min(1).max(32)).min(1).max(3),
});

const chapter = z.object({
  title: z.string().min(1).max(22),
  toc: z.string().min(1).max(24),
  intro: z.string().min(1).max(36),
  cards: z.array(card).min(2).max(4),
});

export const contentSchema = z.object({
  title: z.string().min(1).describe('Name of this video'),
  item: z.string().min(1).describe('Plural noun for the TOC counts, e.g. "books"'),
  fps: z.number().int().min(12).max(60).default(24),
  hook: z.object({
    strips: z.array(line(28)).length(7).describe('7 clickbait headlines'),
    lines: z.array(line(32)).length(3).describe('problem, twist, the question this video answers'),
  }),
  titleCard: z.object({
    kicker: line(40),
    head: z
      .array(line(16))
      .length(3)
      .refine((rows) => rows.join(' ').split('{count}').length === 2, { message: 'must contain {count} exactly once' }),
  }),
  chapters: z.array(chapter).min(3).max(5),
  end: z.object({
    kicker: line(40),
    head: z.array(line(24)).length(3),
    save: z.string().min(1).max(24),
    ask: z.string().min(1).max(80),
  }),
});

export type Content = z.infer<typeof contentSchema>;
