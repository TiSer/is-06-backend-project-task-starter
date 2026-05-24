---
version: alpha
name: Ninja Track Racing
description: Dark-mode motorcycle track racing app for Kawasaki Ninja riders — lap times, sessions, records, and track-day gallery.
colors:
  primary: "#69BE28"
  secondary: "#9999A6"
  tertiary: "#1A1A1F"
  neutral: "#FFFFFF"
  background: "#0A0A0D"
  elevated: "#242429"
  border: "#383840"
  on-primary: "#0A0A0D"
typography:
  display:
    fontFamily: Rajdhani
    fontSize: 3.5rem
    fontWeight: 700
    lineHeight: 1.1
  display-mobile:
    fontFamily: Rajdhani
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.15
  h1:
    fontFamily: Rajdhani
    fontSize: 1.75rem
    fontWeight: 700
    lineHeight: 1.2
  h2:
    fontFamily: Rajdhani
    fontSize: 1.25rem
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 600
    lineHeight: 1.4
  stat:
    fontFamily: Rajdhani
    fontSize: 1.75rem
    fontWeight: 700
    lineHeight: 1.2
  caption:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.35
  badge:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.04em
rounded:
  sm: 8px
  md: 10px
  lg: 12px
  full: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  page-mobile: 16px
  page-desktop: 48px
components:
  page-canvas:
    backgroundColor: "{colors.background}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: label
    rounded: "{rounded.sm}"
    padding: 14px
  button-primary-hover:
    backgroundColor: "#7AD033"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.neutral}"
    typography: label
    rounded: "{rounded.sm}"
    padding: 14px
  card-surface:
    backgroundColor: "{colors.tertiary}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  card-track:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  card-stat:
    backgroundColor: "{colors.elevated}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  nav-item-active:
    textColor: "{colors.primary}"
    typography: caption
  nav-item:
    textColor: "{colors.secondary}"
    typography: caption
---

## Overview

Motorcycle track racing web app centered on the **Kawasaki Ninja**. Audience: moto fans and track-day riders who log laps, sessions, and personal bests.

**Tone:** Aggressive, sporty, pit-lane energy — not corporate SaaS. Racing-inspired **dark mode** with **Kawasaki green** (`#69BE28`) as the sole accent driver.

**Figma source of truth** (see also `docs/prd.md`):

