import Node from './node';
import RBush from './rbush';
import { Settings } from './settings';
import Vector2 from './vector2';

export default class Path {
    cyclic: boolean;
    nodes: Node[];

    constructor(readonly settings: Settings, readonly rbush: RBush, nodes?: Node[], cyclic = false) {
        this.nodes = nodes || [];
        this.cyclic = cyclic;
        rbush.insertNodes(this.nodes);
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

    private grow() {
        const newNodes: Node[] = [];

        for (let i = this.nodes.length - 1; i >= 0; i--) {
            const { nextNode, previousNode } = this.getNeighborNodes(i);
            if (!(previousNode && nextNode)) {
                continue;
            }

            if (previousNode.distance(this.nodes[i]) > this.settings.maxEdgeLength) {
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

    private pruneNodes() {
        for (let index = 0; index < this.nodes.length; index++) {
            const { previousNode } = this.getNeighborNodes(index);
            if (!previousNode) {
                continue;
            }

            if (previousNode.distance(this.nodes[index]) < this.settings.minEdgeLength) {
                this.rbush.removeNode(this.nodes[index]);
                if (index === 0) {
                    this.nodes.splice(this.nodes.length - 1, 1);
                } else {
                    this.nodes.splice(index - 1, 1);
                }
            }
        }
    }

    private injectRandomNode() {
        const index = Math.round(Math.random() * (this.nodes.length - 2)) + 1;
        const { previousNode, nextNode } = this.getNeighborNodes(index);

        if (previousNode && nextNode && previousNode.distance(this.nodes[index]) > this.settings.minEdgeLength) {
            const newNode = new Node(Vector2.add(previousNode.position, nextNode.position).div(2));
            if (index === 0) {
                this.nodes.splice(this.nodes.length, 0, newNode);
            } else {
                this.nodes.splice(index, 0, newNode);
            }
        }
    }

    private injectCurvatureNode() {
        /** @todo */
    }

    private injectNode() {
        /** @todo put injection mode in settings */
        const injectionMode: string = 'RANDOM';
        switch (injectionMode) {
            case 'RANDOM':
                this.injectRandomNode();
                return;
            case 'CURVATURE':
                this.injectCurvatureNode();
                return;
            default:
                throw new Error('invalid injection mode');
        }
    }

    update() {
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const neighbors = this.rbush.searchNear(
                node.position,
                Math.max(this.settings.separationDistance, this.settings.attractionDistance)
            );
            const neighborNodes = neighbors.map((n) => n.node);
            node.attract(neighborNodes, this.settings);
            node.avoid(neighborNodes, this.settings);

            const prevIndex = i === 0 ? this.nodes.length - 1 : i - 1;
            const nextIndex = i === this.nodes.length - 1 ? 0 : i + 1;
            node.align(this.nodes[prevIndex], this.nodes[nextIndex], this.settings);

            this.applyBounds();

            node.update(this.settings);
        }

        const newNodes = this.grow();
        if (newNodes.length > 0) {
            this.rbush.insertNodes(newNodes);
        }

        this.pruneNodes();

        if (Math.random() < this.settings.injectionProbability) {
            this.injectNode();
        }
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

    static horizontal(settings: Settings, rbush: RBush, width: number, height: number) {
        const nodes = [];
        const y = height / 2.0;
        const nNodes = 10;

        for (let i = 0; i < nNodes; i++) {
            const x = (i / (nNodes - 1)) * width;
            const node = new Node(new Vector2(x, y));
            nodes.push(node);
        }

        return new Path(settings, rbush, nodes);
    }

    static circle(settings: Settings, rbush: RBush, width: number, height: number) {
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

        return new Path(settings, rbush, nodes, true);
    }
}
