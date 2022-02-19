import RBush from 'rbush';
// import knn from 'rbush-knn';

import Node from './node';
import Path from './path';

export type RBushItem = {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    node: Node;
};

function rbushItemFromNode(node: Node) {
    return {
        minX: node.position.x,
        minY: node.position.y,
        maxX: node.position.x,
        maxY: node.position.y,
        node,
    };
}

export default class MyRBush extends RBush<RBushItem> {
    insertNode(node: Node)  {
        super.insert(rbushItemFromNode(node));
    }

    insertPaths(paths: Path[]) {
        for (const path of paths) {
            for (const node of path.nodes) {
                this.insertNode(node);
            }
        }
    }
}
