import Vector2 from './vector2';
import { Settings } from './settings';

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

    distance(other: Node) {
        return this.position.distance(other.position);
    }

    addForce(force: Vector2) {
        this.acceleration.add(force);
    }

    update(settings: Settings) {
        this.acceleration.limit(settings.maxForce);
        this.velocity.add(this.acceleration);
        this.velocity.limit(settings.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration = new Vector2();
    }

    attract(others: Node[], settings: Settings) {
        const attractionForce = new Vector2();
        let nearNodes = 0;

        for (const other of others) {
            const distance = this.distance(other);

            if (distance > 0.0 && distance < settings.attractionDistance) {
                const force = Vector2.sub(other.position, this.position);
                force.normalize();
                force.div(distance);
                attractionForce.add(force);
                nearNodes++;
            }
        }

        if (nearNodes > 0) {
            attractionForce.div(nearNodes);
        }

        if (attractionForce.length() > 0) {
            // separationForce.normalize();
            // separationForce.mul(this.maxSpeed);
            attractionForce.sub(this.velocity);
            attractionForce.limit(settings.maxForce);
            attractionForce.mul(settings.attractionWeight);
            this.addForce(attractionForce);
        }
    }

    avoid(others: Node[], settings: Settings) {
        const separationForce = new Vector2();
        let nearNodes = 0;

        for (const other of others) {
            const distance = this.distance(other);

            if (distance > 0.0 && distance < settings.separationDistance) {
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
            separationForce.limit(settings.maxForce);
            separationForce.mul(settings.separationWeight);
            this.addForce(separationForce);
        }
    }

    align(prev: Node, next: Node, settings: Settings) {
        const target = Vector2.add(prev.position, next.position).div(2.0);
        const desiredVelocity = Vector2.sub(target, this.position);
        desiredVelocity.normalize();
        desiredVelocity.mul(settings.maxSpeed);
        const steer = Vector2.sub(desiredVelocity, this.velocity);
        steer.limit(settings.maxForce);
        this.addForce(steer.mul(settings.alignmentWeight));
    }
}
