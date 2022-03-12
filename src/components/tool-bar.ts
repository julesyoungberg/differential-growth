import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './button-element';
import './icons/pause-icon';
import './icons/play-icon';
import './icons/settings-icon';
import './icons/stop-icon';

@customElement('tool-bar')
export class ToolBar extends LitElement {
    @property({ type: Boolean })
    simulationRunning: boolean = false;

    @property({ type: Boolean })
    simulationStopped: boolean = false;

    private emitEvent(event: string) {
        this.dispatchEvent(new CustomEvent(event, { bubbles: true, composed: true }));
    }

    private handlePlayPauseClick() {
        if (this.simulationRunning) {
            this.emitEvent('pause');
        } else if (this.simulationStopped) {
            this.emitEvent('restart');
        } else {
            this.emitEvent('resume');
        }
    }

    private handleStopClick() {
        this.emitEvent('stop');
    }

    private handleSettingsClick() {
        this.emitEvent('open-settings');
    }

    render() {
        const playPauseIcon = this.simulationRunning
            ? html`<pause-icon></pause-icon>`
            : html`<play-icon></play-icon>`;

        return html`
            <div>
                <button-element @click=${this.handlePlayPauseClick.bind(this)}>${playPauseIcon}</button-element>
                <button-element @click=${this.handleStopClick.bind(this)}><stop-icon></stop-icon></button-element>
                <button-element @click=${this.handleSettingsClick.bind(this)}>
                    <settings-icon></settings-icon>
                </button-element>
            </div>
        `;
    }
}
