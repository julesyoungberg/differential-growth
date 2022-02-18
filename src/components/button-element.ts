import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import theme from '../theme';

@customElement('button-element')
export class ButtonElement extends LitElement {
    static styles = css`
        button {
            background-color: ${theme.colors.greyLighter};
            border-color: ${theme.colors.greyLight};
            border-width: 1px;
            border-radius: 4px;
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