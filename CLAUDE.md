# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- **Package manager**: pnpm (not npm or yarn)
- `pnpm dev` — start dev server (0.0.0.0:5173)
- `pnpm build` — TypeScript check + Vite production build (`tsc -b && vite build`)
- `pnpm lint` — ESLint
- `pnpm preview` — preview production build

## Tech Stack

React 19 + TypeScript + Vite 7 + Tailwind CSS v4 + Zustand + GSAP + shadcn/ui

## Architecture

**Single-page app with section-based navigation** (no router). `App.tsx` switches between sections (`hero`, `modelos`, `marca`, `dealers`, `partes`) based on `activeSection` from the Zustand navigation store, with GSAP-animated transitions.

**State management** — two Zustand stores:
- `navigationStore` — active section, transition state, selected category
- `countryStore` — country/language selection, persisted to localStorage, auto-detects via ipapi.co

**Component organization:**
- `src/components/` — page sections (Hero, Header, Footer, ModelosSection, etc.)
- `src/components/ui/` — shadcn/ui base components (button, lazy-image, etc.)
- `src/data/bikes.ts` — static bike model data
- `src/store/` — Zustand stores
- `src/types/` — TypeScript interfaces
- `src/utils/` — bike category/model/color utilities

**Import alias**: `@/*` maps to `./src/*`

## Styling

Tailwind CSS v4 with custom theme in `src/index.css`:
- Fonts: "Bebas Neue" (headings), "Knewave" (accent) — loaded via Google Fonts in `index.html`
- Custom breakpoints: `laptop` (1280px), `desktop` (1440px), plus xl/2xl/3xl
- Dark theme with red/blue accent colors

## Bike Image Convention

Images stored in `src/assets/bikes/[MODEL]/[COLOR]/`:
- `main.avif` — primary image (exception: ADRI SPORT blanca uses `front.avif`)
- `front.avif` — front view
- `1.avif` through `10.avif` — additional gallery images
- All lazy-loaded via IntersectionObserver (`LazyImage` component)

## Language

The project README, UI content, and bike data are in **Spanish**. Maintain Spanish for user-facing text.
