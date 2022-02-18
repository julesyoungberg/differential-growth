export default class Vector2 {
    x: number = 0;
    y: number = 0;

    constructor(x?: number, y?: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const length = this.length();
        if (length !== 0) {
            this.x /= length;
            this.y /= length;
        }
    }

    add(other: Vector2) {
        this.x += other.x;
        this.y += other.y;
    }

    subtract(other: Vector2) {
        this.x -= other.x;
        this.y -= other.y;
    }
}
