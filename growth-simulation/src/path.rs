use std::vec::Vec;

use rstar::RTree;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use wasm_bindgen_test::console_log;

use crate::config::{PolygonConfig, Settings};
use crate::node::Node;
use crate::vec2::{Point2, Vec2};

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct Path {
    cyclic: bool,
    nodes: Vec<Node>,
}

#[derive(Clone, Copy, Debug, PartialEq)]
struct NeighborNodes {
    prev_node: Option<Node>,
    next_node: Option<Node>,
}

impl Path {
    pub fn new(nodes: Vec<Node>, cyclic: bool) -> Self {
        Self { cyclic, nodes }
    }

    fn get_neighbor_nodes(&self, index: usize) -> NeighborNodes {
        let mut neighbor_nodes = NeighborNodes {
            prev_node: None,
            next_node: None,
        };

        if index > 0 {
            neighbor_nodes.prev_node = Some(self.nodes[index - 1].clone());
        } else if self.cyclic {
            neighbor_nodes.prev_node = Some(self.nodes[self.nodes.len() - 1].clone());
        }

        if index < self.nodes.len() - 1 {
            neighbor_nodes.next_node = Some(self.nodes[index + 1].clone());
        } else if self.cyclic {
            neighbor_nodes.next_node = Some(self.nodes[0].clone());
        }

        neighbor_nodes
    }

    fn grow(&mut self, settings: &Settings) -> bool {
        let n_nodes = self.nodes.len();
        let mut new_nodes = false;

        // console_log!("N NODES: {}", n_nodes);

        for i in 0..n_nodes {
            let index = n_nodes - i - 1;
            let neighbors = self.get_neighbor_nodes(index);

            if let Some(prev_node) = neighbors.prev_node {
                if let Some(next_node) = neighbors.next_node {
                    if next_node.distance(&self.nodes[index]) > settings.max_edge_length {
                        // console_log!("NEW NODE AT INDEX: {}", index);
                        let position = (prev_node.position + next_node.position) / 2.0;
                        let new_node = Node::new_with_position(position);
                        new_nodes = true;

                        if index == 0 {
                            self.nodes.push(new_node);
                        } else {
                            self.nodes.splice(index..index, vec![new_node]);
                        }
                    }
                }
            }
        }

        new_nodes
    }

    fn prune(&mut self, settings: &Settings) {
        for index in 0..self.nodes.len() {
            if index >= self.nodes.len() {
                continue;
            }

            let neighbors = self.get_neighbor_nodes(index);

            if let Some(prev_node) = neighbors.prev_node {
                if prev_node.distance(&self.nodes[index]) < settings.min_edge_length {
                    self.nodes.splice(index..index + 1, vec![]);
                }
            }
        }
    }

    pub fn update(&mut self, settings: &Settings, rtree: &RTree<Point2>) {
        for index in 0..self.nodes.len() {
            let neighbors = self.get_neighbor_nodes(index);
            let node = &mut self.nodes[index];

            if let Some(prev_node) = neighbors.prev_node {
                if let Some(next_node) = neighbors.next_node {
                    node.align(&prev_node, &next_node, settings);
                }
            }

            // node.attract(settings, rtree);
            node.avoid(settings, rtree);

            /* @todo apply bounds */

            node.update(settings);
        }

        self.grow(settings);
        self.prune(settings);

        /* @todo inject random nodes */
    }

    pub fn node_positions(&self) -> Vec<Vec2> {
        self.nodes.iter().map(|n| n.position.clone()).collect()
    }

    pub fn node_points(&self) -> Vec<Point2> {
        self.nodes.iter().map(|n| n.position.as_point2()).collect()
    }

    pub fn preprocess(&mut self, settings: &Settings) {
        console_log!("PREPROCESS");
        let mut has_grown = true;
        while has_grown {
            has_grown = self.grow(settings);
            console_log!("has_grown: {}", has_grown);
        }
    }

    pub fn draw(&self, ctx: &web_sys::CanvasRenderingContext2d) {
        ctx.save();
        ctx.begin_path();
        ctx.set_line_width(1.0);
        ctx.set_stroke_style(&"#ffffff".into());

        for (index, node) in self.nodes.iter().enumerate() {
            let neighbors = self.get_neighbor_nodes(index);

            if let Some(prev_node) = neighbors.prev_node {
                ctx.move_to(prev_node.position.x, prev_node.position.y);
                ctx.line_to(node.position.x, node.position.y);
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    pub fn horizontal(settings: &Settings) -> Self {
        let mut nodes = vec![];
        let y = settings.height as f64 / 2.0;
        let n_nodes = (settings.width as f64 / settings.max_edge_length).round() as u32;

        for i in 0..n_nodes {
            let x = (i as f64 / (n_nodes - 1) as f64) * settings.width as f64;
            let node = Node::new_with_position(Vec2::new(x, y));
            nodes.push(node);
        }

        Self::new(nodes, false)
    }

    pub fn vertical(settings: &Settings) -> Self {
        let mut nodes = vec![];
        let x = settings.width as f64 / 2.0;
        let n_nodes = (settings.height as f64 / settings.max_edge_length).round() as u32;

        for i in 0..n_nodes {
            let y = (i as f64 / (n_nodes - 1) as f64) * settings.height as f64;
            let node = Node::new_with_position(Vec2::new(x, y));
            nodes.push(node);
        }

        Self::new(nodes, false)
    }

    pub fn polygon(settings: &Settings, config: PolygonConfig) -> Self {
        let mut nodes = vec![];
        let center = Vec2::new(settings.width as f64 / 2.0, settings.height as f64 / 2.0);

        for i in 0..config.n_sides {
            let angle = (i as f64 / config.n_sides as f64) * std::f64::consts::PI * 2.0;
            let x = angle.cos() * config.radius;
            let y = angle.sin() * config.radius;
            let node = Node::new_with_position(center + Vec2::new(x, y));
            nodes.push(node);
        }

        Self::new(nodes, true)
    }
}
