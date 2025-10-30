## ADDED Requirements

### Requirement: Interactive Component Library
The system SHALL provide reusable components with variants and states, strictly mapped to `style.md` tokens.

#### Scenario: Card
- **THEN** base `.card` uses `--surface-card`, ring via `--border-outer-w`/`--border-color`, shadow `--shadow-tint`, radii `--r-sm|--r-md`.

#### Scenario: KPI Stat
- **THEN** label uses `.meta-sm` (uppercase, tracking .05em, `--text-muted`) and value uses `--text-primary` with responsive font-size derived from `--fs-base`.
- **AND** states: default/hover (no elevation change), focus-visible outline as defined.

#### Scenario: Link and Action
- **THEN** `.link` default `--text-muted` with hover to `--text-primary` and underline; `.copy-btn` uses icon color `--text-dim` → hover `#d4d4d8`.

#### Scenario: Tooltip
- **THEN** `.tooltip-trigger` and `.tooltip` styles exactly per `style.md`, with mobile activation via `.active` and desktop hover.

#### Scenario: FAQ / Accordion
- **THEN** `.faq-item`, `.faq-q`, `.faq-a` match `style.md`; hover background `#18181b`; text `--text-muted`/`--text-subtle`.

#### Scenario: Table (derived from tokens)
- **THEN** rows use border `--border-w`/`--border-color`, header uses `.meta-sm`, cell text `--text-subtle`, hover background `#18181b`.

### Requirement: Props and States (example)
Components MUST define explicit props, states, and accessibility labels for predictable behavior and a11y.

#### Scenario: KPI Stat props
- **THEN** props: `label:string`, `value:number|string`, `hint?:string`, `loading?:boolean`, `error?:string`, `ariaLabel?:string`.
- **AND** loading shows placeholder text in `--text-subtle` with ≤200ms pulse; error uses `--text-highlight` text and ring `--border-color`.


