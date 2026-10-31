import { LitElement, css, html } from "lit";

/**
 * The first web component on the base: a native button styled only through
 * `--gw-*` variables, so it follows whichever theme and mode surrounds it.
 */
export class GwButton extends LitElement {
  static override properties = {
    variant: { reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static override styles = css`
    :host {
      display: inline-block;
    }

    button {
      padding: var(--gw-space-3) var(--gw-space-5);
      font: inherit;
      font-family: var(--gw-font-sans);
      font-size: var(--gw-font-size-s);
      font-weight: var(--gw-font-weight-strong);
      text-transform: var(--gw-label-transform);
      letter-spacing: var(--gw-label-tracking);
      color: var(--gw-color-text-strong);
      cursor: pointer;
      background: var(--gw-color-fill-neutral-resting);
      border: var(--gw-border-width) solid var(--gw-border-colour);
      border-radius: var(--gw-radius-control);
      transition: background-color var(--gw-motion-fast) var(--gw-motion-easing);
    }

    button:hover {
      background: var(--gw-color-fill-neutral-hovered);
    }

    button:active {
      background: var(--gw-color-fill-neutral-pressed);
    }

    button:focus-visible {
      outline: var(--gw-focus-width) solid var(--gw-color-focus);
      outline-offset: var(--gw-focus-offset);
    }

    :host([variant="primary"]) button {
      color: var(--gw-color-on-primary);
      background: var(--gw-color-fill-primary-resting);
      border-color: transparent;
    }

    :host([variant="primary"]) button:hover {
      background: var(--gw-color-fill-primary-hovered);
    }

    :host([variant="accent"]) button {
      color: var(--gw-color-on-accent);
      background: var(--gw-color-fill-accent-resting);
      border-color: transparent;
    }

    :host([variant="accent"]) button:hover {
      background: var(--gw-color-fill-accent-hovered);
    }

    :host([variant="danger"]) button {
      color: var(--gw-color-danger);
      background: var(--gw-color-fill-danger-quiet);
      border-color: var(--gw-color-border-danger);
    }

    button:disabled {
      color: var(--gw-color-text-disabled);
      cursor: not-allowed;
      background: var(--gw-color-fill-neutral-disabled);
    }
  `;

  declare variant: "neutral" | "primary" | "accent" | "danger";
  declare disabled: boolean;

  constructor() {
    super();
    this.variant = "neutral";
    this.disabled = false;
  }

  override render() {
    return html`<button ?disabled=${this.disabled} part="button">
      <slot></slot>
    </button>`;
  }
}

customElements.define("gw-button", GwButton);

declare global {
  interface HTMLElementTagNameMap {
    "gw-button": GwButton;
  }
}
