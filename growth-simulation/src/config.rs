use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
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
            max_force: 0.4,
            separation_distance: 5.0,
            attraction_distance: 70.0,
            alignment_weight: 1.0,
            attraction_weight: 1.0,
            separation_weight: 1.0,
            max_edge_length: 5.0,
            min_edge_length: 1.0,
            injection_probability: 0.5,
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct RecordingConfig {
    pub recording: bool,
}

#[wasm_bindgen]
impl RecordingConfig {
    pub fn new() -> Self {
        Self { recording: false }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct PolygonConfig {
    pub n_sides: u32,
    pub radius: f64,
}

#[wasm_bindgen]
impl PolygonConfig {
    pub fn new() -> Self {
        Self {
            n_sides: 200,
            radius: 300.0,
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum InitializationType {
    HorizontalLine,
    VerticalLine,
    Polygon,
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct InitializationConfig {
    pub init_type: InitializationType,
    pub polygon_config: Option<PolygonConfig>,
}

#[wasm_bindgen]
impl InitializationConfig {
    pub fn new() -> Self {
        Self {
            init_type: InitializationType::Polygon,
            polygon_config: Some(PolygonConfig::new()),
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Config {
    pub settings: Settings,
    pub initialization: InitializationConfig,
    pub recording: RecordingConfig,
}

#[wasm_bindgen]
impl Config {
    pub fn new(width: u32, height: u32) -> Self {
        Self {
            settings: Settings::new(width, height),
            initialization: InitializationConfig::new(),
            recording: RecordingConfig::new(),
        }
    }
}
