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
    private rbush?: RBush;
    private running: boolean = true;
    private settings: Settings = defaultSettings;

    constructor(readonly host: ReactiveControllerHost) {
        host.addController(this);
    }

    hostConnected() {
        /** @todo setup */
    }

    hostDisconnected() {
        /** @todo cleanup */
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

    private setup() {
        this.paths = [Path.circle(this.width, this.height)];
        this.rbush = new RBush();
        this.rbush.insertPaths(this.paths);
        console.log(this.rbush);
        console.log(this.rbush.all());
    }

    private update() {
        // update the simulation
        for (const path of this.paths) {
            const newNodes = path.grow(this.settings.maxEdgeLength);
            if (newNodes.length > 0) {
                this.rbush?.insertNodes(newNodes);
            }

            if (!this.rbush) {
                continue;
            }

            for (let i = 0; i < path.nodes.length; i++) {
                const node = path.nodes[i];
                const neighbors = this.rbush.searchNear(
                    node.position,
                    Math.max(this.settings.separationDistance, this.settings.attractionDistance)
                );
                const neighborNodes = neighbors.map((n) => n.node);
                node.attract(neighborNodes, this.settings);
                node.avoid(neighborNodes, this.settings);

                const prevIndex = i === 0 ? path.nodes.length - 1 : i - 1;
                const nextIndex = i === path.nodes.length - 1 ? 0 : i + 1;
                node.align(path.nodes[prevIndex], path.nodes[nextIndex], this.settings);

                node.update(this.settings);
            }
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

    stopSimulation() {
        // stop simulation
        this.running = false;
        this.host.requestUpdate();
    }
}
