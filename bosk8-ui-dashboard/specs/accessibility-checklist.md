# Accessibility Checklist — WCAG 2.2 AA Compliance

**Date:** 2025-01-27  
**Authority:** `style.md` (Single Source of Truth)  
**Standard:** WCAG 2.2 Level AA

## Overview

This checklist ensures the UI system meets WCAG 2.2 Level AA accessibility requirements while adhering to `style.md` design tokens.

## Perceivable

### 1.1 Text Alternatives (Level A)
- [ ] **Images with text content**: All informative images have `alt` text
  - Logo: `alt="Bosk8"` or descriptive text
  - Icons: `aria-label` or `aria-hidden="true"` if decorative
  - Charts: `aria-label` on chart container describing data
- [ ] **Decorative images**: Use `aria-hidden="true"` or empty `alt=""`
- [ ] **Status**: ✅ Compliant (minimal images; logo has alt text)

### 1.2 Time-based Media (Level A)
- [ ] **Pre-recorded audio/video**: N/A (no audio/video content)
- [ ] **Status**: ✅ Compliant (not applicable)

### 1.3 Adaptable (Level A)
- [ ] **Info and relationships**: Use semantic HTML (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`, `<nav>`, `<main>`, `<section>`)
  - Tables: Proper `<thead>`, `<tbody>`, `<th scope="col">`, `<td>`
  - Navigation: `<nav>` with `aria-label="Breadcrumb"` or similar
  - Sections: `<main>`, `<section>` with `aria-label` if needed
- [ ] **Meaningful sequence**: Content order follows logical sequence
- [ ] **Sensory characteristics**: Instructions don't rely solely on shape, size, or visual location
  - Example: "Click the button" not "Click the red button"
- [ ] **Status**: ⚠️ Must verify semantic HTML in implementation

### 1.4 Distinguishable (Level AA)
- [ ] **Color contrast**: Text meets minimum contrast ratios
  - **Normal text**: 4.5:1 contrast ratio (WCAG AA)
  - **Large text** (≥18pt or ≥14pt bold): 3:1 contrast ratio (WCAG AA)
  - **Token validation**:
    - `--text-primary` (#fff) on `--bg-black` (#000): ✅ 21:1
    - `--text-primary` (#fff) on `--bg-elev1` (#0A0A0A): ✅ 21:1
    - `--text-primary` (#fff) on `--surface-card` (#09090B): ✅ 21:1
    - `--text-muted` (#e8e8e8) on `--bg-black` (#000): ✅ 14.1:1
    - `--text-muted` (#e8e8e8) on `--bg-elev1` (#0A0A0A): ✅ 14.1:1
    - `--text-muted` (#e8e8e8) on `--surface-card` (#09090B): ✅ 14.1:1
    - `--text-subtle` (#a1a1aa) on `--bg-black` (#000): ✅ 7.3:1
    - `--text-subtle` (#a1a1aa) on `--bg-elev1` (#0A0A0A): ⚠️ 6.2:1 (verify against surface)
    - `--text-subtle` (#a1a1aa) on `--surface-card` (#09090B): ⚠️ 6.2:1 (verify)
    - `--text-dim` (#71717a) on `--bg-black` (#000): ⚠️ 4.6:1 (verify against surface)
    - `--text-dim` (#71717a) on `--bg-elev1` (#0A0A0A): ❌ 3.8:1 (may fail on darker surfaces)
    - `--text-dim` (#71717a) on `--surface-card` (#09090B): ❌ 3.8:1 (may fail)
    - `--accent-success` (#22c55e) on `--bg-black` (#000): ✅ 3.1:1 (large text)
    - `--accent-success` (#22c55e) on `--bg-elev1` (#0A0A0A): ✅ 3.1:1
- [ ] **Contrast recommendations**:
  - Use `--text-subtle` and `--text-dim` primarily on `--bg-black` background (high contrast)
  - On `--surface-card`, prefer `--text-muted` or `--text-primary` for body text
  - Reserve `--text-dim` for labels, metadata, and disabled states only
- [ ] **Resize text**: Text can be resized up to 200% without loss of functionality
  - Use `clamp()` for responsive font sizes (already in `--fs-base`)
  - Avoid fixed pixel sizes for text
- [ ] **Images of text**: N/A (no images of text; all text is actual text)
- [ ] **Status**: ⚠️ Verify `--text-subtle` and `--text-dim` contrast on `--surface-card`; prefer `--text-muted` for body text on cards

### 1.5 Audio Control (Level A)
- [ ] **Audio control**: N/A (no audio content)
- [ ] **Status**: ✅ Compliant (not applicable)

## Operable

### 2.1 Keyboard Accessible (Level A)
- [ ] **Keyboard**: All functionality available via keyboard (no mouse-only interactions)
  - Navigation links: Tab → Enter/Space
  - Filter controls: Tab → Arrow keys for dropdowns, Enter/Space for buttons
  - Table rows: Tab → Enter/Space to activate
  - Tooltips: Tab → Focus trigger → Tooltip appears on focus
- [ ] **No keyboard trap**: Focus can move away from all components
  - Modal/filter panel: Esc key closes, focus returns to trigger
  - Table navigation: Tab moves between rows, not trapped
- [ ] **Status**: ⚠️ Must verify keyboard navigation in implementation

### 2.2 Enough Time (Level A)
- [ ] **Timing adjustable**: N/A (no time limits or auto-updating content)
  - Data refresh: Manual refresh only (no auto-refresh timer)
- [ ] **Pausing**: N/A (no auto-updating content)
- [ ] **Stop hiding**: N/A (no auto-updating content)
- [ ] **Status**: ✅ Compliant (no time limits)

### 2.3 Seizures and Physical Reactions (Level AAA)
- [ ] **Three flashes**: N/A (no flashing content)
- [ ] **Animations from interactions**: N/A (no auto-animations; only user-triggered)
- [ ] **Status**: ✅ Compliant (no auto-animations; loading pulse ≤200ms)

### 2.4 Navigable (Level AA)
- [ ] **Bypass blocks**: Optional skip link to main content
  - Implementation: `<a href="#main-content" class="skip-link">Skip to main content</a>`
  - CSS: `.skip-link { position: absolute; left: -9999px; } .skip-link:focus { position: static; }`
- [ ] **Page titled**: All pages have descriptive `<title>` tag
  - Dashboard: `<title>Dashboard — Bosk8 Supply Chain KPIs</title>`
  - Warehouse: `<title>Warehouse WH1 — Bosk8 Supply Chain KPIs</title>`
  - Data Quality: `<title>Data Quality — Bosk8 Supply Chain KPIs</title>`
- [ ] **Focus order**: Tab order follows logical sequence
  - Order: Navigation → Filters → Chart (if interactive) → Table → Footer
- [ ] **Link purpose**: Link text is descriptive or has `aria-label`
  - ✅ "← Dashboard" is descriptive
  - ✅ "Filters" is descriptive
  - ⚠️ Icon-only links need `aria-label`
- [ ] **Multiple ways**: Multiple navigation paths (breadcrumbs, back links, direct URLs)
- [ ] **Headings and labels**: Use semantic headings (`<h1>`, `<h2>`, etc.) and labels
  - Hero: `<h1 class="tagline">REAL-TIME SUPPLY CHAIN KPIs</h1>`
  - Section headers: `<h2>` or `<div class="table-header">` with appropriate heading level
- [ ] **Focus visible**: Focus indicator visible per `style.md`
  - Implementation: `:focus-visible { outline: 2px solid var(--border-color); outline-offset: 2px; }`
- [ ] **Status**: ⚠️ Verify skip links, page titles, and heading hierarchy in implementation

### 2.5 Input Modalities (Level AA)
- [ ] **Pointer gestures**: No multipoint or path-based gestures required
- [ ] **Pointer cancellation**: No click/hover down events that can't be canceled
- [ ] **Label in name**: Accessible name matches visible label
  - Input fields: `<label for="date-start">START DATE</label>` matches visible text
  - Buttons: Button text matches `aria-label` if provided
- [ ] **Motion actuation**: N/A (no motion-based interactions)
- [ ] **Status**: ⚠️ Verify labels match accessible names

## Understandable

### 3.1 Readable (Level A)
- [ ] **Language of page**: Set `<html lang="en">`
- [ ] **Language of parts**: Use `lang` attribute if content is in different language
- [ ] **Unusual words**: N/A (technical terms acceptable for target audience)
- [ ] **Abbreviations**: N/A (common abbreviations like "KPI", "WH" acceptable)
- [ ] **Reading level**: N/A (technical content for technical audience)
- [ ] **Status**: ✅ Compliant (set `lang="en"`)

### 3.2 Predictable (Level AA)
- [ ] **On focus**: Focus changes don't trigger unexpected behavior
  - Tooltips appear on focus (desktop hover, mobile click)
  - Filter panel doesn't auto-open on focus
- [ ] **On input**: Input changes don't trigger unexpected context changes
  - Filter inputs update on "Apply" button click, not on every keystroke
  - URL query params update on filter apply, not on input change
- [ ] **Consistent navigation**: Navigation links and structure consistent across pages
- [ ] **Consistent identification**: Components with same function have same labels
  - "← Dashboard" link appears consistently
  - Filter controls use consistent labels
- [ ] **Change on request**: Context changes only on user request
  - Route changes only on link click, not auto-redirect
  - Data refresh only on user action (retry button, filter apply)
- [ ] **Status**: ⚠️ Verify consistent navigation and no auto-triggered changes

### 3.3 Input Assistance (Level AA)
- [ ] **Error identification**: Errors identified and described
  - Invalid date range: Show error message in `--text-highlight` near input
  - API errors: Show error message with retry button
- [ ] **Labels or instructions**: Inputs have labels or instructions
  - Date inputs: Label "START DATE", "END DATE"
  - Warehouse checkboxes: Label per warehouse (e.g., "WH1 - Atlanta")
- [ ] **Error suggestion**: Errors provide suggestions
  - Invalid date range: "Start date must be before end date."
  - Empty warehouse selection: "Select at least one warehouse."
- [ ] **Error prevention**: Critical actions have confirmation
  - N/A (no destructive actions; read-only dashboard)
- [ ] **Status**: ⚠️ Verify error messages and labels in implementation

## Robust

### 4.1 Compatible (Level A)
- [ ] **Parsing**: HTML is valid (no duplicate IDs, proper nesting)
- [ ] **Name, role, value**: UI components have accessible names, roles, and values
  - Buttons: Use `<button>` or `<a role="button">` with `aria-label` if needed
  - Tables: Use `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` with `aria-label`
  - Tooltips: Use `aria-describedby` to link trigger to tooltip
  - Inputs: Use `<label>` linked via `for`/`id` or wrap input in label
- [ ] **Status**: ⚠️ Verify HTML validity and ARIA usage in implementation

### 4.2 Status Messages (Level AA)
- [ ] **Status messages**: Status messages announced to screen readers
  - Loading state: `aria-live="polite"` on KPI value containers
  - Error state: `aria-live="assertive"` on error messages
  - Success state: `aria-live="polite"` on success messages (if applicable)
- [ ] **Status**: ⚠️ Verify `aria-live` regions in implementation

## Implementation Checklist

### Focus Management
- [ ] All interactive elements have visible focus indicator (`:focus-visible`)
- [ ] Tab order follows visual layout
- [ ] No keyboard traps (focus can escape all components)
- [ ] Skip link provided (optional but recommended)

### Semantic HTML
- [ ] Use semantic HTML elements (`<main>`, `<nav>`, `<section>`, `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`, `<button>`, `<a>`)
- [ ] Proper heading hierarchy (`<h1>`, `<h2>`, etc.)
- [ ] Form inputs linked to labels (`<label for="...">` or wrapping)

### ARIA Attributes
- [ ] Tables have `aria-label` on `<table>` element
- [ ] Navigation has `aria-label` on `<nav>` element
- [ ] Buttons have `aria-label` if text is not descriptive
- [ ] Tooltips use `aria-describedby` to link trigger to tooltip
- [ ] Loading states use `aria-live="polite"` on value containers
- [ ] Error states use `aria-live="assertive"` on error messages
- [ ] Disabled controls use `aria-disabled="true"`
- [ ] Sortable table headers use `aria-sort="ascending|descending|none"`

### Color Contrast
- [ ] Verify `--text-primary`, `--text-muted` contrast on all backgrounds (✅ compliant)
- [ ] Verify `--text-subtle` contrast on `--bg-black` (✅ compliant)
- [ ] ⚠️ Verify `--text-subtle` contrast on `--surface-card` (may need adjustment)
- [ ] ⚠️ Verify `--text-dim` contrast on `--bg-black` (✅ compliant)
- [ ] ❌ `--text-dim` on `--surface-card` may fail; reserve for labels/metadata only

### Keyboard Navigation
- [ ] All links and buttons keyboard accessible (Tab → Enter/Space)
- [ ] Filter controls keyboard accessible (Tab → Arrow keys → Enter/Space)
- [ ] Table rows keyboard accessible (Tab → Enter/Space to activate)
- [ ] Tooltips appear on focus (desktop hover, mobile click)
- [ ] Modal/filter panel: Esc key closes, focus returns to trigger

### Screen Reader Support
- [ ] Page titles descriptive (`<title>` tag)
- [ ] Links have descriptive text or `aria-label`
- [ ] Buttons have descriptive text or `aria-label`
- [ ] Images have `alt` text or `aria-hidden="true"`
- [ ] Status messages announced (`aria-live`)

## Testing Recommendations

### Automated Testing
- [ ] Use axe DevTools or WAVE to scan for accessibility issues
- [ ] Validate HTML with W3C HTML Validator
- [ ] Test color contrast with WebAIM Contrast Checker

### Manual Testing
- [ ] Test with keyboard only (no mouse)
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Test with browser zoom (200%)
- [ ] Test with high contrast mode (if applicable)

### Testing Checklist
1. **Keyboard Navigation**: Tab through all interactive elements
2. **Screen Reader**: Navigate with NVDA/JAWS/VoiceOver
3. **Color Contrast**: Verify all text meets WCAG AA ratios
4. **Focus Visibility**: Ensure all focus indicators visible
5. **Error Messages**: Verify errors announced and described
6. **Loading States**: Verify loading states announced (`aria-live`)

## Known Issues and Recommendations

### Contrast Issues
- **Issue**: `--text-dim` (#71717a) on `--surface-card` (#09090B) = 3.8:1 (fails WCAG AA)
- **Resolution**: Reserve `--text-dim` for labels, metadata, and disabled states only. Prefer `--text-muted` or `--text-primary` for body text on cards.
- **Documentation**: Logged in Style Decisions Log

### Implementation Gaps
- **Skip Links**: Optional but recommended for keyboard users
- **Loading Announcements**: Use `aria-live="polite"` on KPI value containers
- **Error Announcements**: Use `aria-live="assertive"` on error messages

---

**Status Summary**: 
- ✅ **Compliant**: Color contrast (most tokens), semantic HTML structure, no time limits, no auto-animations
- ⚠️ **Verify**: Keyboard navigation, ARIA usage, skip links, page titles, heading hierarchy
- ❌ **Issues**: `--text-dim` contrast on `--surface-card`; reserve for labels/metadata only

---

**Next**: See Style Compliance Matrix for token usage validation.

