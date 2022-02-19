import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { baseSvgIconStyles } from './icon-styles';

@customElement('pause-icon')
export class PauseIcon extends LitElement {
    static styles = baseSvgIconStyles;

    render() {
        return html`
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
        `;
    }
}
