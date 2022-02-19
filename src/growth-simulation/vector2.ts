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
        return this;
    }

    sub(other: Vector2) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    mul(scale: number) {
        this.x *= scale;
        this.y *= scale;
        return this;
    }

    div(den: number) {
        this.x /= den;
        this.y /= den;
        return this;
    }

    limit(mag: number) {
        const length = this.length();
        if (length > mag) {
            this.normalize();
            this.mul(mag);
        }
        return this;
    }

    distance(other: Vector2) {
        return Vector2.sub(this, other).length();
    }

    static add(a: Vector2, b: Vector2) {
        const newVec = new Vector2(a.x, a.y);
        newVec.add(b);
        return newVec;
    }

    static sub(a: Vector2, b: Vector2) {
        const newVec = new Vector2(a.x, a.y);
        newVec.sub(b);
        return newVec;
    }
}
