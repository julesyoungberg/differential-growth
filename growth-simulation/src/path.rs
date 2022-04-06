use std::vec::Vec;

use rand::prelude::*;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use crate::bounds::*;
use crate::config::{PolygonConfig, Settings};
use crate::node::Node;
use crate::spatial_index::*;
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

    fn get_prev_node(&self, index: usize) -> Option<Node> {
        if index > 0 {
            Some(self.nodes[index - 1])
        } else if self.cyclic {
            Some(self.nodes[self.nodes.len() - 1])
        } else {
            None
        }
    }

    fn get_next_node(&self, index: usize) -> Option<Node> {
        if index < self.nodes.len() - 1 {
            Some(self.nodes[index + 1])
        } else if self.cyclic {
            Some(self.nodes[0])
        } else {
            None
        }
    }

    fn get_neighbor_nodes(&self, index: usize) -> NeighborNodes {
        NeighborNodes {
            next_node: self.get_next_node(index),
            prev_node: self.get_prev_node(index),
        }
    }

    fn grow(&mut self, settings: &Settings) -> bool {
        let n_nodes = self.nodes.len();
        let mut new_nodes = false;

        for i in 0..n_nodes {
            let index = n_nodes - i - 1;

            if let Some(prev_node) = self.get_prev_node(index) {
                if prev_node.distance(&self.nodes[index]) > settings.max_edge_length {
                    let position = (self.nodes[index].position + prev_node.position) / 2.0;
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

        new_nodes
    }

    fn prune(&mut self, settings: &Settings) {
        for index in 0..self.nodes.len() {
            if index >= self.nodes.len() {
                continue;
            }

            if let Some(prev_node) = self.get_prev_node(index) {
                if prev_node.distance(&self.nodes[index]) < settings.min_edge_length {
                    self.nodes.splice(index..index + 1, vec![]);
                }
            }
        }
    }

    fn inject_random_nodes(&mut self, settings: &Settings) {
        let mut rng = rand::thread_rng();
        let x: f64 = rng.gen();
        if x > settings.injection_probability {
            return;
        }

        let index = rng.gen_range(1..self.nodes.len() - 1);

        if let Some(prev_node) = self.get_prev_node(index) {
            let new_node =
                Node::new_with_position((prev_node.position + self.nodes[index].position) / 2.0);

            if index == 0 {
                self.nodes.push(new_node);
            } else {
                self.nodes.splice(index..index, vec![new_node]);
            }
        }
    }

    pub fn update(
        &mut self,
        settings: &Settings,
        spatial_index: &Box<dyn SpatialIndex>,
        bounds: &Box<dyn Bounds>,
    ) {
        for index in 0..self.nodes.len() {
            if self.nodes[index].fixed {
                continue;
            }

            let neighbors = self.get_neighbor_nodes(index);
            let node = &mut self.nodes[index];

            if let Some(prev_node) = neighbors.prev_node {
                if let Some(next_node) = neighbors.next_node {
                    node.align(&prev_node, &next_node, settings);
                }
            }

            // node.attract(settings, rtree);
            node.avoid(settings, spatial_index);

            node.update(settings);

            if !bounds.contains(node.position) {
                node.fixed = true;
            }
        }

        self.grow(settings);
        self.prune(settings);
        self.inject_random_nodes(settings);
    }

    pub fn node_positions(&self) -> Vec<Vec2> {
        self.nodes.iter().map(|n| n.position).collect()
    }

    pub fn node_points(&self) -> Vec<Point2> {
        self.nodes.iter().map(|n| n.position.as_point2()).collect()
    }

    pub fn preprocess(&mut self, settings: &Settings) {
        let mut has_grown = true;
        while has_grown {
            has_grown = self.grow(settings);
        }
    }

    pub fn draw(&self, ctx: &web_sys::CanvasRenderingContext2d) {
        ctx.save();
        ctx.begin_path();
        ctx.set_line_width(1.0);
        ctx.set_stroke_style(&"#ffffff".into());

        for (index, node) in self.nodes.iter().enumerate() {
            if let Some(prev_node) = self.get_prev_node(index) {
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

#[cfg(test)]
mod tests {
    use crate::path::*;

    #[test]
    fn path_get_prev_node() {
        let nodes = vec![
            Node::new_with_position(Vec2::new(0.0, 0.0)),
            Node::new_with_position(Vec2::new(1.0, 1.0)),
            Node::new_with_position(Vec2::new(2.0, 2.0)),
        ];

        let basic_path = Path::new(nodes.clone(), false);
        let cyclic_path = Path::new(nodes.clone(), true);

        assert_eq!(basic_path.get_prev_node(0), None);
        assert_eq!(cyclic_path.get_prev_node(0), Some(nodes[2]));

        assert_eq!(basic_path.get_prev_node(1), Some(nodes[0]));
        assert_eq!(cyclic_path.get_prev_node(1), Some(nodes[0]));

        assert_eq!(basic_path.get_prev_node(2), Some(nodes[1]));
        assert_eq!(cyclic_path.get_prev_node(2), Some(nodes[1]));
    }

    #[test]
    fn path_get_next_node() {
        let nodes = vec![
            Node::new_with_position(Vec2::new(0.0, 0.0)),
            Node::new_with_position(Vec2::new(1.0, 1.0)),
            Node::new_with_position(Vec2::new(2.0, 2.0)),
        ];

        let basic_path = Path::new(nodes.clone(), false);
        let cyclic_path = Path::new(nodes.clone(), true);

        assert_eq!(basic_path.get_next_node(0), Some(nodes[1]));
        assert_eq!(cyclic_path.get_next_node(0), Some(nodes[1]));

        assert_eq!(basic_path.get_next_node(1), Some(nodes[2]));
        assert_eq!(cyclic_path.get_next_node(1), Some(nodes[2]));

        assert_eq!(basic_path.get_next_node(2), None);
        assert_eq!(cyclic_path.get_next_node(2), Some(nodes[0]));
    }

    #[test]
    fn path_get_neighbor_nodes() {
        let nodes = vec![
            Node::new_with_position(Vec2::new(0.0, 0.0)),
            Node::new_with_position(Vec2::new(1.0, 1.0)),
            Node::new_with_position(Vec2::new(2.0, 2.0)),
        ];

        let path = Path::new(nodes.clone(), false);
        let neighbors = path.get_neighbor_nodes(1);

        assert_eq!(neighbors.prev_node, Some(nodes[0]));
        assert_eq!(neighbors.next_node, Some(nodes[2]));
    }

    #[test]
    fn path_grow() {
        let mut settings = Settings::new(100, 100);
        settings.max_edge_length = 0.5;

        let nodes = vec![
            Node::new_with_position(Vec2::new(0.0, 0.0)),
            Node::new_with_position(Vec2::new(1.0, 0.0)),
            Node::new_with_position(Vec2::new(1.0, 0.4)),
        ];

        let mut basic_path = Path::new(nodes.clone(), false);
        let mut cyclic_path = Path::new(nodes, true);

        assert_eq!(basic_path.grow(&settings), true);
        assert_eq!(cyclic_path.grow(&settings), true);

        let basic_points = basic_path.node_positions();
        let cyclic_points = cyclic_path.node_positions();

        assert_eq!(basic_points.len(), 4);
        assert_eq!(cyclic_points.len(), 5);

        assert_eq!(basic_points[0], Vec2::new(0.0, 0.0));
        assert_eq!(cyclic_points[0], Vec2::new(0.0, 0.0));

        assert_eq!(basic_points[1], Vec2::new(0.5, 0.0));
        assert_eq!(cyclic_points[1], Vec2::new(0.5, 0.0));

        assert_eq!(basic_points[2], Vec2::new(1.0, 0.0));
        assert_eq!(cyclic_points[2], Vec2::new(1.0, 0.0));

        assert_eq!(basic_points[3], Vec2::new(1.0, 0.4));
        assert_eq!(cyclic_points[3], Vec2::new(1.0, 0.4));

        assert_eq!(cyclic_points[4], Vec2::new(0.5, 0.2));
    }

    #[test]
    fn path_grow_no_growth() {
        let mut settings = Settings::new(100, 100);
        settings.max_edge_length = 1.0;

        let nodes = vec![
            Node::new_with_position(Vec2::new(0.0, 0.0)),
            Node::new_with_position(Vec2::new(1.0, 0.0)),
            Node::new_with_position(Vec2::new(0.5, 0.5)),
        ];

        let mut path = Path::new(nodes, true);

        assert_eq!(path.grow(&settings), false);

        assert_eq!(path.node_positions().len(), 3);
    }

    #[test]
    fn path_prune() {
        let mut settings = Settings::new(100, 100);
        settings.min_edge_length = 1.0;

        let nodes = vec![
            Node::new_with_position(Vec2::new(0.0, 0.0)),
            Node::new_with_position(Vec2::new(0.5, 0.5)),
            Node::new_with_position(Vec2::new(1.0, 1.0)),
            Node::new_with_position(Vec2::new(0.0, -0.5)),
        ];

        let mut basic_path = Path::new(nodes.clone(), false);
        let mut cyclic_path = Path::new(nodes, true);

        basic_path.prune(&settings);
        cyclic_path.prune(&settings);

        let basic_points = basic_path.node_positions();
        let cyclic_points = cyclic_path.node_positions();

        assert_eq!(basic_points.len(), 3);
        assert_eq!(cyclic_points.len(), 2);

        assert_eq!(basic_points[0], Vec2::new(0.0, 0.0));
        assert_eq!(cyclic_points[0], Vec2::new(0.5, 0.5));

        assert_eq!(basic_points[1], Vec2::new(1.0, 1.0));
        assert_eq!(cyclic_points[1], Vec2::new(0.0, -0.5));

        assert_eq!(basic_points[2], Vec2::new(0.0, -0.5));
    }
}
