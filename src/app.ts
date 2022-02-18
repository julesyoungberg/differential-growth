import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './components/button-element';
import './components/settings-modal';
import './components/icons/settings-icon';

@customElement('my-app')
export class MyApp extends LitElement {
    @state()
    private settingsOpen: boolean = false;

    static styles = css`
        .settings-button {
            position: fixed;
            right: 10px;
            top: 10px;
        }

        settings-icon {
            position: relative;
            bottom: -1px;
        }
    `;

    private openSettings() {
        this.settingsOpen = true;
    }

    private closeSettings() {
        this.settingsOpen = false;
    }

    render() {
        return html`
            <button-element class="settings-button" @click=${this.openSettings}>
                <settings-icon></settings-icon>
            </button-element>
            <settings-modal
                ?open=${this.settingsOpen}
                @closed=${this.closeSettings}
            ></settings-modal>
            <h1>Differential Growth</h1>
        `;
    }
}
