use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Settings {
    pub width: u32,
    pub height: u32,
    pub max_speed: f32,
    pub max_force: f32,
    pub separation_distance: f32,
    pub attraction_distance: f32,
    pub alignment_weight: f32,
    pub attraction_weight: f32,
    pub separation_weight: f32,
    pub max_edge_length: f32,
    pub min_edge_length: f32,
    pub injection_probability: f32,
}

#[wasm_bindgen]
impl Settings {
    pub fn new(width: u32, height: u32) -> Self {
        Self {
            width,
            height,
            max_speed: 1.0,
            max_force: 0.9,
            separation_distance: 10.0,
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
