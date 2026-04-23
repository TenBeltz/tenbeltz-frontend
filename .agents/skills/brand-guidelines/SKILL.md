---
name: tenbeltz:brand-guidelines
description: Applies the current TenBeltz brand system to pages, banners, social assets, decks, and branded artifacts. Use it when TenBeltz visual identity, voice, colors, typography, or production-focused messaging should shape the output.
license: MIT
---

# TenBeltz Brand Guidelines

## Overview

Use this skill when an artifact should feel unmistakably like current TenBeltz.

TenBeltz is not styled like a generic AI startup. The brand should communicate technical judgment, operational clarity, and production-readiness. The visual system is dark, precise, and atmospheric. The verbal system is direct, skeptical of hype, and centered on reliability, observability, and cost control.

**Keywords**: TenBeltz, brand, visual identity, AI engineering, AI in production, observability, reliability, cost control, dark UI, gradients, IBM Plex Sans

## Brand Positioning

TenBeltz presents itself as:

- an external AI engineering team
- a production-first partner, not a demo shop
- a technical counterpart for SaaS companies and software consultancies
- a specialist in reliability, observability, guardrails, and cost control

TenBeltz should not sound like:

- a hype-driven AI agency
- a generic innovation consultancy
- a playful consumer AI brand
- a vague "we do everything" studio

## Verbal Direction

### Core message

TenBeltz helps software companies define, validate, ship, and operate AI systems that can survive real product constraints.

### Repeated concepts that fit the brand

- AI in production
- external AI engineering team
- technical criteria
- measurable reliability
- observability
- guardrails
- delivery criteria
- cost control
- viable systems
- no demos, no vague experimentation

### Voice

- direct
- technical
- sober
- precise
- skeptical of fluff
- commercially sharp, but not salesy

### Writing rules

- Prefer concrete language over inspirational language.
- Speak in terms of systems, constraints, risks, and outcomes.
- Treat "production" as the center of gravity.
- Emphasize clarity and operational readiness.
- Keep copy compact and high-signal.
- Avoid empty claims like "cutting-edge", "revolutionary", or "transformative".

### Messaging formulas that fit

- "IA en produccion"
- "fiabilidad medible"
- "observabilidad desde el dia uno"
- "control de costes"
- "criterio tecnico claro"
- "no demos"
- "no horas sin contexto"

## Visual Direction

### Brand character

The current redesign is best described as:

- dark operational interface
- high-contrast technical confidence
- purple-led gradients with cyan support accents
- layered depth, glows, and atmospheric lighting
- structured cards, panels, rails, and signal-like details
- productized engineering, not futuristic sci-fi spectacle

The overall feel should suggest "command surface for AI systems in production", not "AI art", "neon cyberpunk", or "playful SaaS dashboard".

### Composition principles

- Default to dark-first compositions.
- Use gradients and glow sparingly to emphasize hierarchy.
- Prefer modular blocks, cards, and panels over loose decorative layouts.
- Use strong spacing and clean structure before adding effects.
- Favor subtle interface-like details: borders, signal rails, metric chips, indexed items, traces, and status surfaces.
- Build atmosphere with layered backgrounds, radial light, and masked grids rather than flat fills.

## Typography

### Primary typeface

- **Primary**: `IBM Plex Sans`
- **Fallback**: `sans-serif`

### Source of truth

- `src/layouts/Layout.astro`
- `src/styles/global.css`

### Typographic behavior

- Headlines should feel compact, technical, and confident.
- Use bold to semibold weights, especially in hero and section headings.
- Tight letter-spacing is acceptable for larger headlines.
- Body copy should stay clean and readable, not ornamental.
- Monospace styling can be used sparingly for labels, counters, status markers, and indexed metadata.

### Do not use

- Helvetica as the primary reference
- decorative display fonts
- overly rounded startup typography
- soft, friendly wellness-style typography

## Color System

### Source of truth

Use the tokens in `src/styles/global.css` before inventing new colors.

### Core tokens

