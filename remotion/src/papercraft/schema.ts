import { z } from 'zod';
import { contentSchema as textbook } from '../textbook/schema';

// Same content shape as the textbook style; only the look differs ("style": "papercraft").
export const contentSchema = textbook.extend({
  style: z.literal('papercraft'),
  vibe: z.enum(['pastel', 'hiphop']).optional().describe('hiphop: street set, graffiti type, beat pulse'),
  badge: z.string().max(8).optional().describe('Small word above the scene number, default LEVEL'),
});
export type PaperContent = z.infer<typeof contentSchema>;
