import { ReactiveController, ReactiveControllerHost } from 'lit';
import init, { Config, GrowthSimulation } from 'growth-simulation';

import { Settings } from '../growth-simulation/settings';

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

interface SimulationState {
    paths: Path[];
}

export default class GrowthSimulationWASM implements ReactiveController {
    private width: number;
    private height: number;
    private ctx: CanvasRenderingContext2D | null = null;
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
        if (!this.simulation) {
            return;
        }

        let hasUpdate = false;

        Object.entries(newSettings).forEach(([key, value]) => {
            const currentVal = (this.config.settings as any)[key];
            if (currentVal !== value) {
                (this.config.settings as any)[key] = value;
            }
        });

        if (!hasUpdate) {
            return;
        }
        
        this.simulation.update_settings(this.config.settings);

        this.host.requestUpdate();
    }

    async setCanvas(canvas: HTMLCanvasElement) {
        await this.setupWASM();
        this.updateSettings({ width: canvas.width, height: canvas.height });
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
        this.simulation.setup();
    }

    private drawPath(path: Path) {
        this.ctx!.save();
        this.ctx!.beginPath();
        this.ctx!.lineWidth = 1;
        this.ctx!.strokeStyle = '#ffffff';

        for (let i = 0; i < path.nodes.length; i++) {
            let prevIndex = i - 1;
            if (prevIndex < 0) {
                if (!path.cyclic) {
                    continue;
                }
                prevIndex = path.nodes.length - 1;
            }

            const start = path.nodes[prevIndex].position;
            const end = path.nodes[i].position;
            this.ctx!.moveTo(start.x, start.y);
            this.ctx!.lineTo(end.x, end.y);
            this.ctx!.stroke();
        }

        this.ctx!.restore();
    }

    private draw(state: SimulationState) {
        console.log("state", state);

        this.ctx!.save();
        this.ctx!.clearRect(0, 0, this.width, this.height);
        this.ctx!.fillStyle = 'rgba(0,0,0,1)';
        this.ctx!.fillRect(0, 0, this.width, this.height);

        for (const path of state.paths) {
            this.drawPath(path);
        }

        this.ctx!.restore();
    }

    private render() {
        if (!(this.running && this.simulation)) {
            return;
        }

        this.simulation.update();

        const state: SimulationState = this.simulation.get_state();

        this.draw(state);

        requestAnimationFrame(this.render.bind(this));
    }
}
