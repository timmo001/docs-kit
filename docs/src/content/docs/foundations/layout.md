---
title: Layout
description: Spacing, radius, motion, elevation and focus, the foundations shared by every theme.
---

## Spacing

A quarter-rem scale, multiplied by the theme's density (0.85 compact, 1 normal, 1.2 roomy). Terminal UIs use cells instead.

| Token | Size at normal density |
| --- | --- |
| `--gw-space-1` | 0.125rem |
| `--gw-space-2` | 0.25rem |
| `--gw-space-3` | 0.5rem |
| `--gw-space-4` | 0.75rem |
| `--gw-space-5` | 1rem |
| `--gw-space-6` | 1.5rem |
| `--gw-space-7` | 2rem |
| `--gw-space-8` | 3rem |

## Radius

A fixed scale, `--gw-radius-xs` (2px) to `--gw-radius-xl` (16px) and `--gw-radius-pill`, plus three the theme sets: `--gw-radius-panel`, `--gw-radius-control` and `--gw-radius-chip`.

## Motion

`--gw-motion-fast` (120ms) and `--gw-motion-slow` (220ms) with `--gw-motion-easing`, `cubic-bezier(0.2, 0, 0, 1)`. Both drop to 1ms under `prefers-reduced-motion`.

## Elevation

`--gw-shadow-s`, `-m` and `-l`, from black at low opacity. Dark modes use stronger shadows, since a shadow reads less on a dark surface.

## Focus

A 2px outline in `--gw-color-focus`, offset by 2px: `--gw-focus-width` and `--gw-focus-offset`. Terminals use reverse video or a marker.
