# Product Requirements
## What

We are implementing motorcycle track racing website.

Style: Racing-inspired, dark mode, Kawasaki green accents, aggressive sporty aesthetic.

## For Whom

Moto fans.

## Constraints

- Mobile-first responsive (375px → 1440px+)
- Accessibility: WCAG 2.2 AA, visible focus rings, keyboard navigation
- Zero hardcoded hex colors in components — use tokens from `app/globals.css`
- Server Components by default; `"use client"` only where strictly needed
- Bundle: do not add charting / animation libraries unless mandatory

## Figma Source of Truth

Main Figma file:
https://www.figma.com/design/jiKKJNmBrUv4aCHVqUFNoB/Ninja-400-Track-Racing

Mobile layout (frame URL with `node-id`):
https://www.figma.com/design/jiKKJNmBrUv4aCHVqUFNoB/Ninja-400-Track-Racing?node-id=8-2

Desktop layout (frame URL with `node-id`):
https://www.figma.com/design/jiKKJNmBrUv4aCHVqUFNoB/Ninja-400-Track-Racing?node-id=8-2&t=N5i3Oh2f0bfjp4Kb-4
_TBD — MCP rate limit hit before Desktop Layout was created. Duplicate Mobile Layout to 1440px or ask agent to finish when limit resets._

Design tokens in file: `Racing Tokens` collection (dark bg, Kawasaki green `#69BE28`, surfaces, text).

Additional screens to add in Figma: Dashboard, Track Records, Photo Gallery.

## Sections to Implement

We need:
- [ ] Landing page with hero section for my Kawasaki Ninja
- [ ] Dashboard showing best lap times
- [ ] Records page on different tracks
- [ ] Photo gallery for track day photos

## Interaction Requirements (minimum 1 client component)

- [ ] Burger menu (mobile nav)
- [ ] Tabs / accordion
- [ ] Tooltip
