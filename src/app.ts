import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import './components/button-element';
import './components/my-element';
import './components/icons/settings-icon';

@customElement('my-app')
export class MyApp extends LitElement {
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

    render() {
        return html`
            <button-element class='settings-button'>
                <settings-icon></settings-icon>
            </button-element>
            <h1>Differential Growth</h1>
            <my-element></my-element>
        `;
    }
}
