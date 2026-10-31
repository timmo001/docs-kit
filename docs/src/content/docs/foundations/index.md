---
title: Foundations
description: The three layers of tokens, from colour scales to purpose roles to each target's output.
---

Tokens come in three layers, each generated from the one before:

1. **Inputs.** A theme's background and accent, or a palette for an optional theme, plus its style.
2. **Purpose roles.** What a colour is for, named in Home Assistant's pattern so moving onto Home Assistant's own tokens later is a rename: `--ds-color-text-primary`, `--ds-color-surface-low`, `--ds-color-border-quiet`, `--ds-color-fill-accent-resting`.
3. **Target outputs.** CSS variables, JSON, TypeScript, QML, OpenTUI colours and ANSI mappings.

The prefix is `--ds-*`, not the repository's name, so a rename doesn't rename every token.

- [Colour](/foundations/colour): surfaces, text, fills, accent and status roles, and the contrast targets.
- [Type](/foundations/type): fonts and the type scale.
- [Layout](/foundations/layout): spacing, radius, motion, elevation and focus.
