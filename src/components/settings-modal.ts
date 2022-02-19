import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import theme from '../theme';

import './icons/close-icon';
import './modal-container';

@customElement('settings-modal')
export class SettingsModal extends LitElement {
    @property({ type: Boolean })
    open = false;

    static styles = css`
        .settings-modal-wrapper {
            position: relative;
        }

        h2 {
            margin-top: 0px;
        }

        close-icon {
            position: absolute;
            top: 10px;
            right: 10px;
        }
    `;

    private close() {
        this.dispatchEvent(new CustomEvent('closed', { bubbles: true, composed: true }));
    }

    render() {
        return html`
            <modal-container ?open=${this.open}>
                <div class="settings-modal-wrapper">
                    <close-icon @click=${this.close}></close-icon>
                    <h2>Settings</h2>
                </div>
            </modal-container>
        `;
    }
}
