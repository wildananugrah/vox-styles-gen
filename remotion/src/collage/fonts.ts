import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/archivo/600.css';
import '@fontsource/newsreader/400-italic.css';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import '@fontsource/caveat-brush/400.css';
import { useState } from 'react';
import { cancelRender, continueRender, delayRender } from 'remotion';

// Barlow Condensed (titles, numbers, strips), Archivo (captions), Newsreader italic (quotes),
// Courier Prime (labels, tape), Caveat Brush (handwriting). Self-hosted via @fontsource.
export const CF = {
  head: "'Barlow Condensed', 'Arial Narrow', sans-serif",
  body: "'Archivo', system-ui, sans-serif",
  quote: "'Newsreader', Georgia, serif",
  mono: "'Courier Prime', 'Courier New', monospace",
  hand: "'Caveat Brush', cursive",
};

const FACES = [
  '800 40px "Barlow Condensed"', '900 40px "Barlow Condensed"', '600 40px "Archivo"',
  'italic 400 40px "Newsreader"', '400 40px "Courier Prime"', '700 40px "Courier Prime"', '400 40px "Caveat Brush"',
];

/** Holds the first frame until every face has loaded (fontsource @font-face rules load lazily). */
export function useCollageFonts() {
  useState(() => {
    const h = delayRender('collage fonts');
    Promise.all(FACES.map((f) => document.fonts.load(f, 'AaÉ01')))
      .then(() => continueRender(h))
      .catch((err) => cancelRender(err));
    return h;
  });
}
