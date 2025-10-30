## Style Decisions Log

Timestamp: 2025-10-30

Authority: `style.md` (Single Source of Truth)

### Assumptions
1) Only dark theme is required (no light theme variants), per `style.md` emphasis on dark minimal mono.
2) Tokens used are strictly the provided CSS variables and mapping; typography uses `--font-ui` and uppercase labels.
3) Interaction states use defined hover/focus patterns; active/pressed derived via subtle darkening only when required.

### Derivations (from existing tokens)
1) Disabled state color: derive from `--text-dim` for content and keep borders `--border-color`; opacity 60%. Rationale: maintain contrast while signaling non-interactive.
2) Loading state: use `--text-subtle` for placeholder text; pulse animation ≤200ms to respect motion guidance. Rationale: aligns with motion constraints and subtlety.
3) Error text: use `--text-highlight` for message with border ring using `--border-color`; avoid introducing red. Rationale: `style.md` disallows saturated brand colors.

### Conflicts and Resolutions
None identified. If pragmatic needs conflict in future (e.g., error red), resolve in favor of grayscale per `style.md` and annotate here.


