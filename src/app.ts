import { css, html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import './components/button-element';
import './components/settings-modal';
import './components/tool-bar';
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

        canvas {
            margin-top: 18px;
        }

        settings-icon {
            position: relative;
            bottom: -1px;
        }
    `;

    firstUpdated(): void {
        if (this.canvas) {
            this.growthSimulation.setCanvas(this.canvas);
            // setTimeout(() => this.growthSimulation.stopSimulation(), 60000);
        } else {
            throw Error('No canvas found');
        }
    }

    private openSettings() {
        this.growthSimulation.stopSimulation();
        this.settingsOpen = true;
    }

    private closeSettings() {
        this.settingsOpen = false;
        this.growthSimulation.startSimulation();
    }

    private pauseSimulation() {
        this.growthSimulation?.pauseSimulation();
    }

    private stopSimulation() {
        this.growthSimulation?.stopSimulation();
    }

    private restartSimulation() {
        this.growthSimulation?.startSimulation();
    }

    private resumeSimulation() {
        this.growthSimulation?.resumeSimulation();
    }

    private updateSettings(event: CustomEvent) {
        const { settings } = event.detail;
        this.growthSimulation?.updateSettings(settings);
    }

    render() {
        const playPauseIcon = this.growthSimulation?.isRunning()
            ? html`<pause-icon></pause-icon>`
            : html`<play-icon></play-icon>`;

        return html`
            <settings-modal
                ?open=${this.settingsOpen}
                @closed=${this.closeSettings}
                .settings=${this.growthSimulation?.settings}
                @update-settings=${this.updateSettings.bind(this)}
            ></settings-modal>
            <h1>Differential Growth</h1>
            <tool-bar
                class="toolbar"
                ?simulationRunning=${this.growthSimulation?.isRunning()}
                ?simulationStopped=${this.growthSimulation?.wasStopped()}
                @pause=${this.pauseSimulation.bind(this)}
                @restart=${this.restartSimulation.bind(this)}
                @resume=${this.resumeSimulation.bind(this)}
                @stop=${this.stopSimulation.bind(this)}
                @open-settings=${this.openSettings.bind(this)}
            ></tool-bar>
            <canvas id=${CANVAS_ID} width="1200px" height="800px"></canvas>
        `;
    }
}
