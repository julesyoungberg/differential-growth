import Node from './node';
import Vector2 from './vector2';

export default class Path {
    nodes: Node[] = [];
    private maxEdgeLength = 1;

    constructor(nodes?: Node[]) {
        this.nodes = nodes || [];
    }

    setMaxEdgeLength(maxLength: number) {
        this.maxEdgeLength = maxLength;
    }

    grow() {
        const newNodes = [];

        for (let i = this.nodes.length - 1; i > 0; i--) {
            const a = this.nodes[i - 1];
            const b = this.nodes[i];
            const dist = Vector2.sub(a.position, b.position).length();

            if (dist > this.maxEdgeLength) {
                const start = this.nodes.slice(0, i);
                const end = this.nodes.slice(i);
                const newX = (start[start.length - 1].position.x + end[0].position.x) / 2.0;
                const newY = (start[start.length - 1].position.y + end[0].position.y) / 2.0;
                const newNode = new Node(new Vector2(newX, newY));
                newNodes.push(newNode);
                this.nodes = [...start, newNode, ...end];
            }
        }

        return newNodes;
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
        const nodes = [];
        const y = height / 2.0;
        const nNodes = 10;

        for (let i = 0; i < nNodes; i++) {
            const x = i / (nNodes - 1) * width;
            const node = new Node(new Vector2(x, y));
            nodes.push(node);
        }

        return new Path(nodes);
    }

    static circle(width: number, height: number) {
        const nodes = [];
        const center = new Vector2(width / 2.0, height / 2.0);
        const nNodes = 10.0;
        const radius = 10.0;

        for (let i = 0; i < nNodes; i++) {
            const angle = i / (nNodes - 1) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const node = new Node(new Vector2(center.x + x, center.y + y));
            nodes.push(node);
        }

        return new Path(nodes);
    }
}
