import { LitElement, css, html } from "lit";

/**
 * The first web component on the base: a native button styled only through
 * `--ds-*` variables, so it follows whichever theme and mode surrounds it.
 */
export class DsButton extends LitElement {
  static override properties = {
    variant: { reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static override styles = css`
    :host {
      display: inline-block;
    }

    button {
      padding: var(--ds-space-3) var(--ds-space-5);
      font: inherit;
      font-family: var(--ds-font-sans);
      font-size: var(--ds-font-size-s);
      font-weight: var(--ds-font-weight-strong);
      text-transform: var(--ds-label-transform);
      letter-spacing: var(--ds-label-tracking);
      color: var(--ds-color-text-strong);
      cursor: pointer;
      background: var(--ds-color-fill-neutral-resting);
      border: var(--ds-border-width) solid var(--ds-border-colour);
      border-radius: var(--ds-radius-control);
      transition: background-color var(--ds-motion-fast) var(--ds-motion-easing);
    }

    button:hover {
      background: var(--ds-color-fill-neutral-hovered);
    }

    button:active {
      background: var(--ds-color-fill-neutral-pressed);
    }

    button:focus-visible {
      outline: var(--ds-focus-width) solid var(--ds-color-focus);
      outline-offset: var(--ds-focus-offset);
    }

    :host([variant="primary"]) button {
      color: var(--ds-color-on-primary);
      background: var(--ds-color-fill-primary-resting);
      border-color: transparent;
    }

    :host([variant="primary"]) button:hover {
      background: var(--ds-color-fill-primary-hovered);
    }

    :host([variant="accent"]) button {
      color: var(--ds-color-on-accent);
      background: var(--ds-color-fill-accent-resting);
      border-color: transparent;
    }

    :host([variant="accent"]) button:hover {
      background: var(--ds-color-fill-accent-hovered);
    }

    :host([variant="danger"]) button {
      color: var(--ds-color-danger);
      background: var(--ds-color-fill-danger-quiet);
      border-color: var(--ds-color-border-danger);
    }

    button:disabled {
      color: var(--ds-color-text-disabled);
      cursor: not-allowed;
      background: var(--ds-color-fill-neutral-disabled);
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

customElements.define("ds-button", DsButton);

declare global {
  interface HTMLElementTagNameMap {
    "ds-button": DsButton;
  }
}
