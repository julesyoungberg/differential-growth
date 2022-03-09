import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import theme from '../theme';

@customElement('button-element')
export class ButtonElement extends LitElement {
    static styles = css`
        button {
            background-color: ${theme.colors.greyDark};
            border-width: 0;
            border-radius: ${theme.borderRadius};
            color: white;
            text-transform: uppercase;
            cursor: pointer;
            letter-spacing: 0.1ch;
            font-weight: bold;
            font-family: monospace;
            font-size: 18px;
            padding: var(--button-padding, 4px);
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
