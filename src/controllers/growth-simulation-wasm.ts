import { ReactiveController, ReactiveControllerHost } from 'lit';
import init, { GrowthSimulation } from 'growth-simulation';

import { Bounds, Config, Initialization, Settings } from '../growth-simulation/config';

interface Vec2 {
    x: number;
    y: number;
}

interface Node {
    position: Vec2;
}

interface Path {
    cyclic: boolean;
    nodes: Node[];
}

export default class GrowthSimulationWASM implements ReactiveController {
    private width: number;
    private height: number;
    private running: boolean = true;
    private stopped: boolean = false;
    private simulation: GrowthSimulation | undefined;
    config: Config | undefined;

    constructor(readonly host: ReactiveControllerHost, width: number, height: number) {
        host.addController(this);
        this.width = width;
        this.height = height;
    }

    async setupWASM() {
        if (this.simulation) {
            return;
        }

        await init();
        this.simulation = GrowthSimulation.new(this.width, this.height);
        this.config = this.simulation.get_config();
        console.log(this.config);
    }

    hostConnected() {
        /** @todo setup */
    }

    hostDisconnected() {
        /** @todo cleanup */
    }

    updateSettings(newSettings: Partial<Settings>) {
        if (!this.config) {
            return;
        }

        this.config.settings = { ...this.config.settings, ...newSettings };
        this.host.requestUpdate();
    }

    updateInitialization(newInit: Partial<Initialization>) {
        if (!this.config) {
            return;
        }

        this.config.initialization = { ...this.config.initialization, ...newInit };
        this.host.requestUpdate();
    }

    updateBounds(newBounds: Partial<Bounds>) {
        if (!this.config) {
            return;
        }

        this.config.bounds = { ...this.config.bounds, ...newBounds };
        this.host.requestUpdate();
    }

    applyConfig() {
        this.simulation?.update_config(this.config);
    }

    async setCanvas(id: string) {
        await this.setupWASM();
        this.simulation?.set_canvas(id);
        this.startSimulation();
    }

    isRunning() {
        return this.running;
    }

    wasStopped() {
        return this.stopped;
    }

    startSimulation() {
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
        if (!(this.simulation && this.config)) {
            return;
        }

        this.applyConfig();
        this.simulation.setup();
    }

    private render() {
        if (!(this.running && this.simulation)) {
            return;
        }

        this.simulation.update();

        requestAnimationFrame(this.render.bind(this));
    }
}
