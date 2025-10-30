## ADDED Requirements

### Requirement: Bosk8 UI Shell and Layout
The application SHALL provide a Bosk8-branded shell using tokens and patterns defined in `style.md`.

#### Scenario: Base layout wrapper
- **WHEN** the app renders any screen
- **THEN** content SHALL be wrapped in `main.bosk8` using `--bg-elev1`, padding `--space-4` top and `--space-1` sides, and `padding-top: var(--space-4)` elevated to `10rem` per hero guidance
- **AND** inner `.container` SHALL use `max-width: min(1100px, 90vw)` and center content

#### Scenario: Surfaces and depth
- **WHEN** a card surface is needed
- **THEN** use `.card` with `--surface-card` background and box-shadow `0 0 0 var(--border-outer-w) var(--border-color), 0 1px 2px var(--shadow-tint)`
- **AND** borders SHALL use `--border-w`/`--border-color` with media-elevated widths

#### Scenario: Typography and labels
- **WHEN** rendering navigation, labels, or meta copy
- **THEN** use uppercase JetBrains Mono with `letter-spacing: 0.05em` and colors `--text-muted` by default

#### Scenario: Grid tiles
- **WHEN** rendering feature tiles or KPI sections
- **THEN** use `.grid-tiles` with 2 columns on mobile and 4 on ≥768px, `.tile` padding `1.5rem 1rem`, and optional `.border-r`/`.border-b`

#### Scenario: Interaction and focus
- **WHEN** elements receive keyboard focus
- **THEN** apply `:focus-visible { outline: 2px solid var(--border-color); outline-offset: 2px; }`


