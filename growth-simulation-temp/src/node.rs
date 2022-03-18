use rstar::{RTree, AABB};
use wasm_bindgen::prelude::*;

use crate::settings::Settings;
use crate::vec2::{Point2, Vec2};

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Node {
    pub position: Vec2,
    pub velocity: Vec2,
    acceleration: Vec2,
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
        }
    }

    pub fn new_with_position(position: Vec2) -> Self {
        Self {
            position,
            velocity: Vec2::new(0.0, 0.0),
            acceleration: Vec2::new(0.0, 0.0),
        }
    }

    pub fn new_with_position_and_velocity(position: Vec2, velocity: Vec2) -> Self {
        Self {
            position,
            velocity,
            acceleration: Vec2::new(0.0, 0.0),
        }
    }

    pub fn distance(&self, other: &Node) -> f32 {
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
            total_force /= near_nodes as f32;
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

    fn get_neighbors<'a>(&self, rtree: &'a RTree<Point2>, radius: f32) -> Vec<&'a Point2> {
        let bottom_corner = self.position - radius;
        let top_corner = self.position + radius;
        let radius_square = AABB::from_corners(bottom_corner.as_point2(), top_corner.as_point2());
        rtree
            .locate_in_envelope(&radius_square)
            .into_iter()
            .collect()
    }
}
