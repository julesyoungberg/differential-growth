import Vector2 from "./vector2";

export default class Node {
    position: Vector2 = new Vector2();
    velocity: Vector2 = new Vector2();
    private acceleration: Vector2 = new Vector2();

    constructor(position?: Vector2, velocity?: Vector2) {
        if (position) {
            this.position = position;
        }

        if (velocity) {
            this.velocity = velocity;
        }
    }
}
