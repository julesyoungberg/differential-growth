use crate::vec2::*;

pub trait Bounds {
    fn contains(&self, _point: Vec2) -> bool {
        false
    }
}

#[derive(Copy, Clone, Debug)]
pub struct NoBounds {}

impl Bounds for NoBounds {}

#[derive(Copy, Clone, Debug)]
pub struct ViewBounds {
    pub width: f64,
    pub height: f64,
}

impl Bounds for ViewBounds {
    fn contains(&self, point: Vec2) -> bool {
        point.x > 0.0 && point.x < self.width && point.y > 0.0 && point.y < self.height
    }
}

#[derive(Copy, Clone, Debug)]
pub struct RectBounds {
    min_x: f64,
    min_y: f64,
    max_x: f64,
    max_y: f64,
}

impl RectBounds {
    pub fn new(width: f64, height: f64, view_width: f64, view_height: f64) -> Self {
        let view_center = Vec2::new(width, height) / 2.0;
        let rect_center = Vec2::new(view_width, view_height) / 2.0;
        let bottom_corner = view_center - rect_center;
        let top_corner = view_center + rect_center;

        Self {
            min_x: bottom_corner.x,
            min_y: bottom_corner.y,
            max_x: top_corner.x,
            max_y: top_corner.y,
        }
    }
}

impl Bounds for RectBounds {
    fn contains(&self, point: Vec2) -> bool {
        point.x > self.min_x && point.x < self.max_x && point.y > self.min_y && point.y < self.max_y
    }
}

#[derive(Copy, Clone, Debug)]
pub struct CircleBounds {
    center: Vec2,
    radius: f64,
}

impl CircleBounds {
    pub fn new(center_x: f64, center_y: f64, radius: f64) -> Self {
        Self {
            center: Vec2::new(center_x, center_y),
            radius,
        }
    }
}

impl Bounds for CircleBounds {
    fn contains(&self, point: Vec2) -> bool {
        let diff = self.center - point;
        diff.length() < self.radius
    }
}
