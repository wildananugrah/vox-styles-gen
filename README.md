# vox-styles-gen

Turns a text draft (markdown notes, a categorized list, an outline) into a short vertical explainer video in the
Vox-documentary paper style, ready for TikTok, Reels or Shorts. Videos are rendered with [Remotion](https://www.remotion.dev/).

Each video is a single `remotion/videos/<slug>/content.json`. The engine (React scenes, keyframes, textures) is shared,
so a new video usually needs no code changes.

## Repository layout

| Path | What it is |
|---|---|
| `remotion/` | The Remotion project: engine, styles, scripts and videos. See [`remotion/README.md`](remotion/README.md). |
| `remotion/src/` | Shared engine (`engine/`, `scenes/`) and the alternative styles: `collage/`, `papercraft/`, `textbook/`. |
| `remotion/videos/<slug>/` | One folder per video: `content.json`, plus rendered stills and MP4 output. |
| `remotion/public/` | Textures, fonts and image assets used by the videos. |
| `.claude/skills/vox-video/` | Claude Code skill describing the full draft-to-video workflow and content rules. |
| `docs/superpowers/specs/` | Design notes for the Remotion engine. |
| `prompt-examples.md` | Prompt templates for requesting a new video from Claude Code. |
| `vox-styles.md` | Catalogue of style variants and the settings that define them. |

## Quick start

Requires Node.js and `ffmpeg`/`ffprobe` for checking output. All commands run from `remotion/`:

```console
cd remotion
npm install

npm run new -- <slug>        # create videos/<slug>/content.json from the example
npm run studio -- <slug>     # live preview with a scrubber
npm run stills -- <slug>     # key-moment stills + contact sheet in videos/<slug>/dbg/
npm run render -- <slug>     # render videos/<slug>/<slug>.mp4 (--from s --to s for a section)
```

Development:

```console
npm test                     # unit tests: keyframes, timeline, markup, schema
npm run lint                 # eslint + tsc
npm run textures             # regenerate public/textures/ (deterministic)
```

## Workflow

1. Write or collect a draft (e.g. `20261013 - content.md`) and any images.
2. Ask Claude Code for a video using a template from [`prompt-examples.md`](prompt-examples.md); the `vox-video` skill
   handles the rest.
3. Or do it by hand: `npm run new`, edit `content.json`, check with `npm run stills`, then `npm run render`.

Always look at the stills before a full render; a full render takes minutes.

## License

Remotion is free for individuals and companies of up to 3 people; larger companies need a license
(https://www.remotion.dev/license).
