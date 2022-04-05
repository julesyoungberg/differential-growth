use crate::vec2::*;

use rstar::{RTree, AABB};

pub trait SpatialIndex {
    fn index(&mut self, points: Vec<Point2>);

    fn get_neighbors(&self, position: &Vec2, radius: f64) -> Vec<&Point2>;
}

pub struct NoIndex {
    others: Vec<Point2>,
}

impl NoIndex {
    pub fn new() -> Self {
        Self { others: vec![] }
    }
}

impl SpatialIndex for NoIndex {
    fn index(&mut self, points: Vec<Point2>) {
        self.others = points;
    }

    fn get_neighbors(&self, _position: &Vec2, _radius: f64) -> Vec<&Point2> {
        self.others.iter().collect()
    }
}

pub struct RTreeIndex {
    rtree: Option<RTree<Point2>>,
}

impl RTreeIndex {
    pub fn new() -> Self {
        Self { rtree: None }
    }
}

impl SpatialIndex for RTreeIndex {
    fn index(&mut self, points: Vec<Point2>) {
        self.rtree = Some(RTree::bulk_load(points));
    }

    fn get_neighbors(&self, position: &Vec2, radius: f64) -> Vec<&Point2> {
        let bottom_corner = *position - radius;
        let top_corner = *position + radius;
        let radius_square = AABB::from_corners(bottom_corner.as_point2(), top_corner.as_point2());
        self.rtree
            .as_ref()
            .unwrap()
            .locate_in_envelope(&radius_square)
            .into_iter()
            .collect()
    }
}

pub enum SpatialIndexType {
    None,
    RTree,
}

pub fn get_spatial_index(index_type: SpatialIndexType) -> Box<dyn SpatialIndex> {
    match index_type {
        SpatialIndexType::None => Box::new(NoIndex::new()),
        SpatialIndexType::RTree => Box::new(RTreeIndex::new()),
    }
}

pub fn index_points(points: Vec<Point2>, index_type: SpatialIndexType) -> Box<dyn SpatialIndex> {
    let mut spatial_index = get_spatial_index(index_type);
    spatial_index.index(points);
    spatial_index
}
