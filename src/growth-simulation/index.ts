import Path from './path';
import RBush from './rbush';

export default class GrowthSimulation {
    private width: number = 0;
    private height: number = 0;
    private ctx: CanvasRenderingContext2D | null = null;
    private paths: Path[] = [];
    private rbush?: RBush;
    private running: boolean = true;

    constructor(readonly canvas: HTMLCanvasElement) {
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx = canvas.getContext('2d');
        this.ctx!.imageSmoothingEnabled = true;
        this.startSimulation();
    }

    private setup() {
        this.paths = [Path.horizontal(this.width, this.height)];
        this.rbush = new RBush();
        this.rbush.insertPaths(this.paths);
    }

    private update() {
        // update the simulation
        for (const path of this.paths) {
            path.grow();

            /** @todo */
            // attract
            // repulse
            // align to halfway between neighbors if there
        }
    }

    private render() {
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
        this.setup();
        requestAnimationFrame(this.render.bind(this));
    }

    stopSimulation() {
        // stop simulation
        this.running = false;
    }
}
