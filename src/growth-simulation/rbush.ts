import RBush from 'rbush';

import Node from './node';
import Vector2 from './vector2';

export type RBushItem = {
    x: number;
    y: number;
    node: Node;
};

function rbushItemFromNode(node: Node) {
    return {
        x: node.position.x,
        y: node.position.y,
        node,
    };
}

type Path = { nodes: Node[] };

export default class MyRBush extends RBush<RBushItem> {
    toBBox(item: RBushItem) {
        return { minX: item.x, minY: item.y, maxX: item.x, maxY: item.y };
    }

    compareMinX(a: RBushItem, b: RBushItem) {
        return a.x - b.x;
    }

    compareMinY(a: RBushItem, b: RBushItem) {
        return a.y - b.y;
    }

    insertNodes(nodes: Node[]) {
        this.load(nodes.map(rbushItemFromNode));
    }

    insertPaths(paths: Path[]) {
        const items = paths.reduce((acc: RBushItem[], path: Path) => {
            return acc.concat(path.nodes.map(rbushItemFromNode));
        }, []);

        this.load(items);
    }

    searchNear(point: Vector2, radius = 50) {
        const minX = Math.min(point.x - radius, point.x + radius);
        const maxX = Math.max(point.x - radius, point.x + radius);
        const minY = Math.min(point.y - radius, point.y + radius);
        const maxY = Math.max(point.y - radius, point.y + radius);
        return this.search({ minX, minY, maxX, maxY });
    }
}
