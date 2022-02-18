import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import theme from '../theme';

@customElement('button-element')
export class ButtonElement extends LitElement {
    static styles = css`
        button {
            background-color: ${theme.colors.greyDark};
            border-color: ${theme.colors.greyLight};
            border-width: 1px;
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
