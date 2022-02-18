import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import theme from '../theme';

import './modal-container';

@customElement('settings-modal')
export class SettingsModal extends LitElement {
    @property({ type: Boolean })
    open = false;

    static styles = css`
        h2 {
            margin-top: 0px;
        }
    `;

    render() {
        return html`
            <modal-container ?open=${this.open}>
                <h2>Settings</h2>
            </modal-container>
        `;
    }
}
