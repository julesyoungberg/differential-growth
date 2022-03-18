import { ReactiveController, ReactiveControllerHost } from 'lit';
import init, { GrowthSimulation } from 'growth-simulation';

import { defaultSettings, Settings } from '../growth-simulation/settings';

export default class GrowthSimulationWASM implements ReactiveController {
    private canvas?: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null = null;
    private running: boolean = true;
    private stopped: boolean = false;
    private simulation: GrowthSimulation | undefined;

    constructor(readonly host: ReactiveControllerHost) {
        host.addController(this);
        init().then(() => {
            this.simulation = GrowthSimulation.new(100, 100);
        });
    }

    hostConnected() {
        /** @todo setup */
    }

    hostDisconnected() {
        /** @todo cleanup */
    }

    updateSettings(newSettings: Partial<Settings>) {
        if (!this.simulation) {
            return;
        }

        const settings = this.simulation.get_settings();
        let hasUpdate = false;

        Object.entries(newSettings).forEach(([key, value]) => {
            const currentVal = (settings as any)[key];
            if (currentVal !== value) {
                (settings as any)[key] = value;
            }
        });

        if (!hasUpdate) {
            return;
        }
        
        this.simulation.update_settings(settings);

        this.host.requestUpdate();
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.updateSettings({ width: canvas.width, height: canvas.height });
        this.ctx = canvas.getContext('2d');
        this.ctx!.imageSmoothingEnabled = true;
        this.startSimulation();
    }

    startSimulation() {
        // confirm context exists
        if (!this.ctx) {
            throw new Error(`Unable to creating drawing context.`);
        }

        // start simulation
        this.running = true;
        this.stopped = false;
        this.host.requestUpdate();
        this.setup();
        requestAnimationFrame(this.render.bind(this));
    }

    pauseSimulation() {
        // stop simulation
        this.running = false;
        this.host.requestUpdate();
    }

    resumeSimulation() {
        this.running = true;
        this.host.requestUpdate();
        requestAnimationFrame(this.render.bind(this));
    }

    stopSimulation() {
        this.running = false;
        this.stopped = true;
        this.host.requestUpdate();
    }

    private setup() {
        /** @todo init paths and maybe update canvas size */
    }

    private render() {
        if (!(this.running && this.simulation)) {
            return;
        }

        this.simulation.update();

        /** @todo get points from simulation and draw them */
    }
}
