import {
  contrast,
  fromHex,
  inGamut,
  shift,
  solveLightness,
  withAlpha,
  withLightness,
  type Oklch,
} from "./colour.ts";
import type { MappedTheme, SolvedTheme, Style, Theme } from "./schema.ts";

export const statuses = [
  "info",
  "success",
  "important",
  "warning",
  "danger",
] as const;

export type Status = (typeof statuses)[number];

/**
 * GitHub's Markdown alert colours in dark (note, tip, important, warning and
 * caution), which give each status its hue and chroma.
 */
const statusSeeds: Record<Status, string> = {
  info: "#5b9ee0",
  success: "#52ab69",
  important: "#aa89e2",
  warning: "#c49027",
  danger: "#e47c74",
};

/** Contrast targets, all measured on the raised surface. */
export const targets = {
  "text-strong": 11,
  "text-primary": 9,
  "text-secondary": 4.6,
  accent: 5,
  status: 4.8,
  "on-accent": 4.5,
} as const;

export const modes = ["light", "dark", "darker"] as const;

export type Mode = (typeof modes)[number];

export type Roles = Record<string, Oklch>;

export interface ResolvedTheme {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly optional: boolean;
  readonly family: string | undefined;
  /** Apps that use the theme, as examples. */
  readonly examples: readonly string[];
  readonly style: Style;
  readonly modes: Partial<Record<Mode, Roles>>;
}

/** The text or surface colour that reads best on a fill. */
const onFill = (fill: Oklch, candidates: readonly Oklch[]) =>
  candidates.reduce((best, candidate) =>
    contrast(candidate, fill) > contrast(best, fill) ? candidate : best,
  );

const accentRoles = (
  accent: Oklch,
  surfaces: { readonly default: Oklch; readonly raised: Oklch },
  dark: boolean,
  textStrong: Oklch,
  link: Style["link"]["colour"],
) => {
  const direction = dark ? "lighter" : "darker";

  const text =
    contrast(accent, surfaces.raised) >= targets.accent
      ? accent
      : solveLightness(accent, surfaces.raised, targets.accent, direction);

  const step = dark ? 0.05 : -0.05;

  return {
    accent: text,
    "fill-accent-resting": text,
    "fill-accent-hovered": inGamut(shift(text, step)),
    "fill-accent-pressed": inGamut(shift(text, -step / 2)),
    "fill-accent-quiet": withAlpha(text, 0.16),
    "border-accent": withAlpha(text, 0.5),
    "on-accent": onFill(text, [
      surfaces.default,
      { l: 1, c: 0, h: 0 },
      { l: 0.15, c: 0, h: 0 },
    ]),
    focus: text,
    link: link === "accent" ? text : textStrong,
  };
};

const statusRoles = (
  seeds: Record<Status, Oklch>,
  raised: Oklch,
  dark: boolean,
  solve: boolean,
): Roles =>
  Object.fromEntries(
    statuses.flatMap((status) => {
      const seed = seeds[status];

      const text =
        !solve || contrast(seed, raised) >= targets.status
          ? seed
          : solveLightness(
              seed,
              raised,
              targets.status,
              dark ? "lighter" : "darker",
            );

      return [
        [status, text],
        [`fill-${status}-quiet`, withAlpha(text, 0.14)],
        [`border-${status}`, withAlpha(text, 0.45)],
      ];
    }),
  );