| Asset | Link |
| ----- | ---- |
| Main file | [Ninja Track Racing](https://www.figma.com/design/jiKKJNmBrUv4aCHVqUFNoB/Ninja-400-Track-Racing) |
| Mobile layout (375px) | [Mobile Layout](https://www.figma.com/design/jiKKJNmBrUv4aCHVqUFNoB/Ninja-400-Track-Racing?node-id=8-2) |
| Desktop layout (1440px) | [Desktop Layout](https://www.figma.com/design/jiKKJNmBrUv4aCHVqUFNoB/Ninja-400-Track-Racing?node-id=8-2&t=N5i3Oh2f0bfjp4Kb-4) |

Figma variable collection: `Racing Tokens` (Dark mode). **In Figma today:** Landing (mobile + desktop duplicate). **Still to design:** Dashboard, Track Records, Photo Gallery.

**Implementation sync:** Map YAML tokens to `app/globals.css` via `npx @google/design.md export --format css-tailwind docs/DESIGN.md`. Do not hardcode hex in components.

**Pages (from PRD):** Landing (Ninja hero), Dashboard (lap times + sessions), Track Records (DniproKart and others), Photo Gallery (track day photos).

## Colors

Dark, high-contrast palette with one brand accent.

- **Primary (#69BE28):** Kawasaki green — logo, CTAs, active nav, stat highlights, badges, focus rings.
- **Secondary (#9999A6):** Muted slate — secondary copy, inactive nav, metadata.
- **Tertiary (#1A1A1F):** Surface — header, bottom nav, cards, secondary buttons.
- **Neutral (#FFFFFF):** Primary text on dark backgrounds.
- **Background (#0A0A0D):** Page canvas.
- **Elevated (#242429):** Stat cards, badges, menu button, image placeholders.
- **Border (#383840):** Dividers, card strokes, input borders.
- **On-primary (#0A0A0D):** Text on green buttons (WCAG contrast).

## Typography

**Font stack (source of truth):** [Rajdhani](https://fonts.google.com/specimen/Rajdhani) for display/headings/stats + [Inter](https://fonts.google.com/specimen/Inter) for UI/body/nav, loaded via `next/font/google` in `app/layout.tsx`. Geist Mono for nav index labels. Rajdhani is an OFL-licensed alternative to proprietary MotoGP™ display fonts; Inter keeps condensed nav labels and tables readable.

| Role | YAML token | CSS | `app/globals.css` |
| ---- | ---------- | --- | ----------------- |
| Hero, page titles, section headers, lap stats | `display`, `display-mobile`, `h1`, `h2`, `stat` | `--font-display` / `font-display` | `h1`–`h3`, `.text-display*`, `.text-h1`, `.text-h2`, `.text-stat` → Rajdhani |
| Body, buttons, tables, nav labels | `body`, `body-lg`, `label`, `caption`, `badge` | `--font-sans` / `font-sans` | `body`, default UI → Inter |
| Nav indices | — | `--font-mono` | `.font-mono` → Geist Mono |

YAML `fontWeight` for Rajdhani tokens matches loaded weights **600–700** in code (Tailwind `font-extrabold` on display uses weight 700).

- **Display:** Hero headlines (“Where asphalt meets adrenaline”) — `display-mobile` on small screens, `display` from `lg` up — **Rajdhani**.
- **H1 / H2 / H3:** Page and section titles — **Rajdhani** (semantic headings via `@layer base`).
- **Body / body-lg:** Subtitles and descriptions — **Inter**.
- **Label:** Buttons, table headers, nav labels — **Inter**.
- **Stat:** Lap times and numeric highlights — **Rajdhani**, always in **primary** green.
- **Caption:** Bottom nav, session meta (“PB 1:04.2 · 12 sessions”) — **Inter**.
- **Badge:** Uppercase pills (“TRACK WEAPON”, “KAWASAKI”) — **Inter**; brand wordmark “Ninja” in nav may use `font-display` (Rajdhani) where noted in components.

## Layout

**Mobile-first:** 375px base → 1440px+ desktop.

- **Mobile:** Single column; fixed header (56px); bottom nav (64px) with four items — Home, Dash, Records, Gallery.
- **Desktop:** Target left sidebar nav (Home, Dashboard, Track Records, Gallery) + main content; current Figma desktop frame is a widened mobile duplicate — refine in Figma or code.
- **Page padding:** `{spacing.page-mobile}` horizontal on mobile, `{spacing.page-desktop}` on desktop.
- **Section gaps:** `{spacing.lg}`–`{spacing.xl}` between hero, stats, and track preview blocks.
- **Stats row:** Three equal columns (Best Lap, Sessions, Tracks).
- **Dashboard:** Lap table full width on desktop; session cards in a right column (~400px) or stacked on mobile.
- **Gallery:** Responsive grid (2 cols mobile, 3–4 cols desktop).

### Mobile landing structure (implemented in Figma)

1. Header — “NINJA” wordmark + burger menu  
2. Hero — badge, title, subtitle, bike image placeholder, dual CTAs  
3. Stats — Best Lap `1:04.2`, Sessions `24`, Tracks `5`  
4. Tracks preview — DniproKart card  
5. Bottom nav — active item uses primary green  

## Elevation & Depth

Depth through **tonal layers**, not heavy shadows.

- **Background** → **surface (tertiary)** → **elevated** for nested cards and controls.
- Borders (`{colors.border}`) separate rows and cards where contrast alone is insufficient.
- Optional subtle shadow on modals/sheets only; avoid glassmorphism and neumorphism.

## Shapes

Sporty but controlled — slight rounding, no pills except badges.

- **Buttons & icon controls:** `{rounded.sm}` (8px).
- **Cards & track rows:** `{rounded.md}`–`{rounded.lg}` (10–12px).
- **Pills / badges:** `{rounded.full}` for “TRACK WEAPON” and similar tags.
- **Hero image placeholder:** `{rounded.lg}` with optional 4px primary accent bar on desktop.

## Components

Use shadcn primitives (`Button`, `Card`, `Badge`, `Table`, `Tabs`, `Sheet`, `Tooltip`) styled with these tokens.

| Pattern | Tokens / behavior |
| ------- | ----------------- |
| Primary CTA | `button-primary` / `button-primary-hover` — “View Sessions” |
| Secondary CTA | `button-secondary` + border — “Records” |
| Stat card | `card-stat` — large `{typography.stat}` in primary, caption label in secondary |
| Track row | `card-surface` + border — title, PB in primary, chevron or meta |
| Bottom nav | `nav-item` default; `nav-item-active` for current route |
| Burger menu | `Sheet` on mobile; `aria-label` required |
| Tabs / accordion | Track records grouped by venue |
| Tooltip | Lap and session detail on dashboard |

**Interaction states (all interactives):** `hover`, `focus-visible` (primary green ring), `disabled`, `loading` where applicable. Keyboard navigation end-to-end.

## Do's and Don'ts

**Do**

- Use **primary green** for the single most important action per screen and for active navigation.
- Keep backgrounds dark; stack surfaces as background → tertiary → elevated.
- Use **stat** typography + primary color for lap times and PBs.
- Target **WCAG 2.2 AA**; visible focus rings on every interactive element.
- Degrade dashboard tables to cards on narrow viewports.
- Sync tokens to `app/globals.css`; validate with `npx @google/design.md lint docs/DESIGN.md`.

**Don't**

- Don't use generic gradient SaaS, glassmorphism, or light-gray dashboard defaults.
- Don't introduce off-brand neon/lime that isn't Kawasaki `#69BE28`.
- Don't use **secondary** muted color for essential content or primary actions.
- Don't hardcode hex in React components — reference CSS variables from exported tokens.
- Don't add charting or animation libraries unless PRD explicitly requires them.
- Don't mix sharp corners with large pill radii on the same control type (badges excepted).