- `--color-obsidian-shard`: dark base background
- `--color-pheromone-purple`: primary brand purple
- `--color-pheromone-light`: bright highlight purple
- `--color-blueberry-glaze`: vivid secondary accent for CTA gradients
- `--color-cold-heights`: cool cyan accent for signal contrast
- `--color-sapphire-siren`: deeper purple support tone
- `--color-berry-blackmail`: dark secondary surface/accent
- `--color-white-smoke`: high-contrast light neutral

### Supporting tokens used in the system

- `--color-petal-plush`
- `--color-spiro-disco-ball`
- `--color-vivid-blue`
- `--color-child-of-the-night`
- `--color-blacklist`

### Practical roles

- Backgrounds: `obsidian-shard`, dark gradients, dark layered surfaces
- Cards and panels: dark surfaces with subtle alpha and purple borders
- CTA emphasis: `pheromone-purple` -> `blueberry-glaze`
- Highlight text and glow points: `pheromone-light`
- Signal accents and data emphasis: `cold-heights`
- Atmospheric depth: `sapphire-siren`, `berry-blackmail`

### Preferred color relationships

- Primary emphasis: `#9238D6` -> `#C45BFF`
- CTA emphasis: `pheromone-purple` -> `blueberry-glaze`
- Signal highlights: `pheromone-light` + `cold-heights`
- Dark surface layering: `obsidian-shard` + deep purple overlays

### Color usage rules

- Keep the base dark.
- Use bright accents in small, intentional areas.
- Avoid large flat blocks of saturated purple.
- Cyan is a support accent, not the brand lead.
- Preserve strong contrast for all text.

## UI Patterns That Match The Current Web

These patterns are already present in the redesign and should be reused when possible:

- large hero headings with compact line-height
- gradient-highlighted words or spans
- frosted or translucent dark cards with purple borders
- pill chips and status markers
- metric-like labels with compact uppercase tracking
- numbered lists or indexed capability markers
- blurred radial light behind key surfaces
- subtle grid backgrounds and masked overlays
- panels that feel like technical modules, not generic marketing cards

## Motion And Effects

- Motion should reinforce clarity and atmosphere, not novelty.
- Prefer slow drifts, scan effects, proof-point rotation, and subtle hover elevation.
- Glows should feel directional and controlled.
- Avoid noisy particle fields, gimmicky holograms, or excessive looping effects.

## Asset Guidance

### When creating branded artifacts

- Reuse the dark base, purple gradient, and cyan signal language.
- Keep layouts structured and deliberate.
- Make the artifact feel engineered, not illustrated.
- If you need a focal area, use one strong glow or gradient region, not many competing accents.

### Good artifact types for this brand

- website hero sections
- LinkedIn banners
- case-study covers
- proposal/deck title slides
- technical diagrams with brand styling
- social cards for insights or offers

## Do / Don't

### Do

- use `IBM Plex Sans`
- rely on tokens from `src/styles/global.css`
- keep the tone production-first and technically credible
- prioritize readability and structure
- use purple-led emphasis with cyan as support
- make visuals feel like an operational system

### Don't

- write hype-heavy copy
- use soft pastel brand treatments
- make the brand playful or whimsical
- default to generic SaaS white cards on white backgrounds
- overuse neon effects
- describe TenBeltz like a broad AI agency

## Brand Sources

- `src/styles/global.css`
- `src/layouts/Layout.astro`
- `src/components/HomeHero.astro`
- `src/templates/LandingPage.astro`
- `src/templates/WhoBehindPage.astro`
- `assets/banners/tenbeltz-linkedin-company/tenbeltz-linkedin-company-4200x700.svg`

## Application Rule

If you are generating or editing a TenBeltz-branded artifact, default to:

1. dark operational composition
2. IBM Plex Sans typography
3. token-based purple/cyan accents
4. direct production-first messaging
5. structured panels, chips, metrics, or technical UI cues

If an output follows the old brand assumptions but ignores the redesign language above, it is not aligned with the current TenBeltz identity.
