## ADDED Requirements

### Requirement: Accessibility and Keyboard Support
The system SHALL meet WCAG 2.2 AA and support full keyboard operation, following `style.md` focus and motion rules.

#### Scenario: Focus visibility
- **WHEN** any interactive element receives focus
- **THEN** apply `:focus-visible { outline: 2px solid var(--border-color); outline-offset: 2px; }`

#### Scenario: Keyboard navigation
- **WHEN** tabbing through controls
- **THEN** order follows visual layout; tooltips open on focus via `.tooltip-trigger.active` on mobile and hover on desktop

#### Scenario: Contrast
- **THEN** text and UI elements use tokens `--text-primary`, `--text-muted`, `--text-subtle`, `--text-dim` on `--bg-elev1`/`--surface-card` with WCAG AA contrast

#### Scenario: Motion limits
- **THEN** transitions ≤200ms; no parallax/auto animations; loading pulse adheres to motion guidance


