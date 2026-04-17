#!/bin/bash
# brand-remix-package/install.sh
# Copy skills + references into Hermes profile on a fresh machine.
# Run this once on the target Hermes installation.

set -e

HERMES_DIR="$HOME/.hermes/profiles/writing"
SKILLS_DIR="$HERMES_DIR/skills/creative"

echo "Installing brand-remix package..."

# Copy skills
mkdir -p "$SKILLS_DIR/brand-remix"
cp -f "$(dirname "$0")/skills/brand-remix/SKILL.md" "$SKILLS_DIR/brand-remix/"

mkdir -p "$SKILLS_DIR/kie-nano-banana-api"
cp -f "$(dirname "$0")/skills/kie-nano-banana-api/SKILL.md" "$SKILLS_DIR/kie-nano-banana-api/"

echo "Skills installed to $SKILLS_DIR"

# Copy reference files
KAPATHY_DIR="$HOME/Desktop/Kapathy"
if [ ! -d "$KAPATHY_DIR" ]; then
    echo "WARNING: $KAPATHY_DIR not found — skipping references"
    echo "  Create $KAPATHY_DIR and copy references/ there manually"
else
    cp -f "$(dirname "$0")/references/"*.json "$KAPATHY_DIR/references/"
    echo "References installed to $KAPATHY_DIR/references/"
fi

# Copy seed images
THUMB_DIR="$HOME/Desktop/Seedance collection/thought-to-piece/thumb"
if [ ! -d "$THUMB_DIR" ]; then
    echo "WARNING: $THUMB_DIR not found"
    echo "  Copy seeds/ contents there manually"
else
    cp -f "$(dirname "$0")/seeds/"*.png "$THUMB_DIR/"
    echo "Seeds installed to $THUMB_DIR"
fi

echo "Install complete."
echo ""
echo "Next steps:"
echo "  1. Copy .env.example to $HOME/Desktop/Kapathy/.env and fill in your API keys"
echo "  2. Restart Hermes to load the new skills"
echo "  3. Try: 'brand remix' or 'run algo 2'"
