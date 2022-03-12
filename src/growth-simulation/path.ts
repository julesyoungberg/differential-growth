import Node from './node';
import RBush from './rbush';
import { Settings } from './settings';
import Vector2 from './vector2';

export default class Path {
    cyclic: boolean;
    nodes: Node[];

    constructor(readonly settings: Settings, nodes?: Node[], cyclic = false) {
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
                if (index === 0) {
                    this.nodes.splice(this.nodes.length - 1, 1);
                } else {
                    this.nodes.splice(index - 1, 1);
                }
            }
        }
    }

    // private injectRandomNode() {
    //     const index = Math.round(Math.random() * (this.nodes.length - 2)) + 1;
    //     const { previousNode, nextNode } = this.getNeighborNodes(index);

    //     if (previousNode && nextNode && previousNode.distance(this.nodes[index]) > this.settings.minEdgeLength) {
    //         const newNode = new Node(Vector2.add(previousNode.position, nextNode.position).div(2));
    //         if (index === 0) {
    //             this.nodes.splice(this.nodes.length, 0, newNode);
    //         } else {
    //             this.nodes.splice(index, 0, newNode);
    //         }
    //     }
    // }

    update(rbush: RBush) {
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const neighbors = rbush.searchNear(
                node.position,
                this.settings.separationDistance,
                // Math.max(this.settings.separationDistance, this.settings.attractionDistance)
            );
            const neighborNodes = neighbors.map((n) => n.node);
            // node.attract(neighborNodes, this.settings);
            node.avoid(neighborNodes, this.settings);

            const { previousNode, nextNode } = this.getNeighborNodes(i);
            if (previousNode && nextNode) {
                node.align(previousNode, nextNode, this.settings);
            }

            this.applyBounds();

            node.update(this.settings);
        }

        this.grow();

        this.pruneNodes();

        // if (Math.random() < this.settings.injectionProbability) {
        //     this.injectRandomNode();
        // }
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

    static horizontal(settings: Settings, width: number, height: number) {
        const nodes = [];
        const y = height / 2.0;
        const nNodes = 10;

        for (let i = 0; i < nNodes; i++) {
            const x = (i / (nNodes - 1)) * width;
            const node = new Node(new Vector2(x, y));
            nodes.push(node);
        }

        return new Path(settings, nodes);
    }

    static circle(settings: Settings, width: number, height: number) {
        const nodes = [];
        const center = new Vector2(width / 2.0, height / 2.0);
        const nNodes = 100;
        const radius = 300.0;

        for (let i = 0; i < nNodes; i++) {
            const angle = (i / nNodes) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const node = new Node(new Vector2(center.x + x, center.y + y));
            nodes.push(node);
        }

        return new Path(settings, nodes, true);
    }

    static polygon(settings: Settings, width: number, height: number) {
        const nodes = [];
        const center = new Vector2(width / 2.0, height / 2.0);
        const nEdges = 3;
        const nNodes = 100;
        const nodesPerEdge = Math.floor((nNodes - nEdges) / nEdges);
        const radius = 300.0;

        const getCornerNode = (i: number) => {
            const angle = ((i % nEdges) / nEdges) * Math.PI * 2;
            return new Node(
                new Vector2(
                    center.x + Math.cos(angle) * radius,
                    center.y + Math.sin(angle) * radius
                )
            );
        };

        for (let i = 0; i < nEdges; i++) {
            const node = getCornerNode(i);
            nodes.push(node);

            const nextCornerNode = getCornerNode(i + 1);
            const edgeVector = Vector2.sub(nextCornerNode.position, node.position);

            for (let j = 0; j < nodesPerEdge; j++) {
                const distanceTraveled = j / nodesPerEdge;
                const position = Vector2.add(node.position, Vector2.mul(edgeVector, distanceTraveled));
                nodes.push(new Node(position));
            }
        }

        return new Path(settings, nodes, true);
    }
}
