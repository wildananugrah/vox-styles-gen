# Remotion engine for vox-style videos — design

Date: 2026-10-10
Status: draft for review
Sub-project 1 of 3 (1: engine port, 2: voiceover + music, 3: richer visuals / style presets)

## Goal

Replace the hand-edited `promo.html` + Playwright screenshot pipeline of the `vox-video` skill with a Remotion
project, so vox-style videos are built from a JSON content file, previewed live in Remotion Studio, and rendered
in parallel. The first deliverable reproduces today's video (look and timing) on the new engine. It is the
foundation that sub-projects 2 and 3 build on.

### What the user asked for

- Use Remotion (https://www.remotion.dev/, scaffolded with `npx create-video@latest`) to make better vox-style videos.
- "Better" means all of: voiceover + music, richer visuals, easier workflow, and the same video on a new engine.
  Focus on the vox-style format in this project.
- Agreed decomposition: port first; voiceover and richer visuals get their own specs afterwards.
- Remotion's free license tier covers the user.

### Assumptions

- Output stays 1080x1920, 24 fps, H.264 MP4, silent (audio is sub-project 2).
- The machine has 4 cores, 7 GB RAM and about 11 GB free disk, so there is one shared install and render concurrency 2.
- Remotion v4 (4.0.534 at time of writing), TypeScript, React.

### Success criteria

1. The creator-shortlist example (18 cards, 5 chapters) renders from `content.json` to a 1080x1920, 24 fps MP4 of
   74.3 s ±1 frame. Stills at the same 8 timestamps match the current engine in layout, timing and look.
2. A new video needs only a new `content.json`. No TSX/HTML editing for the categorized-list shape.
3. Invalid content (over-long strips, too many cards, a count mismatch) is rejected before rendering.
4. The full render is faster than today's ~11 min. The measured number is recorded.

## Out of scope

Audio of any kind, captions, new scene types (maps, charts, counters, photo cutouts), style presets from
`vox-styles.md`. The existing HTML pipeline is kept as a fallback, not deleted.

## Architecture

One shared Remotion project at the repo root, with one content file per video (approach A).

```
01-content-gen/
  remotion/                      scaffolded with `npx create-video@latest` (blank, TypeScript)
    src/
      index.ts                   registerRoot
      Root.tsx                   <Composition id="VoxVideo"> + zod schema + calculateMetadata
      VoxVideo.tsx               stage: sheets in z-order + Grain + Vignette
      schema.ts                  zod schema for content.json
      timeline.ts                pure: content -> scene starts, card times, DUR (no DOM)
      markup.tsx                 parses ==hl==, __underline__, {count}, {chapters}
      fonts.ts                   @remotion/google-fonts: DM Serif Display, Archivo, IBM Plex Mono, Caveat
      engine/
        kf.ts                    kf(t, keys) with easings lin/out/inout/expo/back (same as old val())
        Sheet.tsx                slide-up transition, push-back + shade, drift zoom
        Rise.tsx Sweep.tsx InkStroke.tsx Stamp.tsx Tape.tsx Grain.tsx Vignette.tsx
        useMeasure.ts            one-time DOM measurement inside delayRender/continueRender
        loopPath.ts              hand-drawn loop around a box (ported)
      scenes/
        Hook.tsx Title.tsx Chapter.tsx Card.tsx End.tsx
    public/textures/             paper.png, grain.png, stampmask.png (generated once, checked in)
    videos/<slug>/content.json   one per video; later also voiceover/music/photos
    videos/creator-shortlist/    the ported example (from "20261006 - test.md")
    scripts/
      new-video.mjs              copy example content.json to videos/<slug>/
      stills.mjs                 render key-moment stills + contact sheet
      textures.mjs               one-time texture generator (seeded, ported algorithm)
    test/                        vitest unit tests
```

### Data flow

`videos/<slug>/content.json` → validated by `schema.ts` → `calculateMetadata` calls `timeline(content)` for
`durationInFrames` and `fps` → `VoxVideo` renders the sheets, and each scene reads its start times from the same
`timeline` result. `scripts/stills.mjs` also imports `timeline.ts` to pick still times.

## Content format

Every visible string lives in `content.json`.

```json
{
  "title": "Creator Shortlist",
  "item": "creators",
  "fps": 24,
  "hook": {
    "strips": ["10 hacks to fix your life", "Doctors hate this one trick", "..."],
    "lines": ["Your feed is full of advice.", "Most of it is __noise.__", "So who's ==worth== ==learning from?=="]
  },
  "titleCard": {
    "kicker": "The shortlist / {chapters} topics",
    "head": ["{count} creators", "worth", "==learning== ==from.=="]
  },
  "chapters": [
    { "title": "Health & Longevity", "toc": "Health & Longevity", "intro": "Sleep, stress & living longer",
      "cards": [ { "n": "Andrew Huberman", "i": "AH", "meta": "Huberman Lab · Stanford neurobiology",
                   "tags": ["Sleep", "Hormones", "Stress"] } ] }
  ],
  "end": {
    "kicker": "How to use this list",
    "head": ["Pick ==one== topic.", "Follow ==one== creator.", "Start there."],
    "save": "Save this for later",
    "ask": "Who did we miss? Drop a name in the comments."
  }
}
```

Markup: `==text==` gets a yellow highlighter sweep. `__text__` gets a red hand-drawn underline (hook only). `{count}` is
replaced by the total number of cards and circled in red (title only). `{chapters}` is replaced by the chapter count.

Schema rules (zod), which replace the "common mistakes" table:

| Field | Rule |
|---|---|
| `hook.strips` | exactly 7, each ≤ 28 chars (plus the measured edge check below) |
| `hook.lines` | exactly 3, each ≤ 32 visible chars |
| `titleCard.head` | exactly 3 rows, `{count}` appears once |
| `chapters` | 3-5 items. `title` ≤ 22 chars, `intro` ≤ 36 chars |
| `cards` | 2-4 per chapter. `i` 2-3 chars. `tags` 1-3 |
| any line | ≤ 2 `==…==` highlights |
| `end.head` | exactly 3 rows |

The limits are set so the existing example passes (its longest strip is 27 chars and its longest intro 33). Whether a
hook strip actually runs off the right edge depends on its slot position, so `Hook` measures each strip and logs
`strip N right edge at X` as a warning when X > 1080. `stills` prints these warnings.

## Animation port

- Scene components compute `t = frame / fps` and use `kf(t, [[t0, v0], [t1, v1, ease]])`, which has the same semantics
  and easings as the old `val()`. All timing constants carry over unchanged: `CARD_STEP 2.45`, `INTRO 1.6`,
  `SUMMARY 1.0`, `SLIDE .75`, hook 0-5.7, title 5.7-11.6, end card 5.6 s.
- `timeline.ts`: `DUR = 11.6 + Σ chapters (1.6 + 2.45·cards + 1.0) + 5.6` (74.3 s for the example).
- `<Sheet start next>` is the only transition: y 1920→0 over `SLIDE` (inout). When the next sheet arrives, y 0→−300 and
  the shade goes 0→.45. Drift scale goes 1→1.03 (1.02 on the last sheet). The sheet is mounted only while visible.
- Scenes keep absolute positions and CSS from `promo.html` (palette `--ink #16130F`, `--card #FBF7EE`,
  `--marker #FFD60A`, `--red #D3301F`, and so on).
- Grain: background position `((f·137)%512, (f·241)%512)` with `f = floor(t·12)`, opacity .28.
- DOM-dependent layout goes through `useMeasure`, which measures once on mount between `delayRender`/`continueRender`:
  - Card fit: font 46→32 px until names fit on one line and the stack ends ≤ 1520. If that fails, the too-long names wrap
    and the fit goes down to 26 px. This is the same loop as today.
  - `{count}` circle: `loopPath(box, 26, 6)`. `__underline__`: a curve under the measured box.
  - Each chapter logs `chapter N card font XXpx stack ends at Y full at T` to the console.

## Workflow (run from `remotion/`)

| Command | Does |
|---|---|
| `npm run new -- <slug>` | creates `videos/<slug>/content.json` from the example; refuses if it exists |
| `npx remotion studio` | live preview with scrubber and a zod props form |
| `npm run stills -- <slug>` | renders stills at 3 s, 9.5 s, each chapter's "full at", and DUR−2 into `videos/<slug>/dbg/`, prints fit diagnostics, builds `sheet.png` with ffmpeg |
| `npm run render -- <slug> [--from s --to s]` | `remotion render VoxVideo videos/<slug>/<slug>.mp4 --props=… --concurrency=2 --crf=23 --x264-preset=veryfast` |

The `vox-video` skill's `SKILL.md` is rewritten around this workflow: read the draft, `new`, edit `content.json`,
`stills`, look at them, `render`, then verify with ffprobe and a contact sheet. The visual-language rules, copy rules
and safe zone stay. The old `template/` and `scripts/new-video.sh` move to `legacy/` with a note.

## Error handling

- Schema violations show in Studio's props panel and fail `stills`/`render` with the zod message (field path + rule).
- A card stack that still ends > 1520 at 26 px fails the render with `chapter N: stack ends at Y > 1520`, instead of
  silently overflowing.
- A missing `videos/<slug>/content.json` makes the scripts exit non-zero with the expected path.

## Testing

- Unit tests (vitest), written before the implementation:
  - `kf`: values and easings at boundary and mid points match the old `val()`.
  - `timeline`: the example gives DUR 74.3 and chapter starts 11.6, 21.55, 33.95, 43.9, 56.3.
  - `markup`: parses highlights, underline and placeholders, and handles plain text with no markup.
  - `schema`: accepts the example; rejects a 29-char strip, a 5-card chapter, 3 highlights on one line, and a title head without `{count}`.
- Visual parity: stills from the old engine and the new one at the same 8 timestamps, reviewed side by side.
- Acceptance: a full render of the example. `ffprobe` shows 1080x1920, 24 fps and 74.3 s ±1 frame. Contact sheet reviewed;
  render time and file size recorded and compared with the old pipeline.
