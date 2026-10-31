# Groundwork

One design and architecture system for every app, site, CLI, terminal UI,
Omarchy panel and agent. Today it holds `@timmo001/docs-kit`, the shared docs
site package. The plan is tracked in #32, with the working document attached as
an issue artifact; check it before adding a new part. The READMEs document
usage and development.

## Repository

- It's public. Nothing personal goes in: no home paths, machine or host names,
  private repo details or private config.
- Use mise-pinned tools and Bun. Keep `bun.lock` in sync with the workspace's
  `package.json` files, and pin dependencies to exact versions.
- Use `mise run format` and `mise run check` for validation.
- Put each package under `packages/<name>/`.
- Use lowercase filenames, with kebab-case for multiword names.
- Use the shared `@timmo001/oxlint-rules/configs/recommended` preset and its
  supported Oxlint peers.
- Track work in issues with sub-issues and blocked-by relationships set. Plans,
  research and decisions go on the issue as artifacts.

## docs-kit

The package lives in `packages/docs-kit/` and is the only one published.

- There is no build; the package ships source.
- Keep `package.json` and `jsr.json` versions and exports in step.
- Keep the root export free of docs-tool dependencies. Put tool-specific code
  under its own entry point, such as `src/blume/`.
- Use scoped CSS in components rather than Tailwind utilities, since consumers'
  Tailwind may not scan `node_modules`.
- Keep site content, sidebars, logos and reference generators in the sites.
- Verify component, theme or config changes by building a site against a packed
  tarball, not a linked install.
- Keep `skills/docs-kit/SKILL.md` in step with the public API.
