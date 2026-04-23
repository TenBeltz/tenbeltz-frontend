---
name: tenbeltz:brand-guidelines
description: Applies TenBeltz official brand colors and typography to any artifact that benefits from TenBeltz look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply.
license: MIT
---

# TenBeltz Brand Styling

## Overview

To access TenBeltz official brand identity and style resources, use this skill.

**Keywords**: branding, corporate identity, visual identity, post-processing, styling, brand colors, typography, TenBeltz brand, visual formatting, visual design, gradients, AI in production

## Brand Guidelines

### Colors

**Main Colors:**

- Deep Night: `#02010A` - Primary dark background
- Dark Surface: `#0B0122` - Card and section backgrounds
- Brand Purple: `#9238D6` - Primary CTA and highlighted text
- Bright Violet: `#C45BFF` - Primary gradient endpoint and glow accents
- Soft Light: `#F8F2FF` - Primary text on dark backgrounds
- Muted Lilac: `#DCCAF2` - Secondary text on dark backgrounds

**Accent Colors:**

- Electric Cyan: `#79CAFF` - Secondary accent and data emphasis
- Signal Blue: `#59B8FF` - Supporting accent lines
- Deep Violet: `#6D2ED3` - Depth, glows, and secondary contrast

**Token Palette (Source of truth in UI):**

- `--color-pheromone-purple` - Core brand purple
- `--color-pheromone-light` - Bright highlight purple
- `--color-blueberry-glaze` - Secondary vivid accent
- `--color-cold-heights` - Cool light accent
- `--color-obsidian-shard` - Dark base neutral
- `--color-white-smoke` - High-contrast light neutral

### Typography

- **Headings**: Helvetica Neue / Helvetica / Arial (sans-serif fallback)
- **Body Text**: Helvetica / Arial / system sans
- **Note**: The current TenBeltz visual system favors clean sans-serif typography and high contrast over decorative fonts

## Features

### Smart Font Application

- Applies strong sans-serif weights for headings (bold emphasis)
- Uses readable sans-serif body copy for long-form content
- Keeps consistent spacing and hierarchy across web, banners, and social assets
- Preserves clarity in both Spanish and English content

### Text Styling

- Headings: bold sans-serif, often paired with purple-to-violet gradient text
- Body text: neutral light tones over dark backgrounds
- CTA text: high-contrast white/lilac with purple emphasis
- Secondary text: muted lilac for supportive messaging

### Shape and Accent Colors

- Non-text shapes should prioritize dark surfaces with purple/cyan highlights
- Preferred accent cycle: `#9238D6` -> `#C45BFF` -> `#79CAFF`
- Glows and gradient strokes should be subtle and directional, not flat

## Technical Details

### Font Management

- Default to system-safe sans-serif stacks for reliability
- Use heavier font weights for technical-confidence tone in headlines
- No mandatory custom font installation is required
- Keep typographic rhythm compact and precise for production-focused messaging

### Color Application

- Prefer existing `@theme` tokens in `src/styles/global.css` over ad-hoc colors
- Use dark-first compositions with controlled neon accents
- Apply gradients for emphasis areas only (hero highlights, key CTAs, data strokes)
- Maintain WCAG-friendly contrast in all text/background combinations

### Brand Sources

- `src/styles/global.css` (`@theme` TenBeltz color tokens)
- `assets/banners/tenbeltz-linkedin-company/tenbeltz-linkedin-company-4200x700.svg` (official marketing palette and gradients)
- Components using brand gradients (e.g. `#9238D6` -> `#C45BFF`) across hero and section highlights
