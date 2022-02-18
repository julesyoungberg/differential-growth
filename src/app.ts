import { css, html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import './components/button-element';
import './components/settings-modal';
import './components/icons/settings-icon';
import GrowthSimulation from './growth-simulation';

const CANVAS_ID = "simulation-canvas";

@customElement('my-app')
export class MyApp extends LitElement {
    @state()
    private settingsOpen: boolean = false;

    @query(`#${CANVAS_ID}`)
    private canvas?: HTMLCanvasElement;

    private growthSimulation?: GrowthSimulation;

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

        canvas {
            width: 853px;
            height: 480px;
        }
    `;

    firstUpdated(): void {
        this.growthSimulation = new GrowthSimulation(this.canvas!);
    }

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
            <canvas id=${CANVAS_ID}></canvas>
        `;
    }
}