const solvedMode = (theme: SolvedTheme, mode: "light" | "dark") => {
  const background = fromHex(theme.background);
  const dark = mode === "dark";
  const tint = { h: background.h, c: background.c };

  const surface = (l: number, chromaScale = 1) =>
    inGamut({ l, c: tint.c * chromaScale, h: tint.h });

  const base = dark ? background.l : 0.975;
  const chroma = dark ? 1 : 0.6;
  const away = dark ? 1 : -1;

  // Lower surfaces are recessed, so darker in both modes.
  const surfaces = {
    lower: surface(base - 0.025, chroma),
    low: surface(base - 0.012, chroma),
    default: surface(base, chroma),
    raised: surface(dark ? base + 0.03 : 0.995, dark ? 1 : 0.3),
    overlay: surface(dark ? base + 0.055 : 1, dark ? 1 : 0),
  };

  const text = { l: 0.5, c: Math.min(tint.c * 0.4, 0.02), h: tint.h };
  const direction = dark ? "lighter" : "darker";

  const textStrong = solveLightness(
    text,
    surfaces.raised,
    targets["text-strong"],
    direction,
  );

  // Black and white primaries: near-white fill in dark, near-black in light.
  const primary = inGamut({ ...text, l: dark ? 0.93 : 0.24 });
  const accent = fromHex(theme.accent);
  // An accent with no real colour, as Base's, is the primary itself.
  const neutralAccent = accent.c < 0.02;

  const seeds: Record<Status, Oklch> = {
    info: fromHex(statusSeeds.info),
    success: fromHex(statusSeeds.success),
    important: fromHex(statusSeeds.important),
    warning: fromHex(statusSeeds.warning),
    danger: fromHex(statusSeeds.danger),
  };

  return {
    "surface-lower": surfaces.lower,
    "surface-low": surfaces.low,
    "surface-default": surfaces.default,
    "surface-raised": surfaces.raised,
    "surface-overlay": surfaces.overlay,
    "border-quiet": surface(base + away * 0.07, chroma),
    "border-normal": surface(base + away * (dark ? 0.1 : 0.08), chroma),
    "border-loud": surface(base + away * (dark ? 0.17 : 0.2), chroma),
    "text-strong": textStrong,
    "text-primary": solveLightness(
      text,
      surfaces.raised,
      targets["text-primary"],
      direction,
    ),
    "text-secondary": solveLightness(
      text,
      surfaces.raised,
      targets["text-secondary"],
      direction,
    ),
    "text-disabled": solveLightness(text, surfaces.raised, 2.4, direction),
    "fill-neutral-resting": surface(base + away * 0.06, chroma),
    "fill-neutral-hovered": surface(base + away * 0.09, chroma),
    "fill-neutral-pressed": surface(base + away * 0.12, chroma),
    "fill-neutral-selected": surface(base + away * 0.11, chroma * 1.5),
    "fill-neutral-disabled": surface(base + away * 0.035, chroma),
    "fill-primary-resting": primary,
    "fill-primary-hovered": inGamut(shift(primary, -away * 0.06)),
    "fill-primary-pressed": inGamut(shift(primary, -away * 0.1)),
    "on-primary": dark ? surfaces.default : surfaces.raised,
    ...accentRoles(
      neutralAccent ? primary : accent,
      surfaces,
      dark,
      textStrong,
      theme.style.link.colour,
    ),
    ...statusRoles(seeds, surfaces.raised, dark, true),
  };
};

/** Darker: every surface 0.045 darker, hues kept, field outlines strengthened. */
const darker = (dark: Roles) => {
  const surfaces = Object.fromEntries(
    Object.entries(dark)
      .filter(
        ([role]) =>
          role.startsWith("surface-") ||
          role.startsWith("fill-neutral-") ||
          role === "on-primary",
      )
      .map(([role, colour]) => [
        role,
        inGamut(withLightness(colour, colour.l - 0.045)),
      ]),
  );

  return {
    ...dark,
    ...surfaces,
    "border-quiet": dark["border-normal"] ?? { l: 0, c: 0, h: 0 },
    "border-normal": dark["border-loud"] ?? { l: 0, c: 0, h: 0 },
  };
};

