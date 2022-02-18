import Vector2 from './vector2';

export default class Line {
    points: Vector2[] = [];

    constructor(points?: Vector2[]) {
        this.points = points || [];
    }
}
