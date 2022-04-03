use crate::vec2::*;

use rstar::{RTree, AABB};

pub trait SpatialIndex {
    fn get_neighbors(&self, position: &Vec2, radius: f64) -> Vec<&Point2>;
}

// pub struct NoIndex {
//     others: Vec<Point2>,
// }

// impl SpatialIndex for NoIndex {}

pub struct RTreeIndex {
    rtree: RTree<Point2>,
}

impl RTreeIndex {
    pub fn index(points: Vec<Point2>) -> Self {
        Self {
            rtree: RTree::bulk_load(points),
        }
    }
}

impl SpatialIndex for RTreeIndex {
    fn get_neighbors(&self, position: &Vec2, radius: f64) -> Vec<&Point2> {
        let bottom_corner = *position - radius;
        let top_corner = *position + radius;
        let radius_square = AABB::from_corners(bottom_corner.as_point2(), top_corner.as_point2());
        self.rtree
            .locate_in_envelope(&radius_square)
            .into_iter()
            .collect()
    }
}
