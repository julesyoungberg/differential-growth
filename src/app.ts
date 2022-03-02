import { css, html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import './components/button-element';
import './components/settings-modal';
import './components/icons/pause-icon';
import './components/icons/play-icon';
import './components/icons/settings-icon';
import GrowthSimulation from './growth-simulation';

import theme from './theme';

const CANVAS_ID = 'simulation-canvas';

@customElement('my-app')
export class MyApp extends LitElement {
    @state()
    private settingsOpen: boolean = false;

    @query(`#${CANVAS_ID}`)
    private canvas?: HTMLCanvasElement;

    private growthSimulation = new GrowthSimulation(this);

    static styles = css`
        :host {
            overflow-x: auto;
        }

        h1 {
            color: ${theme.colors.text};
        }

        .toolbar {
            margin-bottom: 18px;
        }

        settings-icon {
            position: relative;
            bottom: -1px;
        }

        canvas {
            width: 1200px;
            height: 800px;
        }
    `;

    firstUpdated(): void {
        if (this.canvas) {
            this.growthSimulation.setCanvas(this.canvas);
            setTimeout(() => this.growthSimulation.stopSimulation(), 60000);
        } else {
            throw Error('No canvas found');
        }
    }

    private openSettings() {
        this.settingsOpen = true;
    }

    private closeSettings() {
        this.settingsOpen = false;
    }

    private toggleSimulation() {
        if (this.growthSimulation?.isRunning()) {
            this.growthSimulation?.stopSimulation();
        } else {
            this.growthSimulation?.startSimulation();
        }
    }

    render() {
        const playPauseIcon = this.growthSimulation?.isRunning()
            ? html`<pause-icon></pause-icon>`
            : html`<play-icon></play-icon>`;

        return html`
            <settings-modal
                ?open=${this.settingsOpen}
                @closed=${this.closeSettings}
            ></settings-modal>
            <h1>Differential Growth</h1>
            <div class="toolbar">
                <button-element @click=${this.toggleSimulation}> ${playPauseIcon} </button-element>
                <button-element @click=${this.openSettings}>
                    <settings-icon></settings-icon>
                </button-element>
            </div>
            <canvas id=${CANVAS_ID}></canvas>
        `;
    }
}
