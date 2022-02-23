import Vector2 from './vector2';

export default class Node {
    position: Vector2 = new Vector2();
    velocity: Vector2 = new Vector2();
    private acceleration: Vector2 = new Vector2();
    private maxSpeed = 0.5;
    private maxForce = 0.2;
    private desiredSeparation = 20.0;
    private separationWeight = 1.1;
    private alignmentWeight = 1.0;

    constructor(position?: Vector2, velocity?: Vector2) {
        if (position) {
            this.position = position;
        }

        if (velocity) {
            this.velocity = velocity;
        }
    }

    addForce(force: Vector2) {
        this.acceleration.add(force);
    }

    update() {
        this.acceleration.limit(this.maxForce);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration = new Vector2();
    }

    avoid(others: Node[]) {
        const separationForce = new Vector2();
        let nearNodes = 0;

        for (const other of others) {
            const distance = this.position.distance(other.position);

            if (distance > 0.0 && distance < this.desiredSeparation) {
                const force = Vector2.sub(this.position, other.position);
                force.normalize();
                force.div(distance);
                separationForce.add(force);
                nearNodes++;
            }
        }

        if (nearNodes > 0) {
            separationForce.div(nearNodes);
        }

        if (separationForce.length() > 0) {
            // separationForce.normalize();
            // separationForce.mul(this.maxSpeed);
            separationForce.sub(this.velocity);
            separationForce.limit(this.maxForce);
            separationForce.mul(this.separationWeight);
            this.addForce(separationForce);
        }
    }

    align(prev: Node, next: Node) {
        const target = Vector2.add(prev.position, next.position).div(2.0);
        const desiredVelocity = Vector2.sub(target, this.position);
        desiredVelocity.normalize();
        desiredVelocity.mul(this.maxSpeed);
        const steer = Vector2.sub(desiredVelocity, this.velocity);
        steer.limit(this.maxForce);
        this.addForce(steer.mul(this.alignmentWeight));
    }
}
