import { loadFont as loadArchivo } from '@remotion/google-fonts/Archivo';
import { loadFont as loadCaveat } from '@remotion/google-fonts/Caveat';
import { loadFont as loadSerif } from '@remotion/google-fonts/DMSerifDisplay';
import { loadFont as loadMono } from '@remotion/google-fonts/IBMPlexMono';

// Same faces as the old template: DM Serif Display (headlines), Archivo (body),
// IBM Plex Mono (kickers), Caveat (handwritten CTA). loadFont blocks rendering until loaded.
const serif = loadSerif('normal', { weights: ['400'], subsets: ['latin'] });
const grot = loadArchivo('normal', { weights: ['500', '600', '800'], subsets: ['latin'] });
const mono = loadMono('normal', { weights: ['500'], subsets: ['latin'] });
const hand = loadCaveat('normal', { weights: ['700'], subsets: ['latin'] });

export const F = {
  serif: `'${serif.fontFamily}', serif`,
  grot: `'${grot.fontFamily}', system-ui, sans-serif`,
  mono: `'${mono.fontFamily}', monospace`,
  hand: `'${hand.fontFamily}', cursive`,
};

/** Resolves once every face is loaded, so DOM measurements see the final metrics. */
export const fontsReady = () =>
  Promise.all([serif, grot, mono, hand].map((f) => f.waitUntilDone())).then(() => document.fonts.ready);
