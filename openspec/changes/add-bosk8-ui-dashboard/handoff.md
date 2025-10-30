## Developer Handoff

### Design Tokens (CSS variables)
Use tokens from `style.md` under `:root`. Example mapping:

```css
:root {
  --font-ui: JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, DejaVu Sans Mono, Courier New, monospace;
  --fs-base: clamp(16px, calc(15.2px + 0.25vw), 20px);
  --bg-black: #000; --bg-elev1: #0A0A0A; --surface-card: #09090B;
  --text-primary: #fff; --text-muted: #e8e8e8; --text-subtle: #a1a1aa; --text-dim: #71717a; --text-highlight: #f4f4f5;
  --accent-success: #22c55e;
  --border-color: rgb(39 39 42); --border-w: 1px; --border-outer-w: 1px;
  --shadow-tint: #0000000d;
  --r-sm: 4px; --r-md: 6px;
  --space-0_5: 0.5rem; --space-0_75: 0.75rem; --space-1: 1rem; --space-1_5: 1.5rem; --space-2: 2rem; --space-4: 4rem;
}
@media (min-width: 1024px) { :root { --border-w: 1.5px; --border-outer-w: 2px; } }
```

### Layout Skeleton (HTML)
```html
<main class="bosk8">
  <div class="container">
    <section class="card border-b" style="padding:4rem 2rem; display:flex; flex-direction:column; align-items:center;">
      <h1 class="tagline">REAL-TIME SUPPLY CHAIN KPIs</h1>
    </section>
    <section class="card grid-tiles border-b">
      <div class="tile border-r"><span class="meta-sm">AVG FULFILLMENT HRS</span><div class="kpi">--</div></div>
      <div class="tile"><span class="meta-sm">ON-TIME RATE</span><div class="kpi">--</div></div>
      <div class="tile border-r"><span class="meta-sm">UNITS</span><div class="kpi">--</div></div>
      <div class="tile"><button class="link">Filters</button></div>
    </section>
  </div>
</main>
```

### Focus and Tooltip
```css
:focus-visible { outline: 2px solid var(--border-color); outline-offset: 2px; }
.tooltip-trigger { position: relative; background: transparent; border: none; padding: 0; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
.tooltip { position: absolute; left: 50%; bottom: calc(100% + .5rem); transform: translate(-50%); background-color: var(--surface-card); border: var(--border-w) solid var(--border-color); padding: .5rem; font-size: .625rem; font-family: var(--font-ui); color: var(--text-subtle); max-width: 280px; width: max-content; line-height: 1.5; opacity: 0; visibility: hidden; transition: opacity .15s, visibility .15s; pointer-events: none; z-index: 10; }
@media (min-width: 768px) { .tooltip-trigger:hover .tooltip { opacity: 1; visibility: visible; } }
@media (max-width: 767px) { .tooltip-trigger.active .tooltip { opacity: 1; visibility: visible; } }
```

### Acceptance Checklist
- [ ] Uses only tokens from `style.md`; any derivations recorded in Style Decisions Log
- [ ] Focus visible per `style.md`; keyboard traversal covers all controls
- [ ] KPI cards, table, and tooltips match tokens for colors, borders, spacing, shadows, radii
- [ ] Motion ≤200ms; no parallax/auto animations
- [ ] Empty/error/loading states use `--text-subtle` and ring `--border-color`


