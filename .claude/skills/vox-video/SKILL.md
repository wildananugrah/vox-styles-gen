---
name: vox-video
description: Use when the user has a text draft (markdown notes, a categorized list, an outline, e.g. "20261006 - test.md") and wants it turned into a short vertical TikTok / Reels / Shorts explainer video in the Vox-documentary paper style, or asks to preview, re-render, shorten, resize or restyle one of these videos.
---

# Vox-style vertical video from a text draft

Videos are rendered with **Remotion** from the shared project in `remotion/` at the repo root. Each video is one
`remotion/videos/<slug>/content.json`; the engine (React scenes in `remotion/src/`) is shared. Output: 1080x1920 MP4,
24 fps, silent, ~45-90 s.

| Path (under `remotion/`) | What it is |
|---|---|
| `videos/creator-shortlist/content.json` | A finished example (18 creators in 5 topics). `npm run new` copies it as the starting point. |
| `src/schema.ts` | zod schema for `content.json`: field limits are enforced, not just advice. |
| `src/timeline.ts` | Scene schedule and duration, a pure function of the content. |
| `src/scenes/` | `Hook`, `Title`, `Chapter` (+ cards), `End`. `src/engine/` holds `kf` keyframes, `Sheet`, `Sweep`, `Ink`, `RiseWord`, `useMeasure`. |
| `public/textures/` | paper, grain, stamp mask (regenerate with `npm run textures`; deterministic). |

## Workflow (all commands from `remotion/`)

1. **Read the draft** and decide its shape (see "Fitting the draft"). Say the defaults you chose rather than interviewing the user: 1080x1920, 24 fps, English, silent, ~60-80 s.
2. **Create the video**: `npm run new -- <slug>` makes `videos/<slug>/content.json` from the example.
3. **Edit `content.json`**: every visible string lives there (see below). No TSX edits for a categorized list.
4. **Preview stills** and look at them (Read the PNGs) before rendering anything:
   `npm run stills -- <slug>` renders the hook (3 s), title + TOC (9.5 s), each chapter's "full at" moment and the end card (DUR-2) into `videos/<slug>/dbg/`, builds `dbg/sheet.png`, and prints `chapter N card font XXpx stack ends at Y …` plus `hook strip N right edge at X > 1080` warnings. Extra seconds can be appended: `npm run stills -- <slug> 12.3 14`. Invalid content fails here with the zod message (field path + rule).
   Check: no "right edge" warnings, font >= 32px, and the sheet looks right. For live scrubbing: `npm run studio -- <slug>`.
5. **Render** in the background: `npm run render -- <slug> > videos/<slug>/render.log 2>&1` writes `videos/<slug>/<slug>.mp4` (2 tabs in parallel, crf 23, veryfast). Quick check of one section: `--from 20 --to 30`.
6. **Verify** with `ffprobe` (duration, 1080x1920) and a contact sheet of frames from the MP4 (`ffmpeg -i <mp4> -vf "fps=1/8,scale=270:-1,tile=5x2" -frames:v 1 sheet.png`). Hand back: path, duration, size, what is in it, and anything the user should check (names, claims).

## content.json

| Field | Per draft |
|---|---|
| `title` | Name of this video (not visible). |
| `item` | Plural noun for the TOC counts ("books"). |
| `hook.strips` | 7 clickbait headlines about the draft's topic, <= 28 chars (fixed slots; the shorter the safer, `stills` warns if one runs off the right edge). |
| `hook.lines` | 3 card lines, <= 32 chars: the problem, a twist, the question this video answers. Mark one word in line 2 with `__word__` (red underline) and up to two spans in line 3 with `==…==`. |
| `titleCard.kicker` | e.g. `"The shortlist / {chapters} topics"`. |
| `titleCard.head` | 3 rows. Must contain `{count}` once (the total card count, circled in red); keep two `==highlighted==` words in row 3. |
| `chapters[]` | 3-5 chapters: `title` (<= 22), `toc`, `intro` (mono line, <= 36), `cards[]` (2-4): `n` the item's name exactly as in the draft, `i` 2-3 letter stamp initials, `meta` one short mono line, `tags` 1-3 phrases of 1-3 words. Long names wrap automatically. |
| `end` | `kicker`, `head` (3 rows, two `==one==`-style highlights), `save` (handwritten CTA), `ask` (comment prompt). |

Markup: `==text==` highlighter sweep, `__text__` red underline, `{count}` card total (circled in the title), `{chapters}` chapter count. At most 2 highlights per line.

Duration is computed: `DUR = 11.6 + Σ chapters(1.6 + cards × 2.45 + 1.0) + 5.6`. Aim for 3-5 chapters of 2-4 cards (~25 cards already means ~90 s). Split chapters or cut items instead of going beyond that. A small draft gives a short video: never pad with items the draft doesn't have.

## Fitting the draft

- **Categorized list** (people, tools, books, places): maps straight onto `chapters`. This is the common case.
- **Other shapes** (steps, myths vs facts, one argument): keep hook, title and end card, and add a new scene component in `src/scenes/` built from the engine pieces (`Sheet` slide-up, `RiseWord`, `Sweep`, `Ink` strokes, cards with tape), with its times added to `src/timeline.ts` (and a test in `test/timeline.test.ts`). Run `npm test` and `npm run lint` after engine changes.
- **Copy rules:** cards claim only what the draft says. Compress, don't add: drop honorifics ("Dr."), shorten channel names, keep tags concrete. Keep names and titles spelled exactly as in the draft. Hook, title and end card are framing you write yourself, but make no factual claims (numbers, results) the draft doesn't support.

## Visual language (keep it consistent)

- Palette (`src/styles.ts`): ink `#16130F`, paper, card `#FBF7EE`, highlighter `#FFD60A`, marker red `#D3301F`. Fonts: DM Serif Display (headlines), Archivo (body), IBM Plex Mono (kickers), Caveat (handwritten CTA only).
- One transition only: the next paper sheet slides up over the previous one. No fades between scenes.
- Emphasis = yellow highlighter sweep or a red hand-drawn stroke. At most 2 per screen.
- Safe zone: text between y≈130 and y≈1520, clear of the right edge low down (TikTok's caption and buttons cover the bottom ~400 px and the right side). The card fit enforces 1520 and fails the render if a chapter can't fit even at 26px.

## Common mistakes

| Mistake | Fix |
|---|---|
| Rendering the full video before looking at stills | Always `stills` first; a full render takes minutes. |
| Hook or end card still about "creators" | Every visible string is in `content.json`; rewrite all of them per draft, not just `chapters`. |
| Typing the item count by hand | Use `{count}` / `{chapters}`; they are filled from `chapters`. |
| `chapter N: card stack ends at … > 1520` | Too much text in that chapter: fewer or shorter tags and meta lines, or fewer cards. |
| `hook strip N right edge at X > 1080` | Shorten that strip. |
| Running `remotion` from the repo root | Run the npm scripts from `remotion/`; they pass `--props=videos/<slug>/content.json`. |
| Huge MP4 | Keep crf 23; the film grain is what makes files big (lower `.grain` opacity in `src/styles.ts` for smaller files). |

## Legacy

`legacy/` holds the previous engine (hand-edited `promo.html` screenshotted by Playwright). It still works
(`bash .claude/skills/vox-video/legacy/scripts/new-video.sh vox-<slug>`) but is kept only as a fallback; use Remotion.
