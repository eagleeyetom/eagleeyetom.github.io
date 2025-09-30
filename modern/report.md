# MASSKA Modernization Report

Date: 28 September 2025  
Prepared for: MASSKA International Theatre Review

## Overview

The modernization follows the four-stage plan outlined in `instructions.md`. The new experience is delivered in the `modern/` directory with language-specific pages under `modern/en/` and `modern/pl/`. A shared asset pipeline (`modern/assets/`) hosts typography, styles, and JavaScript for accessibility features.

## Stage 1 · Analysis

- **Structure**: Audited `index.html`, `online.html`, and `azdaki.html` (PL/EN versions). Deprecated tags were removed; headings were reorganized into a single `h1` per page and logical subheadings.
- **CSS**: Inline rules migrated into `modern/assets/styles.css`. A mobile-first layout replaces the fixed-width design.  font-family uses the Inter variable font with `font-display: swap`.
- **Accessibility**: Ensured alt attributes and semantic regions (`header`, `main`, `footer`). Added skip-links and keyboard focus outlines. Color contrast improvements planned for high-contrast mode.

## Stage 2 · Structure & Design

- **HTML refactor**: Semantic sections such as `hero`, `card-grid`, `theater-card`, and `info-panel` replace legacy div structures. Placeholder imagery integrates via `https://via.placeholder.com/` URLs.
- **Responsive design**: Fluid typography via CSS clamp and custom properties. Layout grids adapt using CSS Grid and flexbox with breakpoints at 720px and 960px.
- **Visual identity**: Introduced modern color palette (`--color-accent`, `--color-surface`, `--color-bg`). Cards, buttons, and navigation reflect contemporary UI patterns.

## Stage 3 · Accessibility Features

- **Contrast toggle**: `body.high-contrast` theme exposed through a header button (`data-action="toggle-contrast"`). Colors meet AA contrast ratios.
- **Font sizing**: Buttons (`A-`, `A+`) adjust `--font-scale` stored in Local Storage; all typography uses REM units.
- **Language switcher**: Header links (`data-language`) highlight the active locale and update stored preference. Root `modern/index.html` auto-redirects to the preferred language.
- **Persistence**: Settings persisted with the key `masskaModernSettings`. Cookie consent stored separately (`masskaModernCookies`).

## Stage 4 · Testing & Verification

### Implemented checks

- Responsive viewport validation at 360px, 768px, 1024px, 1440px (manually with browser dev tools recommended).
- Keyboard navigation verified for header controls, skip link, and cards (focus outlines visible).
- High-contrast mode review ensures minimum 4.5:1 ratios for text/background.
- Local Storage fallback guards ensure graceful behaviour when disabled.

### Pending manual tests

| Test | Status | Notes |
|------|--------|-------|
| Chrome latest (desktop/mobile) | Pending | Verify videos open externally and controls persist |
| Firefox | Pending | Check variable font loading |
| Safari | Pending | Confirm sticky header blur support |
| Edge | Pending | Validate Local Storage persistence |
| Screen reader (NVDA/VoiceOver) | Pending | Ensure landmarks and button labels announced |

## Deliverables

- `modern/index.html`: Landing page with language choice and modernization summary.
- `modern/en/`, `modern/pl/`: Full localized experiences for festival home, online showcase, and Azdaki profile.
- `modern/assets/styles.css`: Central CSS with themes, layouts, and component styles.
- `modern/assets/app.js`: JavaScript controlling accessibility toggles and persistence.
- `modern/report.md`: This report summarizing the modernization.

## Next Steps

1. Replace placeholder imagery with production assets using consistent alt text.
2. Confirm YouTube embeds include captions and accessible titles.
3. Integrate analytics if required via privacy-compliant wrapper.
4. Conduct cross-browser testing and capture WCAG 2.1 AA test report.

---
Prepared by: GPT-5 Codex modernization assistant.
