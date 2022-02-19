import Node from './node';
import Vector2 from './vector2';

export default class Path {
    nodes: Node[] = [];

    constructor(nodes?: Node[]) {
        this.nodes = nodes || [];
    }

    grow() {
        // add nodes randomly
        /** @todo */
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';

        for (let i = 1; i < this.nodes.length; i++) {
            const start = this.nodes[i - 1].position;
            const end = this.nodes[i].position;
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }

        ctx.restore();
    }

    static horizontal(width: number, height: number) {
        const start = new Node(new Vector2(0, height / 2.0));
        const middle = new Node(new Vector2(width / 2.0, height / 2.0));
        const end = new Node(new Vector2(width, height / 2.0));
        return new Path([start, middle, end]);
    }
}
