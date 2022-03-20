use std::ops;

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

pub type Point2 = [f64; 2];

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Deserialize, Serialize)]
pub struct Vec2 {
    pub x: f64,
    pub y: f64,
}

impl ops::Add<Vec2> for Vec2 {
    type Output = Vec2;

    fn add(self, other: Self) -> Self {
        Self {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

impl ops::AddAssign for Vec2 {
    fn add_assign(&mut self, other: Self) {
        *self = Self {
            x: self.x + other.x,
            y: self.y + other.y,
        };
    }
}

impl ops::Add<f64> for Vec2 {
    type Output = Vec2;

    fn add(self, val: f64) -> Self {
        Self {
            x: self.x + val,
            y: self.y + val,
        }
    }
}

impl ops::AddAssign<f64> for Vec2 {
    fn add_assign(&mut self, val: f64) {
        *self = Self {
            x: self.x + val,
            y: self.y + val,
        };
    }
}

impl ops::Sub for Vec2 {
    type Output = Vec2;

    fn sub(self, other: Self) -> Self {
        Self {
            x: self.x - other.x,
            y: self.y - other.y,
        }
    }
}

impl ops::SubAssign for Vec2 {
    fn sub_assign(&mut self, other: Self) {
        *self = Self {
            x: self.x - other.x,
            y: self.y - other.y,
        };
    }
}

impl ops::Sub<f64> for Vec2 {
    type Output = Vec2;

    fn sub(self, val: f64) -> Self {
        Self {
            x: self.x - val,
            y: self.y - val,
        }
    }
}

impl ops::SubAssign<f64> for Vec2 {
    fn sub_assign(&mut self, val: f64) {
        *self = Self {
            x: self.x - val,
            y: self.y - val,
        };
    }
}

impl ops::Mul<f64> for Vec2 {
    type Output = Vec2;

    fn mul(self, scale: f64) -> Self {
        Self {
            x: self.x * scale,
            y: self.y * scale,
        }
    }
}

impl ops::MulAssign<f64> for Vec2 {
    fn mul_assign(&mut self, scale: f64) {
        *self = Self {
            x: self.x * scale,
            y: self.y * scale,
        };
    }
}

impl ops::Div<f64> for Vec2 {
    type Output = Vec2;

    fn div(self, den: f64) -> Self {
        Self {
            x: self.x / den,
            y: self.y / den,
        }
    }
}

impl ops::DivAssign<f64> for Vec2 {
    fn div_assign(&mut self, den: f64) {
        *self = Self {
            x: self.x / den,
            y: self.y / den,
        };
    }
}

impl Vec2 {
    pub fn new(x: f64, y: f64) -> Self {
        Self { x, y }
    }

    pub fn from_point2(p: &Point2) -> Self {
        Self { x: p[0], y: p[1] }
    }

    pub fn length(&self) -> f64 {
        (self.x * self.x + self.y * self.y).sqrt()
    }

    pub fn normalize(&mut self) {
        let length = self.length();
        if length != 0.0 {
            *self /= length;
        }
    }

    pub fn limit(&mut self, mag: f64) {
        let length = self.length();
        if length > mag {
            *self *= mag / length;
        }
    }

    pub fn distance(&self, other: &Vec2) -> f64 {
        let diff = *self - *other;
        diff.length()
    }

    pub fn as_point2(&self) -> Point2 {
        [self.x, self.y]
    }
}

#[cfg(test)]
mod tests {
    use crate::vec2::Vec2;

    #[test]
    fn vec2_construct() {
        let v = Vec2::new(1.5, 2.0);
        assert_eq!(v.x, 1.5);
        assert_eq!(v.y, 2.0);
        let u = Vec2::new(3.14, 2.6);
        assert_eq!(u.x, 3.14);
        assert_eq!(u.y, 2.6);
    }

    #[test]
    fn vec2_add() {
        let v = Vec2::new(1.5, 2.0) + Vec2::new(2.5, 3.0);
        assert_eq!(v.x, 4.0);
        assert_eq!(v.y, 5.0);
    }

    #[test]
    fn vec2_add_assign() {
        let mut v = Vec2::new(3.0, 1.5);
        v += Vec2::new(2.0, 2.5);
        assert_eq!(v.x, 5.0);
        assert_eq!(v.y, 4.0);
    }

    #[test]
    fn vec2_add_constant() {
        let v = Vec2::new(1.5, 2.0) + 0.5;
        assert_eq!(v.x, 2.0);
        assert_eq!(v.y, 2.5);
    }

    #[test]
    fn vec2_add_assign_constant() {
        let mut v = Vec2::new(1.5, 2.0);
        v += 0.5;
        assert_eq!(v.x, 2.0);
        assert_eq!(v.y, 2.5);
    }

    #[test]
    fn vec2_sub() {
        let v = Vec2::new(3.0, 3.5) - Vec2::new(1.5, 2.0);
        assert_eq!(v.x, 1.5);
        assert_eq!(v.y, 1.5);
    }

    #[test]
    fn vec2_sub_assign() {
        let mut v = Vec2::new(2.5, 3.0);
        v -= Vec2::new(1.5, 2.0);
        assert_eq!(v.x, 1.0);
        assert_eq!(v.y, 1.0);
    }

    #[test]
    fn vec2_sub_constant() {
        let v = Vec2::new(1.5, 2.0) - 0.5;
        assert_eq!(v.x, 1.0);
        assert_eq!(v.y, 1.5);
    }

    #[test]
    fn vec2_sub_assign_constant() {
        let mut v = Vec2::new(1.5, 2.0);
        v -= 0.5;
        assert_eq!(v.x, 1.0);
        assert_eq!(v.y, 1.5);
    }

    #[test]
    fn vec2_mul() {
        let v = Vec2::new(1.5, 2.0) * 2.0;
        assert_eq!(v.x, 3.0);
        assert_eq!(v.y, 4.0);
    }

    #[test]
    fn vec2_mul_assign() {
        let mut v = Vec2::new(1.5, 2.0);
        v *= 2.0;
        assert_eq!(v.x, 3.0);
        assert_eq!(v.y, 4.0);
    }

    #[test]
    fn vec2_div() {
        let v = Vec2::new(4.0, 3.0) / 2.0;
        assert_eq!(v.x, 2.0);
        assert_eq!(v.y, 1.5);
    }

    #[test]
    fn vec2_div_assign() {
        let mut v = Vec2::new(3.0, 4.0);
        v /= 2.0;
        assert_eq!(v.x, 1.5);
        assert_eq!(v.y, 2.0);
    }

    #[test]
    fn vec2_length() {
        let v = Vec2::new(1.0, 2.0);
        let length = v.length();
        assert!(length > 2.23606 && length < 2.23607);
    }

    #[test]
    fn vec2_normalize() {
        let mut v = Vec2::new(1.0, 2.0);
        v.normalize();
        assert_eq!(v.length().round(), 1.0);
    }

    #[test]
    fn vec2_limit() {
        let mut v = Vec2::new(2.0, 1.0);
        v.limit(2.0);
        assert_eq!(v.length().round(), 2.0);
        v = Vec2::new(0.5, 0.2);
        let length = v.length();
        v.limit(2.0);
        assert_eq!(v.length().round(), length.round());
    }

    #[test]
    fn vec2_dist() {
        let v = Vec2::new(1.0, 2.0);
        let u = Vec2::new(0.0, -1.0);
        let distance = v.distance(&u);
        assert!(distance > 3.16227 && distance < 3.16228);
    }
}
