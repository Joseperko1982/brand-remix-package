# Brand Remix Package

Algorithmic brand image generation for System Thinking / Joe Perkins — using Nano Banana (Gemini via kie.ai).

Contains everything needed to run the full brand-remix workflow on a fresh Hermes installation.

---

## What's Inside

```
brand-remix-package/
├── skills/
│   ├── brand-remix/
│   │   └── SKILL.md              ← Main skill (Algorithm 1 + Algorithm 2)
│   └── kie-nano-banana-api/
│       └── SKILL.md              ← API integration skill
├── references/
│   ├── visual-dna-gallery.json   ← Canonical Visual DNA (palette, type, composition)
│   ├── nano-banana-prompts.json  ← Full SAS IS DEAD campaign prompts (v11-v20)
│   └── nano-banana-prompts.recent.json  ← Recent centerstack batch (v25-v28)
├── seeds/
│   ├── System_Thinking_Joe_Multi_Shot.png  ← PRIMARY subject reference (always required)
│   └── System_Thinking_Poster_Headline_Joe1.png  ← Brand composition seed
├── gallery/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── data.json
│   └── index.html
├── scripts/
├── .env.example                  ← API key template
├── install.sh                    ← One-shot installer for fresh Hermes
└── README.md
```

---

## Quick Start

### 1. Install on a Fresh Hermes

```bash
cd ~/Downloads/brand-remix-package
bash install.sh
```

This copies skills to `~/.hermes/profiles/writing/skills/creative/` and sets up references.

### 2. Configure API Keys

```bash
cp .env.example ~/Desktop/Kapathy/.env
# Edit ~/Desktop/Kapathy/.env with your real keys
```

Required:
- **`KIE_API_KEY`** — from https://kie.ai
- **`IMGBB_API_KEY`** — from https://api.imgbb.com

### 3. Set Up Seed Images

The canonical source for all brand seed images is:
```
/Users/joseph/Desktop/System Thinking Brand Assets /
```

Joe's multi-shot is at:
```
/Users/joseph/Desktop/System Thinking Brand Assets /System_Thinking_Joe_Multi_Shot.png
```

Working output directory:
```
/Users/joseph/Desktop/System Thinking Brand Assets /thumb/
```

### 4. Run the Skill

Trigger phrases in Hermes:
- `"run algo 2"` or `"brand remix"` — Algorithm 2 (center-stack, 4x5)
- `"make a gif"` or `"gif the article images"` — Algorithm 1 (GIF assembly)

---

## Two Algorithms

### Algorithm 1 — GIF Assembly
Turns a batch of gallery images into a looping animated GIF, following the narrative arc of a Thought to Piece article. Frame order is determined by the article's structure, not alphabetical order.

**Trigger:** `"make a gif"`, `"animate the batch"`, `"gif the article images"`

### Algorithm 2 — Center-Stack (4x5)
Generates 4 new images with locked center composition. Joe is always center-frame; all typography lives in a horizontal center band. Optimized for GIF animation — no visual drift between frames.

**Trigger:** `"run algo 2"`, `"center-stack"`, `"4x5 format"`, `"locked center composition"`

---

## Visual DNA Summary

| Element | Spec |
|---|---|
| Palette | `#FDE910` yellow / `#1A1A1B` charcoal / `#939598` grey |
| Typography | Impact, Helvetica Compressed, Inter — ALL CAPS headlines |
| Joe | Salt-and-pepper hair, boxed beard, black crew-neck, confrontational gaze |
| Finish | Matte — no shadows, no glow, no gradients |
| Composition | Sandwich layering (text behind/in front of subject), Z-axis depth |
| Icon | Isometric Rubik's cube — yellow active / grey inactive |
| Never | Pure black (#000000), pure white background, drop shadows, bevels |

---

## Gallery Web App

The `gallery/` directory is a standalone Vite/React app. To run it:

```bash
cd gallery
npm install
npm run dev
```

The gallery displays all generated images with brand metadata. Update `src/data.json` to add new images to the gallery index.

---

## Prompt Library

`references/nano-banana-prompts.json` contains every successful prompt ever run — including:
- SAS IS DEAD campaign (v11–v20): 10 detailed structured prompts
- Centerstack batch (v25–v28): 4 algorithm-2 prompts

Before every run, check this file to avoid repeating the same compositions.

---

## Subject Description (Always Required)

Every prompt MUST open with:

```
Image one is a detailed photograph of the man — middle-aged with salt-and-pepper
short cropped hair, full groomed boxed beard and mustache, direct confrontational
gaze, wearing a black crew-neck t-shirt.
```

Never deviate from this — it anchors the subject identity across all outputs.

---

## Recipe Index

### Backgrounds (B1–B8)
B1 solid field / B2 center split / B3 gradient band / B4 film grain / B5 geometric block / B6 noise field / B7 yellow wash / B8 dual field

### Joe Treatments (J1–J6)
J1 flat matte / J2 duotone / J3 near-silhouette / J4 backlit silhouette / J5 partially cropped / J6 full body small

### Typography (T1–T8)
T1 knockout headline / T2 solid reverse / T3 split label / T4 outline type / T5 duotone stack / T6 mono label band / T7 quote mark / T8 negative space

Full details in `references/visual-dna-gallery.json` and `skills/brand-remix/SKILL.md`.
