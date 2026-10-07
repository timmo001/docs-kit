import type { BlumeConfig } from "blume";
import { cloudflare } from "blume/deploy";

/** Options for {@link docsConfig}: a Blume config plus the shared site details. */
export interface DocsConfigOptions extends Omit<
  BlumeConfig,
  "github" | "title"
> {
  /** Site title, also used for the header logo text and alt text. */
  title: string;
  /** Host name the site deploys to, such as `docs.example.dev`. */
  site: string;
  /** Repository the docs live in. `branch` defaults to `main` and `dir` to `docs`. */
  github: NonNullable<BlumeConfig["github"]>;
}

/**
 * Build a Blume config with the shared defaults: light and dark logos from
 * `public/`, Cloudflare deployment, agent surfaces on, Ask AI and feedback off,
 * and generated share cards. Any option given here wins over the default it
 * replaces; `navigation` and `seo` merge one level deep.
 */
export const docsConfig = ({
  site,
  github,
  navigation,
  seo,
  ...config
}: DocsConfigOptions): BlumeConfig => ({
  logo: {
    image: {
      alt: config.title,
      dark: "/logo-dark.svg",
      light: "/logo-light.svg",
    },
    text: config.title,
  },
  content: {
    root: "src/content/docs",
  },
  markdown: {
    externalLinks: true,
  },
  ai: {
    assistant: {
      enabled: false,
    },
  },
  agents: {
    agentReadability: true,
    contentSignals: {
      aiInput: true,
      aiTrain: false,
      search: true,
    },
    llmsTxt: true,
    mcp: {
      enabled: true,
      route: "/mcp",
    },
    webmcp: true,
  },
  deployment: cloudflare({
    site: `https://${site}`,
  }),
  feedback: false,
  lastModified: "git",
  ...config,
  github: {
    branch: "main",
    dir: "docs",
    ...github,
  },
  navigation: {
    repo: true,
    ...navigation,
  },
  seo: {
    ...seo,
    og: {
      enabled: true,
      logo: "src/assets/logo.svg",
      site,
      ...seo?.og,
    },
    organization: {
      logo: "/logo.png",
      sameAs: [`https://github.com/${github.owner}/${github.repo}`],
      ...seo?.organization,
    },
  },
});
