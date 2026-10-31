import tokens from "@groundwork/tokens/themes.json";
import { LitElement, css, html } from "lit";

const labels: Record<string, string> = {
  light: "Light",
  dark: "Dark",
  darker: "Darker",
};

/**
 * Frames a demo with a theme and mode picker. It sets `data-gw-theme` and
 * `data-gw-mode` on itself, so everything slotted inside follows them.
 */
export class GwDemoFrame extends LitElement {
  static override properties = {
    theme: { attribute: "data-gw-theme", reflect: true },
    mode: { attribute: "data-gw-mode", reflect: true },
    clicks: { state: true },
  };

  static override styles = css`
    :host {
      display: block;
      overflow: hidden;
      font-family: var(--gw-font-sans);
      color: var(--gw-color-text-primary);
      background: var(--gw-color-surface-default);
      border: 1px solid var(--gw-color-border-normal);
      border-radius: var(--gw-radius-panel);
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gw-space-3);
      align-items: center;
      padding: var(--gw-space-3) var(--gw-space-5);
      font-size: var(--gw-font-size-xs);
      background: var(--gw-color-surface-lower);
      border-bottom: 1px solid var(--gw-color-border-quiet);
    }

    select {
      padding: var(--gw-space-2) var(--gw-space-3);
      font: inherit;
      color: var(--gw-color-text-strong);
      background: var(--gw-color-surface-raised);
      border: 1px solid var(--gw-color-border-normal);
      border-radius: var(--gw-radius-control);
    }

    .modes {
      display: inline-flex;
      overflow: hidden;
      border: 1px solid var(--gw-color-border-normal);
      border-radius: var(--gw-radius-control);
    }

    .modes button {
      padding: var(--gw-space-2) var(--gw-space-4);
      font: inherit;
      color: var(--gw-color-text-primary);
      cursor: pointer;
      background: var(--gw-color-surface-raised);
      border: 0;
    }

    .modes button[aria-pressed="true"] {
      color: var(--gw-color-on-accent);
      background: var(--gw-color-fill-accent-resting);
    }

    select:focus-visible,
    .modes button:focus-visible {
      outline: var(--gw-focus-width) solid var(--gw-color-focus);
      outline-offset: var(--gw-focus-offset);
    }

    .stage {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gw-space-4);
      align-items: center;
      padding: var(--gw-space-6) var(--gw-space-5);
    }

    .count {
      margin-inline-start: auto;
      color: var(--gw-color-text-secondary);
    }
  `;

  declare theme: string;
  declare mode: string;
  declare clicks: number;

  constructor() {
    super();
    this.theme = "base";
    this.mode = "dark";
    this.clicks = 0;
    this.addEventListener("click", (event) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.localName === "gw-button"
      ) {
        this.clicks += 1;
      }
    });
  }

  private get modes() {
    const theme = tokens.themes.find((item) => item.id === this.theme);

    return Object.keys(theme?.modes ?? {});
  }

  private pickTheme(event: Event) {
    if (!(event.target instanceof HTMLSelectElement)) return;

    this.theme = event.target.value;

    if (!this.modes.includes(this.mode)) this.mode = this.modes[0] ?? "dark";
  }

  override render() {
    return html`
      <div class="toolbar">
        <label>
          Theme
          <select @change=${this.pickTheme} .value=${this.theme}>
            ${tokens.themes.map(
              (theme) =>
                html`<option
                  value=${theme.id}
                  ?selected=${theme.id === this.theme}
                >
                  ${theme.name}
                </option>`,
            )}
          </select>
        </label>
        <span class="modes" role="group" aria-label="Mode">
          ${this.modes.map(
            (mode) =>
              html`<button
                type="button"
                aria-pressed=${mode === this.mode ? "true" : "false"}
                @click=${() => {
                  this.mode = mode;
                }}
              >
                ${labels[mode] ?? mode}
              </button>`,
          )}
        </span>
        <span class="count" aria-live="polite">${this.clicks} clicks</span>
      </div>
      <div class="stage"><slot></slot></div>
    `;
  }
}

customElements.define("gw-demo-frame", GwDemoFrame);

declare global {
  interface HTMLElementTagNameMap {
    "gw-demo-frame": GwDemoFrame;
  }
}
