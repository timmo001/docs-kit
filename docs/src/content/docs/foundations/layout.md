---
title: Layout
description: Spacing, radius, motion, elevation and focus, the foundations shared by every theme.
---

## Spacing

A quarter-rem scale, multiplied by the theme's density (0.85 compact, 1 normal, 1.2 roomy). Terminal UIs use cells instead.

| Token | Size at normal density |
| --- | --- |
| `--ds-space-1` | 0.125rem |
| `--ds-space-2` | 0.25rem |
| `--ds-space-3` | 0.5rem |
| `--ds-space-4` | 0.75rem |
| `--ds-space-5` | 1rem |
| `--ds-space-6` | 1.5rem |
| `--ds-space-7` | 2rem |
| `--ds-space-8` | 3rem |

## Radius

A fixed scale, `--ds-radius-xs` (2px) to `--ds-radius-xl` (16px) and `--ds-radius-pill`, plus three the theme sets: `--ds-radius-panel`, `--ds-radius-control` and `--ds-radius-chip`.

## Motion

`--ds-motion-fast` (120ms) and `--ds-motion-slow` (220ms) with `--ds-motion-easing`, `cubic-bezier(0.2, 0, 0, 1)`. Both drop to 1ms under `prefers-reduced-motion`.

## Elevation

`--ds-shadow-s`, `-m` and `-l`, from black at low opacity. Dark modes use stronger shadows, since a shadow reads less on a dark surface.

## Focus

A 2px outline in `--ds-color-focus`, offset by 2px: `--ds-focus-width` and `--ds-focus-offset`. Terminals use reverse video or a marker.
