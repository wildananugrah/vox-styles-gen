# Voiceover generator (parked idea)

Status: **parked** on 2026-10-22, still being explored, nothing built yet.
Blocked on hardware (see "Where we stopped").

## The idea

A tool that takes an **SRT file** plus a **voice** and produces an **MP3 voiceover**
timed to the SRT cues. The MP3 goes into a video's assets folder so the Remotion
videos pick it up.

- Input: `<slug>.srt` (already exported by `npm run srt -- <slug>` in `remotion/`)
- Input: a voice (see "Voice sources")
- Output: `voiceover.mp3`, each cue spoken inside its SRT time window
- Languages: mostly **Bahasa Indonesia**, sometimes **English**

## How it plugs into the existing project

The Remotion side already plays a voiceover, so only the audio generation is missing.

- `remotion/src/Root.tsx:117-124`: uses `props.audio`, or `<assets>/voiceover.mp3` if it
  exists; otherwise the video renders silent.
- `remotion/src/explainer/ExplainerVideo.tsx:124`, `remotion/src/sysdesign/SysdesignVideo.tsx:55`:
  `<Audio src={staticFile(c.audio)} />`.
- `remotion/scripts/srt.mjs`: exports the timed SRT from `content.json`. Works for the
  anatomy, duel, explainer and sysdesign styles.

## Voice sources (decided)

Supported:
1. **Voice library**: a shared voice whose owner agreed to its reuse.
2. **Voice design**: a new voice built from a text description, belonging to no real person.
3. **Own voice / a consenting person**: clone from a 1–2 minute recording.

**Not supported:** cloning a specific real person (YouTuber, TV narrator) without
their permission. The videos are posted publicly, so this counts as impersonation.
If that person gives written consent, they fall under option 3.

## Constraints (decided)

- Must be **free** or **run locally**. No paid TTS service such as ElevenLabs.

## Where we stopped: hardware

This machine (a KVM virtual machine):

| | Have | Needed for good voice cloning |
|---|---|---|
| GPU | none | NVIDIA, 6 GB+ VRAM |
| CPU | 4 cores | 8+ for CPU-only |
| RAM | 7.8 GB total, ~2.3 GB free | 4–8 GB free |
| Disk | 16 GB free | 5–10 GB for models |
| Tools | Python 3.10, ffmpeg 4.4, Node 20, Docker | enough |

Good cloning models would be very slow here (roughly 10–30 min per minute of audio)
or run out of memory. The lightweight models that run fine can't clone and sound
robotic in Indonesian.

Options when resuming:
1. **Another machine with an NVIDIA GPU** that the user owns. Fully local. Preferred if available.
2. **Free cloud GPU** (Kaggle ~30 GPU-h/week, Google Colab): free, but not local.
3. **Stay on this machine** and accept slow or low-quality output.

## Model notes (to verify; knowledge may be stale)

- Voice cloning (option 3) works with several free local models. **Indonesian quality is
  the main risk.** Some well-known multilingual cloning models don't list Indonesian
  (some list only Malay).
- Voice library / voice design (options 1–2) are weak locally: few consented voice
  libraries, and text-described voice models are mostly English-only. Locally this probably
  means picking from a model's built-in speakers or from public speech datasets licensed for this use.
- Plan before building: a **bake-off**. Generate the same Indonesian and English sentences
  with 2–3 candidate models on the chosen hardware; the user listens and picks a winner.

## Open questions for next time

- Which hardware option (1, 2 or 3)?
- Which model wins the Indonesian bake-off?
- Fitting speech to cues: when a line runs longer than its SRT window, speed it up,
  let it overflow into the next gap, or report it so the script or `dur` gets adjusted?
  When a line is shorter, add silence (likely).
- Workflow: a CLI next to the Remotion scripts (`npm run voiceover -- <slug>`), or a separate app?
- Should captions be re-timed from the actual generated speech (word timestamps),
  instead of the fixed `dur` values?