const mappedRoles = (theme: MappedTheme) => {
  const palette = {
    lower: fromHex(theme.palette.lower),
    background: fromHex(theme.palette.background),
    raised: fromHex(theme.palette.raised),
    border: fromHex(theme.palette.border),
    text: fromHex(theme.palette.text),
    muted: fromHex(theme.palette.muted),
    accent: fromHex(theme.palette.accent),
  };

  const dark = theme.mode === "dark";
  const away = dark ? 1 : -1;

  const surfaces = {
    default: palette.background,
    raised: palette.raised,
  };

  const seeds: Record<Status, Oklch> = {
    info: fromHex(theme.palette.info),
    success: fromHex(theme.palette.success),
    important: fromHex(theme.palette.important),
    warning: fromHex(theme.palette.warning),
    danger: fromHex(theme.palette.danger),
  };

  return {
    "surface-lower": palette.lower,
    "surface-low": inGamut({
      ...palette.background,
      l: (palette.lower.l + palette.background.l) / 2,
    }),
    "surface-default": palette.background,
    "surface-raised": palette.raised,
    "surface-overlay": inGamut(shift(palette.raised, away * 0.025)),
    "border-quiet": inGamut(shift(palette.border, -away * 0.03)),
    "border-normal": palette.border,
    "border-loud": inGamut(shift(palette.border, away * 0.08)),
    "text-strong": palette.text,
    "text-primary": palette.text,
    "text-secondary": palette.muted,
    "text-disabled": withAlpha(palette.muted, 0.6),
    "fill-neutral-resting": inGamut(shift(palette.raised, away * 0.03)),
    "fill-neutral-hovered": inGamut(shift(palette.raised, away * 0.06)),
    "fill-neutral-pressed": inGamut(shift(palette.raised, away * 0.09)),
    "fill-neutral-selected": inGamut(shift(palette.raised, away * 0.08)),
    "fill-neutral-disabled": inGamut(shift(palette.raised, away * 0.015)),
    "fill-primary-resting": palette.text,
    "fill-primary-hovered": inGamut(shift(palette.text, -away * 0.06)),
    "fill-primary-pressed": inGamut(shift(palette.text, -away * 0.1)),
    "on-primary": palette.background,
    ...accentRoles(palette.accent, surfaces, dark, palette.text, "accent"),
    accent: palette.accent,
    "fill-accent-resting": palette.accent,
    focus: palette.accent,
    ...statusRoles(seeds, palette.raised, dark, false),
  };
};

/** Base's style with accent links, for themes mapped from a palette. */
const mappedStyle = (base: Style): Style => ({
  font: base.font,
  mono: base.mono,
  radius: base.radius,
  border: base.border,
  weights: base.weights,
  density: base.density,
  capitals: base.capitals,
  link: { colour: "accent", underline: base.link.underline },
  surfaceAccent: base.surfaceAccent,
  rows: base.rows,
});

/** Resolve a theme into roles. Mapped themes take `baseStyle`, Base's style. */
export const resolve = (theme: Theme, baseStyle: Style): ResolvedTheme => {
  if (theme.kind === "mapped") {
    const roles = mappedRoles(theme);

    return {
      id: theme.id,
      name: theme.name,
      description: `${theme.name}, mapped onto the roles so it stays faithful to the ${theme.family} palette.`,
      optional: true,
      family: theme.family,
      examples: [],
      style: mappedStyle(baseStyle),
      modes:
        theme.mode === "dark"
          ? { dark: roles, darker: darker(roles) }
          : { light: roles },
    };
  }

  const dark = solvedMode(theme, "dark");

  return {
    id: theme.id,
    name: theme.name,
    description: theme.description,
    optional: false,
    family: undefined,
    examples: theme.examples ?? [],
    style: theme.style,
    modes: { light: solvedMode(theme, "light"), dark, darker: darker(dark) },
  };
};

export interface Check {
  readonly theme: string;
  readonly mode: Mode;
  readonly role: string;
  readonly ratio: number;
  readonly target: number;
  readonly passes: boolean;
}

const checkedRoles = [
  ["text-strong", targets["text-strong"]],
  ["text-primary", targets["text-primary"]],
  ["text-secondary", targets["text-secondary"]],
  ["accent", targets.accent],
  ...statuses.map((status) => [status, targets.status] as const),
] as const;

/** Every role with a contrast target, measured on the raised surface. */
export const check = (theme: ResolvedTheme): readonly Check[] =>
  modes.flatMap((mode) => {
    const roles = theme.modes[mode];

    if (roles === undefined) return [];

    const raised = roles["surface-raised"] ?? { l: 0, c: 0, h: 0 };

    const measure = (role: string, against: Oklch, target: number): Check => {
      const ratio = contrast(roles[role] ?? { l: 0, c: 0, h: 0 }, against);

      return {
        theme: theme.id,
        mode,
        role,
        ratio,
        target,
        passes: ratio >= target - 0.005,
      };
    };

    return [
      ...checkedRoles.map(([role, target]) => measure(role, raised, target)),
      measure(
        "on-accent",
        roles["fill-accent-resting"] ?? raised,
        targets["on-accent"],
      ),
    ];
  });
