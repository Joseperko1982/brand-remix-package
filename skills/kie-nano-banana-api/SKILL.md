---
name: kie-nano-banana-api
description: Call kie.ai's Nano Banana (Gemini image gen) API — upload seed, submit job, poll, download. Use for brand-image generation when a prompt library (visual-dna-gallery) already exists.
version: 1.0.0
author: Hermes Agent
metadata:
  hermes:
    tags: [image-generation, nano-banana, kie-ai, gemini, api]
    triggers: ["generate image with nano banana", "kie.ai image gen", "nano banana api"]
---

# kie.ai Nano Banana API — Image Generation

Generate images via kie.ai's Nano Banana (Gemini) API using seed images + text prompts. Workflow: upload seed → submit → poll → download.

## Credentials

Requires `KIE_API_KEY` (kie.ai account) and `IMGBB_API_KEY` (for uploading seed images to get public URLs). These must already be available in the environment or a `.env` file.

**kie.ai endpoint**: `https://api.kie.ai/api/v1/jobs/createTask`
**Status endpoint**: `https://api.kie.ai/api/v1/jobs/recordInfo`
**ImgBB upload**: `https://api.imgbb.com/1/upload`
**Result domain**: `https://tempfile.aiquickdraw.com/workers/nano/`

## Critical Constraints (Discovered Through Trial & Error)

- **`image_urls` is ALWAYS required** — even for purely typographic prompts. Provide at least one seed image URL or API returns `image_urls is required`.
- **`image_size` must be `"auto"`** — do NOT use `"1K"`, `"2K"`, `"HD"`, `"SD"` or any other value. The API returns `image_size is not within the range of allowed options` for anything else.
- **Never put hex codes in prompts** — the model renders them as text (e.g. `#FDE910` appears as `FDE910` in output). Describe colors verbally: "vibrant yellow", "deep charcoal", "matte grey".
- **Poll via `recordInfo?taskId=`** — not a predictions endpoint.
- **Result URLs expire** — download immediately after generation.

## Pipeline (4 Steps)

### Step 1 — Upload Seed Image to ImgBB

kie.ai requires publicly accessible image URLs. Use ImgBB:

```python
import base64, requests
from pathlib import Path

imgbb_key = "<imgbb-key>"
seed_path = "/path/to/seed.png"

with open(seed_path, "rb") as f:
    img_b64 = base64.b64encode(f.read()).decode()

resp = requests.post("https://api.imgbb.com/1/upload",
    data={"key": imgbb_key, "image": img_b64}, timeout=30)
seed_url = resp.json()["data"]["url"]
```

**Tip:** For brand-consistent results, use a seed from the brand's own assets (from visual-dna-gallery). This anchors the model to the brand's style.

### Step 2 — Submit Generation Job

```python
kie_key = "<kie-key>"
payload = {
    "model": "google/nano-banana-edit",
    "input": {
        "prompt": "VERBAL DESCRIPTION — no hex codes, no color swatches",
        "image_urls": [seed_url],
        "output_format": "png",
        "image_size": "auto"
    }
}
headers = {"Authorization": f"Bearer {kie_key}", "Content-Type": "application/json"}

resp = requests.post("https://api.kie.ai/api/v1/jobs/createTask",
    headers=headers, json=payload)
task_id = resp.json()["data"]["taskId"]
```

### Step 3 — Poll for Completion

```python
import time, json
headers = {"Authorization": f"Bearer {kie_key}"}
status_url = "https://api.kie.ai/api/v1/jobs/recordInfo"

for attempt in range(40):  # ~2 min timeout
    time.sleep(3)
    status = requests.get(f"{status_url}?taskId={task_id}", headers=headers).json()
    state = status["data"]["state"]
    if state == "success":
        result_json = json.loads(status["data"]["resultJson"])
        img_url = result_json["resultUrls"][0]
        break
    elif state == "fail":
        raise Exception(f"Generation failed: {status['data'].get('failMsg')}")
```

### Step 4 — Download Result

```python
img_resp = requests.get(img_url, timeout=30)
output_path = Path("/desired/output.png")
output_path.write_bytes(img_resp.content)
```

## Prompt Engineering Rules

- **NEVER**: hex codes, RGB values, color swatches written as text, markdown formatting
- **ALWAYS**: verbal color descriptions — "vibrant yellow", "deep charcoal", "cool grey", "matte off-black"
- **Specify negatives explicitly**: "no gradients", "no drop shadows", "no glow", "zero texture", "flat matte finish only"
- **Font descriptions**: "ultra-bold condensed sans-serif", "Impact-style", "Helvetica Black", "geometric all-caps"
- **Quality anchors**: "matte finish", "industrial aesthetic", "Swiss design", "high contrast"
- **Reference brand DNA** after first establishing from visual-dna-gallery: palette, composition rules, subject treatment

## Troubleshooting

| Error | Fix |
|---|---|
| `image_urls is required` | Always pass at least one seed image URL |
| `image_size is not within range` | Use `"image_size": "auto"` — only valid value |
| Hex codes appear as text in output | Remove all hex codes from prompt — use verbal names only |
| Timeout | Increase poll limit or retry |
| Blurry/low-res | Use a more brand-representative seed; be more specific about quality |
| Seed URL has spaces | ImgBB returns clean URLs — if using own host ensure URL is properly encoded |

## Complete Working Template

```python
import os, json, time, base64, requests
from pathlib import Path

kie_key = os.environ["KIE_API_KEY"]
imgbb_key = os.environ["IMGBB_API_KEY"]

# 1. Upload seed
with open("/path/to/seed.png", "rb") as f:
    seed_url = requests.post("https://api.imgbb.com/1/upload",
        data={"key": imgbb_key, "image": base64.b64encode(f.read()).decode()},
        timeout=30).json()["data"]["url"]

# 2. Submit job
prompt = "VERBAL PROMPT — vivid description of desired image, no hex codes"
resp = requests.post("https://api.kie.ai/api/v1/jobs/createTask",
    headers={"Authorization": f"Bearer {kie_key}", "Content-Type": "application/json"},
    json={"model": "google/nano-banana-edit", "input": {
        "prompt": prompt, "image_urls": [seed_url],
        "output_format": "png", "image_size": "auto"
    }})
task_id = resp.json()["data"]["taskId"]

# 3. Poll
headers = {"Authorization": f"Bearer {kie_key}"}
for _ in range(40):
    time.sleep(3)
    data = requests.get(
        f"https://api.kie.ai/api/v1/jobs/recordInfo?taskId={task_id}",
        headers=headers).json()["data"]
    if data["state"] == "success":
        img_url = json.loads(data["resultJson"])["resultUrls"][0]
        break
    elif data["state"] == "fail":
        raise Exception(f"Failed: {data.get('failMsg')}")

# 4. Download
out = Path("/path/to/output.png")
out.write_bytes(requests.get(img_url, timeout=30).content)
print(f"Saved: {out}")
```
