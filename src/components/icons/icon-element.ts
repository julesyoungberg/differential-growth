import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './settings-icon';

@customElement('icon-element')
export class IconElement extends LitElement {
    @property()
    iconName: string = "settings";

    render() {
        /** @todo add more icons */
        switch (this.iconName) {
            // case "settings":
            default:
                return html`<settings-icon></settings-icon>`;
        }
    }
}
