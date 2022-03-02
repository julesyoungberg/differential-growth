import Node from './node';
import Vector2 from './vector2';

export default class Path {
    nodes: Node[] = [];

    constructor(nodes?: Node[]) {
        this.nodes = nodes || [];
    }

    grow(maxEdgeLength: number) {
        const newNodes: Node[] = [];

        for (let i = this.nodes.length - 1; i >= 0; i--) {
            const prevIndex = i === 0 ? this.nodes.length - 1 : i - 1;
            const a = this.nodes[prevIndex];
            const b = this.nodes[i];
            const dist = Vector2.sub(a.position, b.position).length();

            if (dist > maxEdgeLength) {
                const start = this.nodes.slice(0, i);
                const end = this.nodes.slice(i);
                const reordered = end.concat(start);
                const dir1 = Vector2.sub(reordered[0].position, reordered[1].position);
                const dir2 = Vector2.sub(
                    reordered[reordered.length - 1].position,
                    reordered[reordered.length - 2].position
                );
                const dir = Vector2.add(dir1, dir2).mul(0.5);
                const midX =
                    (reordered[reordered.length - 1].position.x + reordered[0].position.x) / 2.0;
                const midY =
                    (reordered[reordered.length - 1].position.y + reordered[0].position.y) / 2.0;
                const newNode = new Node(new Vector2(midX + dir.x, midY + dir.y));
                this.nodes = [...start, newNode, ...end];
            }
        }

        return newNodes;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff';

        for (let i = 0; i < this.nodes.length; i++) {
            const start = this.nodes[i === 0 ? this.nodes.length - 1 : i - 1].position;
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
            const x = (i / (nNodes - 1)) * width;
            const node = new Node(new Vector2(x, y));
            nodes.push(node);
        }

        return new Path(nodes);
    }

    static circle(width: number, height: number) {
        const nodes = [];
        const center = new Vector2(width / 2.0, height / 2.0);
        const nNodes = 10.0;
        const radius = 30.0;

        for (let i = 0; i < nNodes; i++) {
            const angle = (i / nNodes) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const node = new Node(new Vector2(center.x + x, center.y + y));
            nodes.push(node);
        }

        return new Path(nodes);
    }
}
