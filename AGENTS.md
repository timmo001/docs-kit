# docs-kit

Shared branding, layout and config for timmo001 documentation sites, published
as `@timmo001/docs-kit`. The READMEs document usage and development.

## Tooling

- Use mise-pinned tools and Bun. Keep `bun.lock` in sync with the package's
  `package.json`.
- Use `mise run format` and `mise run check` for validation. There is no build;
  the package ships source.
- Keep package code under `packages/docs-kit/`. Keep `package.json` and
  `jsr.json` versions and exports in step.
- Use lowercase filenames, with kebab-case for multiword names.
- Use the shared `@timmo001/oxlint-rules/configs/recommended` preset and its
  supported Oxlint peers.

## Package conventions

- Keep the root export free of docs-tool dependencies. Put tool-specific code
  under its own entry point, such as `src/blume/`.
- Use scoped CSS in components rather than Tailwind utilities, since consumers'
  Tailwind may not scan `node_modules`.
- Keep site content, sidebars, logos and reference generators in the sites.
- Verify component, theme or config changes by building a site against a packed
  tarball, not a linked install.
- Keep `skills/docs-kit/SKILL.md` in step with the public API.
