# Vox-style videos (Remotion)

Vertical 1080x1920 explainer videos in the Vox-documentary paper style, one `videos/<slug>/content.json` per video.
The full workflow and content rules are in `.claude/skills/vox-video/SKILL.md`.

```console
npm run new -- <slug>        # videos/<slug>/content.json from the example
npm run studio -- <slug>     # live preview with a scrubber
npm run stills -- <slug>     # key-moment stills + contact sheet in videos/<slug>/dbg/
npm run render -- <slug>     # videos/<slug>/<slug>.mp4   (--from s --to s for a section)
npm test                     # unit tests: keyframes, timeline, markup, schema
npm run lint                 # eslint + tsc
npm run textures             # regenerate public/textures/ (deterministic)
```

Design: `../docs/superpowers/specs/2026-10-10-remotion-vox-engine-design.md`.

Remotion is free for individuals and companies of up to 3 people; larger companies need a license
(https://www.remotion.dev/license).
