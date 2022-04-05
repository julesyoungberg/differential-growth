use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Serialize, Deserialize)]
pub struct Settings {
    pub width: u32,
    pub height: u32,
    pub max_speed: f64,
    pub max_force: f64,
    pub separation_distance: f64,
    pub attraction_distance: f64,
    pub alignment_weight: f64,
    pub attraction_weight: f64,
    pub separation_weight: f64,
    pub max_edge_length: f64,
    pub min_edge_length: f64,
    pub injection_probability: f64,
}

#[wasm_bindgen]
impl Settings {
    pub fn new(width: u32, height: u32) -> Self {
        Self {
            width,
            height,
            max_speed: 1.0,
            max_force: 0.6,
            separation_distance: 50.0,
            attraction_distance: 70.0,
            alignment_weight: 1.5,
            attraction_weight: 1.0,
            separation_weight: 1.01,
            max_edge_length: 5.0,
            min_edge_length: 1.0,
            injection_probability: 0.5,
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Serialize, Deserialize)]
pub struct RecordingConfig {
    pub recording: bool,
}

#[wasm_bindgen]
impl RecordingConfig {
    pub fn new() -> Self {
        Self { recording: false }
    }
}

impl Default for RecordingConfig {
    fn default() -> Self {
        Self::new()
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Serialize, Deserialize)]
pub struct PolygonConfig {
    pub n_sides: u32,
    pub radius: f64,
}

#[wasm_bindgen]
impl PolygonConfig {
    pub fn new() -> Self {
        Self {
            n_sides: 50,
            radius: 100.0,
        }
    }
}

impl Default for PolygonConfig {
    fn default() -> Self {
        Self::new()
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Serialize, Deserialize)]
pub enum InitializationType {
    HorizontalLine,
    VerticalLine,
    Polygon,
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Serialize, Deserialize)]
pub struct InitializationConfig {
    pub init_type: InitializationType,
    pub polygon_config: PolygonConfig,
}

#[wasm_bindgen]
impl InitializationConfig {
    pub fn new() -> Self {
        Self {
            init_type: InitializationType::Polygon,
            polygon_config: PolygonConfig::new(),
        }
    }
}

impl Default for InitializationConfig {
    fn default() -> Self {
        Self::new()
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Serialize, Deserialize)]
pub struct RectConfig {
    pub width: f64,
    pub height: f64,
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Serialize, Deserialize)]
pub struct CircleConfig {
    pub radius: f64,
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Serialize, Deserialize)]
pub enum BoundsType {
    None,
    View,
    Rect,
    Circle,
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Serialize, Deserialize)]
pub struct BoundsConfig {
    pub bounds_type: BoundsType,
    pub rect_config: RectConfig,
    pub circle_config: CircleConfig,
}

impl BoundsConfig {
    pub fn new() -> Self {
        Self {
            bounds_type: BoundsType::View,
            rect_config: RectConfig {
                width: 100.0,
                height: 100.0,
            },
            circle_config: CircleConfig { radius: 100.0 },
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Serialize, Deserialize)]
pub struct Config {
    pub settings: Settings,
    pub initialization: InitializationConfig,
    pub bounds: BoundsConfig,
    pub recording: RecordingConfig,
}

#[wasm_bindgen]
impl Config {
    pub fn new(width: u32, height: u32) -> Self {
        Self {
            settings: Settings::new(width, height),
            initialization: InitializationConfig::new(),
            bounds: BoundsConfig::new(),
            recording: RecordingConfig::new(),
        }
    }
}
