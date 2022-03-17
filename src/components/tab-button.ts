import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import theme from '../theme';

@customElement('tab-button')
export class TabButton extends LitElement {
    static styles = css`
        button {
            background-color: ${theme.colors.greyDark};
            border-width: 0;
            border-radius: 0;
            color: white;
            text-transform: uppercase;
            cursor: pointer;
            letter-spacing: 0.1ch;
            font-weight: bold;
            font-family: monospace;
            font-size: 18px;
            padding: var(--button-padding, 8px);
            border-top-left-radius: ${theme.borderRadius};
            border-top-right-radius: ${theme.borderRadius};
            border-bottom: 1px solid ${theme.colors.greyDark};
        }

        button:hover {
            background-color: ${theme.colors.greyDarkish};
        }

        :host(.active) button {
            border-bottom: 1px solid rgba(0, 200, 255);
        }
    `;

    render() {
        return html`
            <button>
                <slot></slot>
            </button>
        `;
    }
}
