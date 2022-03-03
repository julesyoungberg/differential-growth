import Node from './node';
import RBush from './rbush';
import { Settings } from './settings';
import Vector2 from './vector2';

export default class Path {
    nodes: Node[] = [];
    cyclic = false;

    constructor(nodes?: Node[], cyclic = false) {
        this.nodes = nodes || [];
        this.cyclic = cyclic;
    }

    private getNeighborNodes(index: number) {
        let prevIndex = index - 1;
        if (this.cyclic && prevIndex < 0) {
            prevIndex += this.nodes.length;
        }

        let nextIndex = index + 1;
        if (this.cyclic && nextIndex >= this.nodes.length) {
            nextIndex -= this.nodes.length;
        }

        return {
            previousNode: prevIndex < 0 ? undefined : this.nodes[prevIndex],
            nextNode: nextIndex < 0 ? undefined : this.nodes[nextIndex],
        };
    }

    private grow(maxEdgeLength: number) {
        const newNodes: Node[] = [];

        for (let i = this.nodes.length - 1; i >= 0; i--) {
            const { nextNode, previousNode } = this.getNeighborNodes(i);
            if (!(previousNode && nextNode)) {
                continue;
            }

            if (previousNode.distance(this.nodes[i]) > maxEdgeLength) {
                const newNode = new Node(Vector2.add(previousNode.position, nextNode.position).div(2));
                if (i === 0) {
                    this.nodes.splice(this.nodes.length, 0, newNode);
                } else {
                    this.nodes.splice(i, 0, newNode);
                }
            }
        }

        return newNodes;
    }

    private applyBounds() {
        /** @todo */
    }

    private pruneNodes(minEdgeLength: number, rbush: RBush) {
        for (let index = 0; index <= this.nodes.length; index++) {
            const { previousNode } = this.getNeighborNodes(index);
            if (!previousNode) {
                continue;
            }

            if (previousNode.distance(this.nodes[index]) < minEdgeLength) {
                if (index === 0) {
                    this.nodes.splice(this.nodes.length - 1, 1);
                } else {
                    this.nodes.splice(index - 1, 1);
                }
            }
        }
    }

    private injectRandomNodes() {
        /** @todo */
    }

    update(settings: Settings, rbush: RBush) {
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const neighbors = rbush.searchNear(
                node.position,
                Math.max(settings.separationDistance, settings.attractionDistance)
            );
            const neighborNodes = neighbors.map((n) => n.node);
            node.attract(neighborNodes, settings);
            node.avoid(neighborNodes, settings);

            const prevIndex = i === 0 ? this.nodes.length - 1 : i - 1;
            const nextIndex = i === this.nodes.length - 1 ? 0 : i + 1;
            node.align(this.nodes[prevIndex], this.nodes[nextIndex], settings);

            this.applyBounds();

            node.update(settings);
        }

        const newNodes = this.grow(settings.maxEdgeLength);
        if (newNodes.length > 0) {
            rbush.insertNodes(newNodes);
        }

        this.pruneNodes(settings.minEdgeLength, rbush);

        this.injectRandomNodes();
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

        return new Path(nodes, true);
    }
}
