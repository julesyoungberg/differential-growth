import Line from './line';

export default class GrowthSimulation {
    private width: number = 0;
    private height: number = 0;
    private ctx: CanvasRenderingContext2D | null = null;
    private lines: Line[] = [];
    private running: boolean = true;

    constructor(readonly canvas: HTMLCanvasElement) {
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx = canvas.getContext("2d");
        this.ctx!.imageSmoothingEnabled = true;
        this.startSimulation();
    }

    private update() {
        // update the simulation
    }

    private render() {
        // exit if stopped
        if (!this.running) {
            return;
        }

        this.update();

        this.ctx!.save();
        this.ctx!.clearRect(0, 0, this.width, this.height);
        this.ctx!.fillStyle = "rgba(0,0,0,1)";
        this.ctx!.fillRect(0, 0, this.width, this.height);

        /** @todo draw this.lines */
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
        this.ctx!.beginPath();
        this.ctx!.lineWidth = 2;
        this.ctx!.strokeStyle = '#325FA2';
        this.ctx!.arc(this.width / 2.0, this.height / 2.0, 20, 0, Math.PI * 2, true);
        this.ctx!.stroke();
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
        requestAnimationFrame(this.render.bind(this));
    }

    stopSimulation() {
        // stop simulation
        this.running = false;
    }
}
