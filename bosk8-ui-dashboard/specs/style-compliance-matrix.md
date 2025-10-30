# Style Compliance Matrix

**Date:** 2025-01-27  
**Authority:** `style.md` (Single Source of Truth)

## Overview

This matrix documents exact `style.md` token usage for each screen and component. Any derived tokens must include derivation logic and be logged in the Style Decisions Log.

## Screen-Level Token Mapping

### Screen 1: Dashboard Home (`/dashboard`)

| Element | Token Used | Token Path in `style.md` | Notes |
|---------|-----------|-------------------------|-------|
| Main wrapper | `--bg-elev1` | `colors.bg.elev1` (#0A0A0A) | Background for `main.bosk8` |
| Container | `max-width: min(1100px, 90vw)` | `layout.containerMax` | Container width |
| Hero card | `--surface-card` | `colors.surface.card` (#09090B) | Card background |
| Hero card | `--border-outer-w` | `borders.outer` (1px → 2px ≥1024px) | Box-shadow border |
| Hero card | `--border-color` | `colors.border.neutral` (rgb(39 39 42)) | Box-shadow color |
| Hero card | `--shadow-tint` | `colors.shadow.tint` (#0000000d) | Box-shadow shadow |
| Hero card | Padding `4rem 2rem` | `spacing.2xl` (4rem) / `spacing.2` (2rem) | Hero padding |
| Hero tagline | `--text-muted` | `colors.text.muted` (#E8E8E8) | Tagline color |
| Hero tagline | `1rem` | `fontSize.lg` (1rem) | Tagline font size |
| Hero tagline | `letter-spacing: 0.05em` | Typography guidance (uppercase tracking) | Letter spacing |
| KPI grid card | `--surface-card` | `colors.surface.card` | Card background |
| KPI grid card | `--border-b` | `--border-w` + `--border-color` | Bottom border |
| KPI grid card | Grid `2 cols` (mobile) / `4 cols` (≥768px) | `layout.gridColsMobile` / `layout.gridColsDesktop` | Grid columns |
| KPI tile | Padding `1.5rem 1rem` | `spacing.lg` (1.5rem) / `spacing.1` (1rem) | Tile padding |
| KPI label | `.meta-sm` | `fontSize.sm` (0.75rem) | Label font size |
| KPI label | `--text-muted` | `colors.text.muted` | Label color |
| KPI label | `letter-spacing: 0.05em` | Typography guidance | Letter spacing |
| KPI value | `--text-primary` | `colors.text.primary` (#FFFFFF) | Value color |
| KPI value | `font-size: 1.75rem` | Derived from `--fs-base` | Value font size (derived) |
| Filter link | `.link` | Links & Actions pattern | Link style |
| Filter link | `--text-muted` | `colors.text.muted` | Default color |
| Filter link | `--text-primary` | `colors.text.primary` | Hover color |
| Chart card | `--surface-card` | `colors.surface.card` | Card background |
| Chart card | Padding `2rem` | `spacing.2` (2rem) | Card padding |
| Chart axes | `--text-dim` / `--text-subtle` | `colors.text.dim` / `colors.text.subtle` | Axes text color |
| Chart data | `--text-primary` | `colors.text.primary` | Data series color |
| Table card | `--surface-card` | `colors.surface.card` | Card background |
| Table header | `.meta-sm` | `fontSize.sm` (0.75rem) | Header font size |
| Table header | `--text-muted` | `colors.text.muted` | Header color |
| Table header | `--border-w` + `--border-color` | `borders.thin` (1px) + `colors.border.neutral` | Border bottom |
| Table cell | `--text-subtle` | `colors.text.subtle` (#A1A1AA) | Cell text color |
| Table row hover | `#18181b` | From `style.md` FAQ hover background | Row hover background (derived) |
| Table cell | Padding `0.75rem 1rem` | `spacing.0_75` (0.75rem) / `spacing.1` (1rem) | Cell padding |

**Derived Tokens**:
- KPI value font size: `1.75rem` (derived from `--fs-base`; logged in Style Decisions Log)
- Table row hover background: `#18181b` (from `style.md` FAQ hover pattern; logged)

---

### Screen 2: Warehouse Detail (`/warehouse/:id`)

| Element | Token Used | Token Path in `style.md` | Notes |
|---------|-----------|-------------------------|-------|
| Main wrapper | `--bg-elev1` | `colors.bg.elev1` | Background |
| Warehouse header card | `--surface-card` | `colors.surface.card` | Card background |
| Warehouse header card | `--border-b` | `--border-w` + `--border-color` | Bottom border |
| Warehouse header card | Padding `2rem` | `spacing.2` (2rem) | Card padding |
| Navigation link | `.link` | Links & Actions pattern | Link style |
| Warehouse metadata | `.meta-sm` | `fontSize.sm` (0.75rem) | Metadata font size |
| Warehouse metadata | `--text-muted` | `colors.text.muted` | Metadata color |
| KPI cards | Same as Dashboard | See Dashboard matrix | Same component |
| Chart card | Same as Dashboard | See Dashboard matrix | Same component |
| Orders table | Same as Dashboard table | See Dashboard table matrix | Same component |

**Derived Tokens**: None (reuses dashboard components)

---

### Screen 3: Data Quality (`/data-quality`)

| Element | Token Used | Token Path in `style.md` | Notes |
|---------|-----------|-------------------------|-------|
| Main wrapper | `--bg-elev1` | `colors.bg.elev1` | Background |
| Hero card | Same as Dashboard hero | See Dashboard hero matrix | Same component |
| Freshness table card | `--surface-card` | `colors.surface.card` | Card background |
| Freshness table | Same as Dashboard table | See Dashboard table matrix | Same component |
| Test results table card | `--surface-card` | `colors.surface.card` | Card background |
| Test results table | Same as Dashboard table | See Dashboard table matrix | Same component |
| Status indicator (OK) | `--accent-success` | `colors.accent.success` (#22C55E) | Success color |
| Status indicator (WARN/ERROR) | `--text-highlight` | `colors.text.highlight` (#F4F4F5) | Error color (derived) |
| Metadata card | `--surface-card` | `colors.surface.card` | Card background |

**Derived Tokens**:
- Error/WARN status color: `--text-highlight` (derived for error states; logged in Style Decisions Log)

---

### Screen 4: Filters Panel (Overlay/Modal)

| Element | Token Used | Token Path in `style.md` | Notes |
|---------|-----------|-------------------------|-------|
| Overlay backdrop | Semi-transparent black | Derived from `--bg-black` with opacity | Backdrop (derived) |
| Filter panel card | `--surface-card` | `colors.surface.card` | Card background |
| Filter panel card | `--border-outer-w` + `--border-color` | `borders.outer` + `colors.border.neutral` | Box-shadow border |
| Filter panel card | Padding `2rem` | `spacing.2` (2rem) | Card padding |
| Filter label | `.meta-sm` | `fontSize.sm` (0.75rem) | Label font size |
| Filter label | `--text-muted` | `colors.text.muted` | Label color |
| Input field | `--border-w` + `--border-color` | `borders.thin` + `colors.border.neutral` | Input border |
| Input field | `--text-primary` | `colors.text.primary` | Input text color |
| Input field | `--r-sm` | `radii.sm` (4px) | Input border radius |
| Input field | Padding `0.75rem` | `spacing.0_75` (0.75rem) | Input padding |
| Input field (error) | `--text-highlight` | `colors.text.highlight` | Error border color (derived) |
| Checkbox | `--border-w` + `--border-color` | `borders.thin` + `colors.border.neutral` | Checkbox border |
| Checkbox (checked) | `--accent-success` | `colors.accent.success` | Checked background |
| Checkbox label | `.meta-sm` | `fontSize.sm` (0.75rem) | Label font size |
| Checkbox label | `--text-muted` | `colors.text.muted` | Label color |
| Button (Apply/Reset) | `.link` | Links & Actions pattern | Button style |
| Button (disabled) | `--text-dim` | `colors.text.dim` (#71717A) | Disabled color |
| Button (disabled) | `opacity: 0.6` | Derived | Disabled opacity (derived) |

**Derived Tokens**:
- Overlay backdrop: Semi-transparent black (derived from `--bg-black`; logged)
- Error input border: `--text-highlight` (derived for error states; logged)
- Disabled opacity: `0.6` (derived; logged)

---

## Component-Level Token Mapping

### Component 1: Card

| Element | Token Used | Token Path in `style.md` | Notes |
|---------|-----------|-------------------------|-------|
| Background | `--surface-card` | `colors.surface.card` (#09090B) | Card background |
| Border (box-shadow) | `--border-outer-w` | `borders.outer` (1px → 2px ≥1024px) | Box-shadow border width |
| Border (box-shadow) | `--border-color` | `colors.border.neutral` | Box-shadow border color |
| Shadow | `--shadow-tint` | `colors.shadow.tint` (#0000000d) | Box-shadow shadow |
| Border radius | `--r-sm` or `--r-md` | `radii.sm` (4px) / `radii.md` (6px) | Border radius (as needed) |

**Derived Tokens**: None (all tokens from `style.md`)

---

### Component 2: KPIStat

| Element | Token Used | Token Path in `style.md` | Notes |
|---------|-----------|-------------------------|-------|
| Label | `.meta-sm` | `fontSize.sm` (0.75rem) | Label font size |
| Label | `--text-muted` | `colors.text.muted` | Label color |
| Label | `letter-spacing: 0.05em` | Typography guidance | Letter spacing |
| Value | `--text-primary` | `colors.text.primary` | Value color |
| Value | `font-size: 1.75rem` | Derived from `--fs-base` | Value font size (derived) |
| Value (loading) | `--text-subtle` | `colors.text.subtle` | Loading placeholder color |
| Value (error) | `--text-highlight` | `colors.text.highlight` | Error color (derived) |
| Value (error) | `--border-w` + `--border-color` | `borders.thin` + `colors.border.neutral` | Error border |
| Value (error) | `--r-sm` | `radii.sm` (4px) | Error border radius |

**Derived Tokens**:
- Value font size: `1.75rem` (derived from `--fs-base`; logged)
- Error color: `--text-highlight` (derived for error states; logged)

---

### Component 3: Link / Action Button

| Element | Token Used | Token Path in `style.md` | Notes |
|---------|-----------|-------------------------|-------|
| Default color | `--text-muted` | `colors.text.muted` | Default color |
| Hover color | `--text-primary` | `colors.text.primary` | Hover color |
| Focus outline | `--border-color` | `colors.border.neutral` | Focus outline color |
| Focus outline | `2px` | From `style.md` focus pattern | Focus outline width |
| Disabled color | `--text-dim` | `colors.text.dim` | Disabled color |
| Disabled opacity | `0.6` | Derived | Disabled opacity (derived) |

**Derived Tokens**:
- Disabled opacity: `0.6` (derived; logged)

---

### Component 4: DataTable

| Element | Token Used | Token Path in `style.md` | Notes |
|---------|-----------|-------------------------|-------|
| Header | `.meta-sm` | `fontSize.sm` (0.75rem) | Header font size |
| Header | `--text-muted` | `colors.text.muted` | Header color |
| Header border | `--border-w` + `--border-color` | `borders.thin` + `colors.border.neutral` | Header bottom border |
| Cell | `--text-subtle` | `colors.text.subtle` | Cell text color |
| Cell border | `--border-w` + `--border-color` | `borders.thin` + `colors.border.neutral` | Cell bottom border |
| Row hover | `#18181b` | From `style.md` FAQ hover pattern | Row hover background (derived) |
| Row focus | `--border-color` | `colors.border.neutral` | Focus outline color |
| Row focus | `2px` | From `style.md` focus pattern | Focus outline width |

**Derived Tokens**:
- Row hover background: `#18181b` (from `style.md` FAQ hover pattern; logged)

---

### Component 5: Tooltip

| Element | Token Used | Token Path in `style.md` | Notes |
|---------|-----------|-------------------------|-------|
| Background | `--surface-card` | `colors.surface.card` | Tooltip background |
| Border | `--border-w` + `--border-color` | `borders.thin` + `colors.border.neutral` | Tooltip border |
| Padding | `0.5rem` | `spacing.xs` (0.5rem) | Tooltip padding |
| Font size | `0.625rem` | `fontSize.xs` (0.625rem) | Tooltip font size |
| Text color | `--text-subtle` | `colors.text.subtle` | Tooltip text color |
| Arrow | `--border-color` | `colors.border.neutral` | Arrow border color |

**Derived Tokens**: None (all tokens from `style.md`)

---

### Component 6: Input Field (Derived)

| Element | Token Used | Token Path in `style.md` | Notes |
|---------|-----------|-------------------------|-------|
| Border | `--border-w` + `--border-color` | `borders.thin` + `colors.border.neutral` | Input border |
| Text color | `--text-primary` | `colors.text.primary` | Input text color |
| Border radius | `--r-sm` | `radii.sm` (4px) | Input border radius |
| Padding | `0.75rem` | `spacing.0_75` (0.75rem) | Input padding |
| Focus outline | `--border-color` | `colors.border.neutral` | Focus outline color |
| Focus outline | `2px` | From `style.md` focus pattern | Focus outline width |
| Error border | `--text-highlight` | `colors.text.highlight` | Error border color (derived) |
| Disabled color | `--text-dim` | `colors.text.dim` | Disabled color |
| Disabled opacity | `0.6` | Derived | Disabled opacity (derived) |

**Derived Tokens**:
- Error border color: `--text-highlight` (derived for error states; logged)
- Disabled opacity: `0.6` (derived; logged)

---

### Component 7: Checkbox (Derived)

| Element | Token Used | Token Path in `style.md` | Notes |
|---------|-----------|-------------------------|-------|
| Border | `--border-w` + `--border-color` | `borders.thin` + `colors.border.neutral` | Checkbox border |
| Border radius | `--r-sm` | `radii.sm` (4px) | Checkbox border radius |
| Checked background | `--accent-success` | `colors.accent.success` | Checked background |
| Label | `.meta-sm` | `fontSize.sm` (0.75rem) | Label font size |
| Label | `--text-muted` | `colors.text.muted` | Label color |
| Label hover | `--text-primary` | `colors.text.primary` | Label hover color |
| Focus outline | `--border-color` | `colors.border.neutral` | Focus outline color |

**Derived Tokens**: None (all tokens from `style.md`; checked state uses `--accent-success`)

---

## Universal States Token Mapping

### Loading State

| Element | Token Used | Token Path in `style.md` | Notes |
|---------|-----------|-------------------------|-------|
| Placeholder text | `--text-subtle` | `colors.text.subtle` | Loading placeholder color |
| Pulse animation | `≤200ms` | Motion guidance | Animation duration (per `style.md`) |

**Derived Tokens**: None (animation duration per `style.md`)

---

### Error State

| Element | Token Used | Token Path in `style.md` | Notes |
|---------|-----------|-------------------------|-------|
| Error text | `--text-highlight` | `colors.text.highlight` | Error text color (derived) |
| Error border | `--border-color` | `colors.border.neutral` | Error border color |
| Error border radius | `--r-sm` | `radii.sm` (4px) | Error border radius |

**Derived Tokens**:
- Error text color: `--text-highlight` (derived for error states; logged)

---

### Focus State

| Element | Token Used | Token Path in `style.md` | Notes |
|---------|-----------|-------------------------|-------|
| Focus outline | `--border-color` | `colors.border.neutral` | Focus outline color |
| Focus outline | `2px` | From `style.md` focus pattern | Focus outline width |
| Focus outline offset | `2px` | From `style.md` focus pattern | Focus outline offset |

**Derived Tokens**: None (all from `style.md` focus pattern)

---

## Summary of Derived Tokens

All derived tokens are documented in the Style Decisions Log. Summary:

1. **KPI value font size**: `1.75rem` (derived from `--fs-base`)
2. **Table row hover background**: `#18181b` (from `style.md` FAQ hover pattern)
3. **Error/WARN status color**: `--text-highlight` (derived for error states)
4. **Error input border**: `--text-highlight` (derived for error states)
5. **Disabled opacity**: `0.6` (derived)
6. **Overlay backdrop**: Semi-transparent black (derived from `--bg-black`)

All other tokens are directly from `style.md` with no derivation required.

---

**Next**: See Style Decisions Log for derivation logic and assumptions.

