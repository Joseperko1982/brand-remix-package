---
name: brand-remix
description: "Generate on-brand image variations using Nano Banana (Gemini). Supports two algorithms: Algorithm 1 (GIF Assembly from article batches) and Algorithm 2 (Center-Stack 4x5 composition for focused visual storytelling). Always loads the Visual DNA and Joe's multi-shot as primary subject reference."
author: Hermes Agent
metadata:
  hermes:
    tags: [image-generation, brand, nano-banana, creative, nano-banana-edit]
    triggers: ["generate brand images", "remix the brand", "create campaign visuals", "grow the gallery", "brand remix", "new images for brand", "center-stack", "4x5 format", "locked center", "focused composition", "center-locked text", "portrait format", "visual focus gif", "one focal point"]
---

# Brand Remix — Algorithmic Creative Image Generation

Generate 4 fresh brand images with controlled creative drift, using the System Thinking Visual DNA and Joe Perkins as the subject reference. Each run produces 4 images at different drift levels from the seed references — low (close to brand), medium (interpretive), high (abstract), and wild (maximum creativity).

## Workflow

```
CONTEXT → DNA LOAD → SEED UPLOAD → DRIFT PROMPTS → GENERATE 4 → VERIFY → GALLERY
```

---

## Step 1 — Gather Context

Before building prompts, check:

- **`references/visual-dna-gallery.json`** — canonical color hexes, typography specs, composition rules, effects, mood keywords
- **`references/nano-banana-prompts.json`** — existing prompt library (avoid exact repeats, find gaps)
- **`thumb/`** — what's already in the gallery (ensure new outputs are genuinely new)
- **Joe's multi-shot path:** `/Users/joseph/Desktop/System Thinking Brand Assets /System_Thinking_Joe_Multi_Shot.png` (primary subject reference — always required)
- **Brand assets directory:** `/Users/joseph/Desktop/System Thinking Brand Assets /` — contains all canonical brand seed images

---

## Step 2 — Upload Seed References to ImgBB

Upload all needed seeds to imgbb for Nano Banana API use. Joe's multi-shot is **always required** as the primary subject reference.

```python
import os, requests, base64
from pathlib import Path

env_path = "/Users/joseph/Desktop/Kapathy/.env"
env_vars = {}
with open(env_path) as f:
    for line in f:
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            env_vars[k] = v

imgbb_key = env_vars.get("IMGBB_API_KEY", "")

def upload_img(path):
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    resp = requests.post("https://api.imgbb.com/1/upload",
        data={"key": imgbb_key, "image": b64}, timeout=30)
    return resp.json()["data"]["url"]

# Joe's multi-shot — ALWAYS upload first
BRAND_ASSETS="/Users/joseph/Desktop/System Thinking Brand Assets "
JOE_PATH=f"{BRAND_ASSETS}System_Thinking_Joe_Multi_Shot.png"
joe_url = upload_img(JOE_PATH)

# Add 1-2 brand seeds for compositional reference (varied per run)
# Good seeds: poster, quote card, banner, diagram — rotate each run
```

---

## Step 3 — Build 4 Prompts with Drift Levels

Each prompt MUST include:

```
Image one is a detailed photograph of the man — middle-aged with salt-and-pepper
short cropped hair, full groomed boxed beard and mustache, direct confrontational
gaze, wearing a black crew-neck t-shirt.
```

Style guardrails from Visual DNA:
- Colors: `#FDE910` (yellow), `#1A1A1B` (charcoal), `#939598` (grey)
- Typography: Impact, Helvetica Compressed, Inter — ALL CAPS for headlines
- Finish: Matte, flat, no shadows/glow/gradients
- Composition: sandwich layering, focus rectangles, industrial Swiss grid
- Effects: film grain (when specified), duotone masks, Rubik's cube icon

### Drift Levels

