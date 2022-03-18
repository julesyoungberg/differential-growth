use std::vec::Vec;

use rstar::RTree;
use wasm_bindgen::prelude::*;

use crate::node::Node;
use crate::settings::Settings;
use crate::vec2::{Point2, Vec2};

#[wasm_bindgen]
#[derive(Clone, Debug, PartialEq)]
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

    fn grow(&mut self, settings: &Settings) {
        let n_nodes = self.nodes.len();

        for i in 0..n_nodes {
            let index = n_nodes - i - 1;
            let neighbors = self.get_neighbor_nodes(index);

            if let Some(prev_node) = neighbors.prev_node {
                if let Some(next_node) = neighbors.next_node {
                    if prev_node.distance(&self.nodes[i]) > settings.max_edge_length {
                        let position = (prev_node.position + next_node.position) / 2.0;
                        let new_node = Node::new_with_position(position);

                        if i == 0 {
                            self.nodes.push(new_node);
                        } else {
                            self.nodes.splice(i - 1..i, vec![new_node]);
                        }
                    }
                }
            }
        }
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

    pub fn horizontal(settings: &Settings) -> Self {
        let mut nodes = vec![];
        let y = settings.height as f32 / 2.0;
        let n_nodes = (settings.width as f32 / settings.max_edge_length).round() as u32;

        for i in 0..n_nodes {
            let x = (i as f32 / (n_nodes - 1) as f32) * settings.width as f32;
            let node = Node::new_with_position(Vec2::new(x, y));
            nodes.push(node);
        }

        Self::new(nodes, false)
    }

    pub fn vertical(settings: &Settings) -> Self {
        let mut nodes = vec![];
        let x = settings.width as f32 / 2.0;
        let n_nodes = (settings.height as f32 / settings.max_edge_length).round() as u32;

        for i in 0..n_nodes {
            let y = (i as f32 / (n_nodes - 1) as f32) * settings.height as f32;
            let node = Node::new_with_position(Vec2::new(x, y));
            nodes.push(node);
        }

        Self::new(nodes, false)
    }

    // pub fn circle(settings: &Settings, n_nodes: u32, radius: f32) -> Self {
    //     let mut nodes = vec![];
    //     let
    // }
}
