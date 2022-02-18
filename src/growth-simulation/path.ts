import Particle from './particle';
import Vector2 from './vector2';

export default class Path {
    points: Particle[] = [];

    constructor(points?: Particle[]) {
        this.points = points || [];
    }

    update() {
        // update each particle in path
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';

        for (let i = 1; i < this.points.length; i++) {
            const start = this.points[i - 1].position;
            const end = this.points[i].position;
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }

        ctx.restore();
    }

    static horizontal(width: number, height: number) {
        const start = new Particle(new Vector2(0, height / 2.0));
        const end = new Particle(new Vector2(width, height / 2.0));
        return new Path([start, end]);
    }
}