| Image | Drift | Seed Weight | Style |
|---|---|---|---|
| 1 | Low | High (close reference) | Brand execution — proven composition |
| 2 | Medium | Medium | Interpretive — different mood/lighting |
| 3 | High | Low (abstract reference) | Conceptual — new format or metaphor |
| 4 | Wild | Minimal/none | Maximum creativity — push brand language |

### Prompt Template

```python
prompts = [
    # IMAGE 1 — LOW DRIFT: Brand execution, proven composition
    {
        "name": "{campaign_slug}_v{n}_low_drift",
        "seed_urls": [joe_url, brand_seed_url],
        "prompt": (
            "Image one is a detailed photograph of the man — middle-aged with salt-and-pepper "
            "short cropped hair, full groomed boxed beard and mustache, direct confrontational "
            " gaze, wearing a black crew-neck t-shirt. "
            "[EXECUTE THE BRAND COMPOSITION HERE — sandwich/duotone/poster as appropriate] "
            "[EXACT HEX COLORS AND TYPOGRAPHY FROM VISUAL DNA] "
            "[SPECIFIC BRAND EFFECTS — matte, film grain, etc.] "
            "9:16 aspect ratio."
        )
    },
    # IMAGE 2 — MEDIUM DRIFT: Interpretive mood shift
    {
        "name": "{campaign_slug}_v{n}_medium_drift",
        "seed_urls": [joe_url, alternate_seed_url],
        "prompt": (
            "Image one is a detailed photograph of the man — [REPEAT SUBJECT DESCRIPTION] "
            "[NEW INTERPRETATION — different lighting, environment, or emotional register] "
            "[BRAND COLORS STILL APPLY] "
            "[KEEP 1-2 BRAND SIGNATURES — e.g. focus rectangle OR sandwich layering OR Rubik's cube] "
            "9:16 aspect ratio."
        )
    },
    # IMAGE 3 — HIGH DRIFT: Abstract conceptual
    {
        "name": "{campaign_slug}_v{n}_high_drift",
        "seed_urls": [joe_url],
        "prompt": (
            "Image one is a detailed photograph of the man — [REPEAT SUBJECT DESCRIPTION] "
            "[ABSTRACT THE CONCEPT — metaphor, symbol, or purely typographic] "
            "[BRAND PALETTE ONLY — yellow/charcoal/grey] "
            "[AT LEAST 1 BRAND ELEMENT — Rubik's cube, focus mask, industrial mono labels] "
            "[ENTIRELY NEW FORMAT — try a format NOT in existing gallery] "
            "9:16 aspect ratio."
        )
    },
    # IMAGE 4 — WILD: Maximum algorithmic creativity
    {
        "name": "{campaign_slug}_v{n}_wild",
        "seed_urls": [joe_url],  # Subject only, full creative freedom
        "prompt": (
            "Image one is a detailed photograph of the man — [REPEAT SUBJECT DESCRIPTION] "
            "[WILD CREATIVE — take the core brand tension and visualize it in the most "
            "unexpected way possible — texture, collage, split-tone, surreal juxtaposition] "
            "[RESTRICTED PALETTE: yellow + charcoal + grey ONLY] "
            "[DO NOT USE: pure black, gradients, drop shadows, bevels] "
            "[NEW THING NOT YET TRIED — check the gallery for gaps] "
            "9:16 aspect ratio."
        )
    }
]
```

---

## Step 4 — Submit All 4 Jobs in Parallel

```python
import requests, json, time
kie_key = env_vars.get("KIE_API_KEY", "")
headers = {"Authorization": f"Bearer {kie_key}", "Content-Type": "application/json"}

task_ids = {}
for p in prompts:
    resp = requests.post("https://api.kie.ai/api/v1/jobs/createTask",
        headers=headers,
        json={"model": "google/nano-banana-edit", "input": {
            "prompt": p["prompt"],
            "image_urls": p["seed_urls"],
            "output_format": "png",
            "image_size": "auto"
        }})
    data = resp.json()
    task_ids[p["name"]] = data["data"]["taskId"]
```

