import { loadFont as loadGaramond } from '@remotion/google-fonts/EBGaramond';
import { loadFont as loadFell } from '@remotion/google-fonts/IMFellEnglish';
import { loadFont as loadFellSC } from '@remotion/google-fonts/IMFellEnglishSC';

// IM Fell English (letterpress headlines), its small caps (running heads, labels),
// EB Garamond (body, tables, captions).
const fell = loadFell('normal', { weights: ['400'], subsets: ['latin'] });
const fellI = loadFell('italic', { weights: ['400'], subsets: ['latin'] });
const fellSC = loadFellSC('normal', { weights: ['400'], subsets: ['latin'] });
const gar = loadGaramond('normal', { weights: ['400', '500'], subsets: ['latin'] });
const garI = loadGaramond('italic', { weights: ['400'], subsets: ['latin'] });

export const TF = {
  fell: `'${fell.fontFamily}', serif`,
  sc: `'${fellSC.fontFamily}', serif`,
  gar: `'${gar.fontFamily}', serif`,
};

export const textbookFontsReady = () =>
  Promise.all([fell, fellI, fellSC, gar, garI].map((f) => f.waitUntilDone())).then(() => document.fonts.ready);
