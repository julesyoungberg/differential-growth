import { ReactiveController, ReactiveControllerHost } from 'lit';

import Path from './path';
import RBush from './rbush';
import { defaultSettings, Settings } from './settings';

export default class GrowthSimulation implements ReactiveController {
    private width: number = 0;
    private height: number = 0;
    private canvas?: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null = null;
    private paths: Path[] = [];
    private running: boolean = true;
    private stopped: boolean = false;
    settings: Settings = defaultSettings;

    constructor(readonly host: ReactiveControllerHost) {
        host.addController(this);
    }

    hostConnected() {
        /** @todo setup */
    }

    hostDisconnected() {
        /** @todo cleanup */
    }

    updateSettings(newSettings: Partial<Settings>) {
        this.settings = { ...this.settings, ...newSettings };
        this.host.requestUpdate();
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx = canvas.getContext('2d');
        this.ctx!.imageSmoothingEnabled = true;
        this.startSimulation();
    }

    isRunning() {
        return this.running;
    }

    wasStopped() {
        return this.stopped;
    }

    private setup() {
        this.paths = [Path.polygon(this.settings, this.width, this.height)];
    }

    private update() {
        // build rbush
        const rbush = new RBush();
        for (const path of this.paths) {
            rbush.insertNodes(path.nodes);
        }
    
        // update the simulation
        for (const path of this.paths) {
            path.update(rbush);
        }
    }

    private async render() {
        // exit if stopped
        if (!this.running) {
            return;
        }

        this.update();

        this.ctx!.save();
        this.ctx!.clearRect(0, 0, this.width, this.height);
        this.ctx!.fillStyle = 'rgba(0,0,0,1)';
        this.ctx!.fillRect(0, 0, this.width, this.height);

        for (const path of this.paths) {
            path.draw(this.ctx!);
        }

        this.ctx!.restore();

        // request next animation frame
        requestAnimationFrame(this.render.bind(this));
    }

    startSimulation() {
        // confirm context exists
        if (!this.ctx) {
            throw new Error(`Unable to creating drawing context.`);
        }

        // start simulation
        this.running = true;
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
}