---

## Step 5 — Poll and Download

Poll all 4 simultaneously. Download each as `{name}.png` to `thumb/` directory.

```python
from pathlib import Path
output_dir = Path("/Users/joseph/Desktop/System Thinking Brand Assets /thumb")

done = {k: False for k in task_ids}
for attempt in range(60):
    time.sleep(3)
    for name, tid in task_ids.items():
        if done[name]: continue
        resp = requests.get(f"https://api.kie.ai/api/v1/jobs/recordInfo?taskId={tid}", headers=headers)
        data = resp.json()
        state = data.get("data", {}).get("state")
        if state == "success":
            result = json.loads(data["data"]["resultJson"])
            img_url = result["resultUrls"][0]
            img_resp = requests.get(img_url, timeout=30)
            (output_dir / f"{name}.png").write_bytes(img_resp.content)
            done[name] = True
        elif state == "fail":
            print(f"FAIL {name}: {data['data'].get('failMsg')}")
            done[name] = True
    if all(done.values()): break
```

---

## Step 6 — Vision Verify (Quick Brand Check)

Run vision on all 4 — assess brand alignment, flag any deviations:

```
Does this look like System Thinking? Rate: color accuracy, matte finish,
typography treatment, Joe presence, overall brand energy. /10.
```

Score below 7 = flag for review. Note deviations in the session.

---

## Step 7 — Update Nano Banana Prompt Library

Append successful prompts to `references/nano-banana-prompts.json`:

```json
{
  "id": "{timestamp}",
  "campaign": "{campaign_slug}",
  "drift_level": "low|medium|high|wild",
  "seed_images": ["System_Thinking_Joe_Multi_Shot.png", "...other seeds"],
  "vision_score": "{score}/10",
  "notes": "{what worked, what deviated}",
  "prompt": "{exact prompt used}"
}
```

---

## API Keys Required

- `KIE_API_KEY` — Nano Banana API (kie.ai)
- `IMGBB_API_KEY` — Image hosting for seed URLs

Both stored in `/Users/joseph/Desktop/Kapathy/.env`

---

## Key Rules

