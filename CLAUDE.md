# Convert Everything

Local-only, browser-based everything-to-everything converter. No server, no ads, no tracking. All processing happens client-side.

## Stack

- Vite + React
- Plain CSS (no Tailwind)
- Static site — no backend

## Design Philosophy

### Colors & Theme
- Greyscale with a slight warm/yellow tint
- Both light and dark mode follow this warm greyscale palette
- NO purple anywhere
- Mix between warm UI aesthetic (like anthropic.com / claude.ai) and modern clean web UI

### Borders & Shapes
- NO outlines
- NO borders
- border-radius: either pill (full round, 999px) or small (2-4px). Never in-between like 8px
- NO drop shadows — static shadows only (solid, non-gradient, 100% opacity offset shadows)

### Typography
- Font family: "Gothic A1" (Google Fonts)
- NO monospace/technical/"settings-looking" fonts that vibe-coded apps tend to use
- Clean, readable, warm

### Interactions & Animation
- Smooth but optimized — no janky or laggy transitions
- Hover on buttons: only change color to brighter. No scale-up, no translate-up, no grow effects
- Keep animations subtle and performant

### General Vibe
- Clean, minimal, no clutter
- The tool should feel effortless — like it just works
- No unnecessary decoration or UI chrome
