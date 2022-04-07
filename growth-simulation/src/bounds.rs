use crate::config::*;
use crate::draw::draw_path;
use crate::vec2::*;

pub trait Bounds {
    fn contains(&self, _point: Vec2) -> bool {
        false
    }

    fn draw(&self, _ctx: &web_sys::CanvasRenderingContext2d) {}
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

#[derive(Clone, Debug)]
pub struct RectBounds {
    min_x: f64,
    min_y: f64,
    max_x: f64,
    max_y: f64,
    points: Vec<Vec2>,
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
            points: vec![
                bottom_corner.clone(),
                Vec2::new(bottom_corner.x, top_corner.y),
                top_corner.clone(),
                Vec2::new(top_corner.x, bottom_corner.y),
            ],
        }
    }
}

impl Bounds for RectBounds {
    fn contains(&self, point: Vec2) -> bool {
        point.x > self.min_x && point.x < self.max_x && point.y > self.min_y && point.y < self.max_y
    }

    fn draw(&self, ctx: &web_sys::CanvasRenderingContext2d) {
        draw_path(ctx, &self.points, true);
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

    fn draw(&self, ctx: &web_sys::CanvasRenderingContext2d) {}
}

pub fn get_bounds(config: Config) -> Box<dyn Bounds> {
    match config.bounds.bounds_type {
        BoundsType::None => Box::new(NoBounds {}),
        BoundsType::View => Box::new(ViewBounds {
            width: config.settings.width as f64,
            height: config.settings.height as f64,
        }),
        BoundsType::Rect => Box::new(RectBounds::new(
            config.settings.width as f64,
            config.settings.height as f64,
            config.bounds.rect_config.width,
            config.bounds.rect_config.height,
        )),
        BoundsType::Circle => Box::new(CircleBounds::new(
            config.settings.width as f64 / 2.0,
            config.settings.height as f64 / 2.0,
            config.bounds.circle_config.radius,
        )),
    }
}