1. **Joe is always image one** — every prompt MUST open with the subject description
2. **Always 4 images** — low/medium/high/wild drift in one run
3. **Rotate brand seeds** — don't reuse the same seed pair twice in a row
4. **Check gallery first** — don't repeat existing formats; find gaps to fill
5. **Palette discipline** — yellow/charcoal/grey only; no pure black, no gradients
6. **Matte only** — no gloss, no shadows, no glow effects
7. **Save all outputs to thumb/** — every image goes to the gallery
8. **Log everything** — update nano-banana-prompts.json after every successful run

---

# Algorithm 1 — GIF Assembly from Gallery

Convert a set of gallery images into a looping animated GIF. Use this when the user wants to animate a batch of brand images — e.g., an article campaign, a product drop, or a visual essay sequence.

## Narrative Source: Thought to Piece

GIF batches are not arbitrary — they are story arcs. The primary source is the **Thought to Piece** pipeline:

```
Raw Thought → Excavation → Article → Image Campaign → GIF
```

The article's narrative structure (hook, reframe, proof, close) determines the visual sequence. Each image is selected to advance the argument — not just included for variety.

**Reference article path:**
`knowledge/drafts/2026-04-16-sas-is-dead.md`

**Article arc used for the SAS is dead campaign (10 frames, v11–v20):**

| Frame | Quote | Visual Concept |
|---|---|---|
| v11 | *"SAS is dead."* | Full typographic poster — yellow field, knocked-out charcoal type |
| v12 | *"The hiding place got automated away."* | Ghost/surveillance — ghosted outlines, film grain, scan line |
| v13 | *"Same As Same."* | Grid of grey variations — one yellow duotone hero breaks the pattern |
| v14 | *"The bottleneck was never production. It was taste."* | Isometric funnel — grey/PRODUCTION left, yellow/TASTE right, Joe at neck |
| v15 | *"AI handles the labor."* | Factory floor — robotic arms, Joe arms-crossed supervising above |
| v16 | *"Mediocrity at scale."* | 4x4 grid of grey clones — one yellow hero cell |
| v17 | *"They ship taste."* | Shipping container — yellow Rubik's cubes as curated cargo |
| v18 | *"The point of view that can't be automated."* | Close-up — eye with yellow reticle, singular POV star |
| v19 | *"Your move."* | Minimal poster — full yellow, charcoal band, knocked-out type |
| v20 | *"More variations of the same unremarkable creative."* | Production line — identical grey cubes, one yellow cube at Joe's feet |

The GIF **tells the argument in order** — from the provocation ("SAS is dead") through the diagnosis (hiding place, sameness, bottleneck) to the resolution (taste, POV, curation) and ends with the challenge ("Your move"). Frame order always follows the article's narrative arc, not alphabetical or numerical order.

## Workflow

```
IDENTIFY FRAMES → COPY TO STAGING → BUILD GIF (3 sizes) → UPLOAD → RETURN URL
```

---

## Step 1 — Identify Source Frames

Collect the PNG images to include. Use either:
- A specific batch range: e.g., `v11` through `v20` (article batch)
- A glob pattern: e.g., `v{11..20}_*.png` in `thumb/`
- A named list: provide explicit filenames

**Frame limits:** 4–20 frames per GIF. Default frame duration: **1.3 seconds** per frame.

Common batch references:
- **Article batch (SAS is dead):** v11–v20 → 10 frames, 13s loop
- **Remix batch (v7–v10):** v7–v10 → 4 frames, 5.2s loop
- **Full gallery:** all `v*.png` files sorted numerically

---

## Step 2 — Copy Frames to Staging

Copy frames to `/tmp/gif_frames/` with sequential naming:

```bash
mkdir -p /tmp/gif_frames
for i in 11 12 13 14 15 16 17 18 19 20; do
    f=$(ls "/Users/joseph/Desktop/System Thinking Brand Assets /thumb/v${i}_"*.png 2>/dev/null | head -1)
    cp "$f" "/tmp/gif_frames/frame_$(printf '%02d' $((i - ${START:-10}))).png"
done
ls /tmp/gif_frames/
```

---

## Step 3 — Build GIF with ffmpeg (3 Variants)

PIL/Pillow is NOT available in the execute_code sandbox. Use terminal + ffmpeg for all GIF assembly.

Frame duration: `1/1.3` fps (1.3s per frame). Use palettegen/paletteuse for quality.

```bash
mkdir -p /tmp/gif_frames
# copy frames: frame_00.png, frame_01.png ... in narrative order
BASE="/Users/joseph/Desktop/System Thinking Brand Assets /thumb/{campaign_slug}"

# Full resolution
ffmpeg -y -framerate 1/1.3 -i /tmp/gif_frames/frame_%02d.png \
  -vf "split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "${BASE}.gif"

# 50% — primary web version
ffmpeg -y -framerate 1/1.3 -i /tmp/gif_frames/frame_%02d.png \
  -vf "scale=iw*0.5:ih*0.5:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 "${BASE}_optimized.gif"

# 40% — lightweight
ffmpeg -y -framerate 1/1.3 -i /tmp/gif_frames/frame_%02d.png \
  -vf "scale=iw*0.4:ih*0.4:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 "${BASE}_40pct.gif"
```

Upload `_optimized.gif` as primary URL. Frame naming: `frame_00.png` through `frame_NN.png` in narrative order.

---

## Step 4 — Upload to ImgBB

```python
import requests, base64, os

env_vars = {}
with open("/Users/joseph/Desktop/Kapathy/.env") as f:
    for line in f:
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            env_vars[k] = v

imgbb_key = env_vars.get("IMGBB_API_KEY", "")

def upload_gif(path):
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    resp = requests.post("https://api.imgbb.com/1/upload",
        data={"key": imgbb_key, "image": b64}, timeout=120)
    return resp.json()["data"]["url"]

# Upload 50% optimized as primary
gif_url = upload_gif(str(base_dir / f"{base_name}_optimized.gif"))
print(f"GIF URL: {gif_url}")

# Upload full-res on demand
full_url = upload_gif(str(base_dir / f"{base_name}.gif"))
print(f"Full-res URL: {full_url}")
```

---

## Step 5 — Return Results

Report to the user:
- **Primary URL** — 50% optimized version (best for LinkedIn/Twitter)
- **Full-res URL** — if requested
- **Frame count and duration** — e.g., "10 frames at 1.3s each = 13s loop"

---

## GIF Specs Summary

| Variant | Scale | Typical Size | Use Case |
|---|---|---|---|
| `{name}.gif` | 100% (full) | ~1.2–1.5 MB | Archival, local |
| `{name}_optimized.gif` | 50% | ~350–500 KB | LinkedIn, Twitter, web |
| `{name}_40pct.gif` | 40% | ~250–300 KB | Lightweight share |

**Frame duration:** 1.3 seconds per frame (1300ms) — brand standard.
**Loop:** Infinite (loop=0).
**Aspect ratio preserved:** All frames scaled uniformly.

---

## Trigger Phrases

- *"make a gif"*
- *"animate the batch"*
- *"turn these into a gif"*
- *"gif the article images"*
- *"assemble into a loop"*
- *"article gif"*
- *"animation from the gallery"*
- *"build an animation from the images"*
- *"turn the article into a gif"*

## Batch Reference: SAS is dead (Reference Implementation)

The SAS is dead campaign (v11–v20) is the canonical example. It demonstrates the full pipeline:

1. **Source:** `knowledge/drafts/2026-04-16-sas-is-dead.md` — 192-word article, 10 key quotes
2. **Extraction:** 10 quotes selected across the narrative arc (hook → diagnosis → resolution → close)
3. **Visual mapping:** Each quote assigned a distinct visual format (poster, surveillance, grid, funnel, factory, etc.)
4. **Gallery:** 10 images generated via Nano Banana, vision-verified (avg score 9.5/10)
5. **GIF assembly:** 10 frames at 1.3s = 13s loop, 3 size variants
6. **Upload:** ImgBB, primary URL returned

This pattern applies to any future Thought to Piece article:
- Extract the best quotes from the drafted article
- Map each quote to a distinct on-brand visual format
- Generate the images
- Assemble into narrative GIF following article arc order

---

# Algorithm 2 — Center-Stack Composition (4x5 GIF Frames)

Generate a batch of images optimized for animated GIF use. All frames share a **locked center composition** so the viewer's eye settles on one focal zone — eliminating the drift that happens when text migrates across frames. Joe Perkins is always the visual anchor. The three layers — **background effects → Joe → typography** — are composited in strict Z-axis order.

## The Core Problem This Solves

Previous gallery images used varied compositions (top-weighted posters, bottom-third thumbnails, side-aligned labels). When animated in sequence, the text jumps around the frame. Algorithm 2 locks the composition grid so every frame shares the same visual center.

## Aspect Ratio

**4x5 (portrait)** — not 9x16. This is the optimal format for:
- Mobile-first content (phone scroll)
- Editorial/statement posts
- Newsletter headers
- The "center-lock" zone is taller and more legible in portrait

## Three-Layer Z-Axis Composition

```
┌─────────────────────┐
│   BACK: Background   │  ← Solid field OR split OR grain-texture
│                     │
│  ┌───────────────┐  │
│  │ MID: JOE      │  │  ← Always center-frame, hero scale
│  │ (Z-axis core) │  │
│  └───────────────┘  │
│                     │
│   FRONT: Type Zone  │  ← ALL text locked to horizontal center band
│   (center-locked)   │
└─────────────────────┘
```

**Joe's placement:** Head and shoulders in the center mass of the frame — not in a corner, not at the bottom third. He is the anchor everything else relates to.

**Typography zone:** A horizontal band across the center of the frame — never top-weighted, never bottom-heavy. Text lives in the middle where the eye naturally rests.

## Background Layer Recipes (Twist These)

Rotate through these background treatments to keep visual variety while maintaining composition discipline:

| # | Name | Treatment |
|---|---|---|
| B1 | **Solid Field** | Single solid color — yellow, charcoal, or grey. Flat matte. |
| B2 | **Center Split** | Vertical split down the middle — one side yellow, one side charcoal. Joe straddles the seam. |
| B3 | **Gradient Band** | Horizontal band of yellow across the center — like a yellow stripe cutting through grey. Joe is half-immersed. |
| B4 | **Film Grain** | Flat grey background with fine grain overlay — tactile matte quality. |
| B5 | **Geometric Block** | One large yellow or charcoal geometric shape (circle, rectangle, diagonal) — partial frame coverage. Joe in front. |
| B6 | **Noise Field** | Charcoal with heavy asphalt-noise texture — surveillance/dossier atmosphere. |
| B7 | **Yellow Wash** | Full yellow field — Joe desaturated against it, text in charcoal knockout. |
| B8 | **Dual Field** | Top 60% yellow, bottom 40% charcoal. Joe emerges from the divide. |

## Typography Layer Recipes (Twist These)

Text is always centered in the middle band. Mix and match:

| # | Name | Treatment |
|---|---|---|
| T1 | **Knockout Headline** | Massive ALL CAPS Impact knocked out of a colored band — letters are transparent revealing background |
| T2 | **Solid Reverse** | White or yellow solid text on a charcoal rectangle bar — text ON Joe (Z-front) |
| T3 | **Split Label** | Top word in yellow, bottom word in charcoal — two-tone single headline |
| T4 | **Outline Type** | Massive outline/stroke text — hollow letters with background showing through |
| T5 | **Duotone Stack** | Two lines — top line yellow solid, bottom line grey — stacked tight |
| T6 | **Mono Label Band** | A horizontal bar across the center — monospace text inside, charcoal background, white/yellow text |
| T7 | **Quote Split** | Opening quote mark massive and isolated — first word of quote in solid, rest implied |
| T8 | **Negative Space** | Text in the color of the background — effectively invisible until the eye finds it |

## Joe Layer Recipes

Joe is always the Z-axis middle — between background and type. Mix his treatment:

| # | Treatment |
|---|---|
| J1 | **Desaturated flat** — no shadow, no highlight, flat matte against background |
| J2 | **Duotone** — yellow highlights / charcoal shadows on greyscale base |
| J3 | **High-contrast B&W** — near-silhouette, charcoal, only face details in hard light |
| J4 | **Backlit silhouette** — dark figure against a bright field, no facial detail |
| J5 | **Partially cropped** — only his head/shoulders visible, floating in center |
| J6 | **Full body, small** — Joe smaller in frame, more room for type — editorial feel |

## Composition Rules

1. **Joe is always center-frame** — not left, not right, not bottom-third. Center mass.
2. **All text is center-locked** — headlines, subheads, labels all live in the horizontal center band
3. **Three distinct Z layers** — background effects / Joe / typography — no exceptions
4. **4x5 aspect ratio** — always
5. **No corner text** — no monospace labels in bottom-right or top-left corners in this algorithm
6. **Matte finish only** — no shadows, no glow, no gradients on any layer
7. **Palette discipline** — yellow (#FDE910), charcoal (#1A1A1B), grey (#939598) — no pure black, no pure white backgrounds

## Generating 4-Frame Batches

Build prompts following this structure:

```
Image one is a detailed photograph of the man — middle-aged with salt-and-pepper
short cropped hair, full groomed boxed beard and mustache, [EXPRESSION], wearing
a black crew-neck t-shirt.

[BACKGROUND TREATMENT — choose B1 through B8]
[JOE TREATMENT — choose J1 through J6]
[TYPOGRAPHY TREATMENT — choose T1 through T8 — TEXT IS CENTER-LOCKED]

4x5 aspect ratio. Matte finish. No shadows, no glow, no gradients.
```

### Prompt Building Blocks (copy-paste per frame)

**Background (pick one per frame — rotate through B1-B8):**
- `Solid #FDE910 yellow background — entirely matte, zero texture.`
- `#1A1A1B charcoal background — heavy asphalt-noise grain texture.`
- `#939598 grey background — flat matte studio.`
- `Background: vertical center split — LEFT side #1A1A1B charcoal, RIGHT side #FDE910 yellow. Joe straddles the seam.`
- `Background: horizontal band across center — #FDE910 yellow band cutting through #939598 grey. Joe half-immersed in the band.`
- `Background: large #FDE910 yellow circle centered on grey — geometric, Joe behind it.`
- `Background: #1A1A1B charcoal with fine film grain overlay — surveillance matte.`
- `Background: top 60% #FDE910 yellow, bottom 40% #1A1A1B charcoal sharp horizontal divide. Joe emerges from the divide.`

**Joe (pick one — vary across frames):**
- `Joe center-frame — chest-up — flat matte greyscale — no shadow no highlight.`
- `Joe center-frame — duotone: #FDE910 highlights on left side, #1A1A1B charcoal shadow on right.`
- `Joe center-frame — near-silhouette, only face lit by a hard directional light from the left.`
- `Joe center-frame — partially cropped at shoulders — floating center — flat matte.`
- `Joe center-frame — backlit — dark silhouette against bright background — no facial detail.`
- `Joe full body, small in frame — editorial — more space for type above and below.`

**Typography — CENTER-LOCKED (pick one — this is the key differentiator):**
- `One massive word center-frame — #1A1A1B charcoal — ALL CAPS Impact Black — knocked out of a #FDE910 horizontal band that runs across the center third of the frame.`
- `A charcoal #1A1A1B rectangle bar runs horizontally across the center — bold white ALL CAPS text inside the bar — text literally on top of Joe.`
- `'THE TASTE.' massive #FDE910 solid top — 'REVOLUTION.' massive #939598 grey bottom — stacked tight — center-locked.`
- `One massive word in outline/stroke only — hollow #1A1A1B letters — background shows through the letters — center-frame.`
- `A horizontal monospace label band — #1A1A1B background — white text — runs across the center of the frame — small technical labels inside.`
- `A massive opening quotation mark in #FDE910 isolated — the first word of the quote in solid yellow — rest of text implied — center-frame.`
- `'[KEY WORD]' in the color of the background — effectively invisible against the field — eye discovers it — center.`

## Output

4 images per batch. All 4x5. All center-locked composition. Joe always center. All logged to `nano-banana-prompts.json` with `algorithm: 2` and `aspect_ratio: 4x5`.

## Visual Reference: Center-Stack Zone Map

```
┌────────────────────────────────────┐
│           BACK ZONE                │  ← Background (B1-B8)
│                                    │
│  ┌────────────────────────────┐    │
│  │      TYPOGRAPHY ZONE      │    │  ← Front: ALL text here (T1-T8)
│  │      (center-locked)       │    │
│  └────────────────────────────┘    │
│                                    │
│         ┌──────────┐               │
│         │   JOE    │               │  ← Middle: Joe center-frame (J1-J6)
│         │  CENTER  │               │
│         └──────────┘               │
│                                    │
│           FRONT ZONE               │
└────────────────────────────────────┘
```

## Trigger Phrases

- *"center-stack"*
- *"4x5 format"*
- *"locked center composition"*
- *"focused composition"*
- *"center-locked text"*
- *"portrait format"*
- *"visual focus gif"*
- *"one focal point"*
- *"center composition batch"*
