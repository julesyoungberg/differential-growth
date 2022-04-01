import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './components/button-element';
import './components/config-modal';
import './components/tool-bar';
import GrowthSimulationWASM from './controllers/growth-simulation-wasm';

import theme from './theme';
import { defaultSettings } from './growth-simulation/config';

const CANVAS_ID = 'simulation-canvas';

@customElement('my-app')
export class MyApp extends LitElement {
    @state()
    private settingsOpen: boolean = false;

    private growthSimulation = new GrowthSimulationWASM(
        this,
        defaultSettings.width,
        defaultSettings.height
    );

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

    firstUpdated() {
        this.growthSimulation.setCanvas(CANVAS_ID);
    }

    private openSettings() {
        this.growthSimulation.pauseSimulation();
        this.settingsOpen = true;
    }

    private closeSettings() {
        this.settingsOpen = false;
        if (this.growthSimulation.wasStopped()) {
            this.growthSimulation.startSimulation();
        } else {
            this.growthSimulation.resumeSimulation();
        }
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
        this.growthSimulation.updateSettings(settings);
        this.growthSimulation.stopSimulation();
    }

    private updateInitialization(event: CustomEvent) {
        const { initialization } = event.detail;
        this.growthSimulation.updateInitialization(initialization);
        this.growthSimulation.stopSimulation();
    }

    private updateBounds(event: CustomEvent) {
        const { bounds } = event.detail;
        console.log({ bounds });
        this.growthSimulation.updateBounds(bounds);
        this.growthSimulation.stopSimulation();
    }

    render() {
        console.log("app.render()", this.growthSimulation.config);
        return html`
            ${this.growthSimulation.config && this.settingsOpen
                ? html`
                      <config-modal
                          ?open=${this.settingsOpen}
                          @closed=${this.closeSettings}
                          .settings=${this.growthSimulation.config.settings}
                          .initialization=${this.growthSimulation.config.initialization}
                          .bounds=${this.growthSimulation.config.bounds}
                          .recording=${this.growthSimulation.config.recording}
                          @update-settings=${this.updateSettings}
                          @update-initialization=${this.updateInitialization}
                          @update-bounds=${this.updateBounds}
                      ></config-modal>
                  `
                : ''}
            <h1>Differential Growth</h1>
            <tool-bar
                class="toolbar"
                ?simulationRunning=${this.growthSimulation?.isRunning()}
                ?simulationStopped=${this.growthSimulation?.wasStopped()}
                @pause=${this.pauseSimulation}
                @restart=${this.restartSimulation}
                @resume=${this.resumeSimulation}
                @stop=${this.stopSimulation}
                @open-settings=${this.openSettings}
            ></tool-bar>
            <canvas
                id=${CANVAS_ID}
                width="${defaultSettings.width}px"
                height="${defaultSettings.height}px"
            ></canvas>
        `;
    }
}
