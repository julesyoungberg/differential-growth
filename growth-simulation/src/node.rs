use rstar::{RTree, AABB};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::config::Settings;
use crate::vec2::{Point2, Vec2};

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Deserialize, Serialize)]
pub struct Node {
    pub position: Vec2,
    pub velocity: Vec2,
    pub acceleration: Vec2,
    pub fixed: bool,
}

impl Default for Node {
    fn default() -> Self {
        Self::new()
    }
}

#[derive(Clone, Copy, Debug)]
enum InteractionType {
    Attract,
    Avoid,
}

impl Node {
    pub fn new() -> Self {
        Self {
            position: Vec2::new(0.0, 0.0),
            velocity: Vec2::new(0.0, 0.0),
            acceleration: Vec2::new(0.0, 0.0),
            fixed: false,
        }
    }

    pub fn new_with_position(position: Vec2) -> Self {
        Self {
            position,
            velocity: Vec2::new(0.0, 0.0),
            acceleration: Vec2::new(0.0, 0.0),
            fixed: false,
        }
    }

    pub fn new_with_position_and_velocity(position: Vec2, velocity: Vec2) -> Self {
        Self {
            position,
            velocity,
            acceleration: Vec2::new(0.0, 0.0),
            fixed: false,
        }
    }

    pub fn distance(&self, other: &Node) -> f64 {
        self.position.distance(&other.position)
    }

    pub fn add_force(&mut self, force: Vec2) {
        self.acceleration += force;
    }

    pub fn update(&mut self, settings: &Settings) {
        self.velocity += self.acceleration;
        self.velocity.limit(settings.max_speed);
        self.position += self.velocity;
        self.acceleration *= 0.0;
    }

    fn interact(
        &mut self,
        settings: &Settings,
        rtree: &RTree<Point2>,
        interaction_type: InteractionType,
    ) {
        let mut total_force = Vec2::new(0.0, 0.0);
        let mut near_nodes = 0;

        let radius = match interaction_type {
            InteractionType::Attract => settings.attraction_distance,
            InteractionType::Avoid => settings.separation_distance,
        };

        let others = self.get_neighbors(rtree, radius);

        for o in others {
            let other_pos = Vec2::from_point2(o);
            let distance = self.position.distance(&other_pos);

            if distance > 0.0 && distance < radius {
                let mut force = match interaction_type {
                    InteractionType::Attract => other_pos - self.position,
                    InteractionType::Avoid => self.position - other_pos,
                };
                force.normalize();
                force /= distance;
                total_force += force;
                near_nodes += 1;
            }
        }

        if near_nodes > 0 {
            total_force /= near_nodes as f64;
        }

        if total_force.length() > 0.0 {
            total_force.normalize();
            total_force *= settings.max_speed;
            total_force -= self.velocity;
            total_force.limit(settings.max_force);

            total_force *= match interaction_type {
                InteractionType::Attract => settings.attraction_weight,
                InteractionType::Avoid => settings.separation_weight,
            };

            self.add_force(total_force);
        }
    }

    pub fn attract(&mut self, settings: &Settings, rtree: &RTree<Point2>) {
        self.interact(settings, rtree, InteractionType::Attract);
    }

    pub fn avoid(&mut self, settings: &Settings, rtree: &RTree<Point2>) {
        self.interact(settings, rtree, InteractionType::Avoid);
    }

    pub fn align(&mut self, prev: &Node, next: &Node, settings: &Settings) {
        let target = (prev.position + next.position) / 2.0;
        let mut desired_velocity = target - self.position;
        desired_velocity.normalize();
        desired_velocity *= settings.max_speed;
        let mut steer = desired_velocity - self.velocity;
        steer.limit(settings.max_force);
        steer *= settings.alignment_weight;
        self.add_force(steer);
    }

    fn get_neighbors<'a>(&self, rtree: &'a RTree<Point2>, radius: f64) -> Vec<&'a Point2> {
        let bottom_corner = self.position - radius;
        let top_corner = self.position + radius;
        let radius_square = AABB::from_corners(bottom_corner.as_point2(), top_corner.as_point2());
        rtree
            .locate_in_envelope(&radius_square)
            .into_iter()
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use crate::config::Settings;
    use crate::node::Node;
    use crate::vec2::Vec2;

    #[test]
    fn node_new() {
        let node = Node::new();
        assert_eq!(node.position.x, 0.0);
        assert_eq!(node.position.y, 0.0);
        assert_eq!(node.velocity.x, 0.0);
        assert_eq!(node.velocity.y, 0.0);
        assert_eq!(node.acceleration.x, 0.0);
        assert_eq!(node.acceleration.y, 0.0);
    }

    #[test]
    fn node_new_with_position() {
        let position = Vec2::new(1.3, 2.75);
        let node = Node::new_with_position(position);
        assert_eq!(node.position.x, position.x);
        assert_eq!(node.position.y, position.y);
    }

    #[test]
    fn node_new_with_position_and_velocity() {
        let position = Vec2::new(1.5, 2.6);
        let velocity = Vec2::new(3.2, -1.6);
        let node = Node::new_with_position_and_velocity(position, velocity);
        assert_eq!(node.position.x, position.x);
        assert_eq!(node.position.y, position.y);
        assert_eq!(node.velocity.x, velocity.x);
        assert_eq!(node.velocity.y, velocity.y);
    }

    #[test]
    fn node_distance() {
        let node1 = Node::new_with_position(Vec2::new(1.0, 2.0));
        let node2 = Node::new_with_position(Vec2::new(2.0, -1.0));
        let distance = node1.distance(&node2);
        assert!(distance > 3.16227 && distance < 3.16228);
    }

    #[test]
    fn node_add_force() {
        let mut node = Node::new();
        node.add_force(Vec2::new(1.0, 2.0));
        node.add_force(Vec2::new(2.0, -1.0));
        assert_eq!(node.acceleration.x, 3.0);
        assert_eq!(node.acceleration.y, 1.0);
    }

    #[test]
    fn node_update() {
        let mut node =
            Node::new_with_position_and_velocity(Vec2::new(-2.0, 2.0), Vec2::new(1.0, -1.0));
        node.add_force(Vec2::new(1.0, 2.0));
        node.add_force(Vec2::new(2.0, -1.0));
        let settings = Settings::new(100, 100);
        node.update(&settings);
        assert_eq!(node.position.x, 2.0);
        assert_eq!(node.position.y, 2.0);
        assert_eq!(node.velocity.x, 4.0);
        assert_eq!(node.velocity.y, 0.0);
        assert_eq!(node.acceleration.x, 0.0);
        assert_eq!(node.acceleration.y, 0.0);
    }
}
