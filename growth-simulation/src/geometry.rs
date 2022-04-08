use crate::config::*;
use crate::vec2::*;

pub fn polygon(settings: &Settings, config: PolygonConfig) -> Vec<Vec2> {
    let mut points = vec![];
    let center = Vec2::new(settings.width as f64 / 2.0, settings.height as f64 / 2.0);

    for i in 0..config.n_sides {
        let angle = (i as f64 / config.n_sides as f64) * std::f64::consts::PI * 2.0;
        let x = angle.cos() * config.radius;
        let y = angle.sin() * config.radius;
        points.push(center + Vec2::new(x, y));
    }

    points
}
