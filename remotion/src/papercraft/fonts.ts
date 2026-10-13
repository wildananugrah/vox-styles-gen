import { loadFont as loadFredoka } from '@remotion/google-fonts/Fredoka';
import { loadFont as loadNunito } from '@remotion/google-fonts/Nunito';
import { loadFont as loadHand } from '@remotion/google-fonts/PatrickHand';
import { loadFont as loadBungee } from '@remotion/google-fonts/Bungee';
import { loadFont as loadMarker } from '@remotion/google-fonts/PermanentMarker';
import { loadFont as loadGraf } from '@remotion/google-fonts/SedgwickAveDisplay';

// Fredoka (round, friendly headlines), Nunito (body), Patrick Hand (handwritten captions).
const fredoka = loadFredoka('normal', { weights: ['500', '600', '700'], subsets: ['latin'] });
const nunito = loadNunito('normal', { weights: ['600', '700', '800'], subsets: ['latin'] });
const hand = loadHand('normal', { weights: ['400'], subsets: ['latin'] });
// hip-hop vibe: Bungee (street signage), Sedgwick Ave Display (graffiti tag), Permanent Marker.
const bungee = loadBungee('normal', { weights: ['400'], subsets: ['latin'] });
const graf = loadGraf('normal', { weights: ['400'], subsets: ['latin'] });
const marker = loadMarker('normal', { weights: ['400'], subsets: ['latin'] });

export const PF = {
  head: `'${fredoka.fontFamily}', sans-serif`,
  body: `'${nunito.fontFamily}', sans-serif`,
  hand: `'${hand.fontFamily}', cursive`,
  sign: `'${bungee.fontFamily}', sans-serif`,
  graf: `'${graf.fontFamily}', cursive`,
  marker: `'${marker.fontFamily}', cursive`,
};
