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
