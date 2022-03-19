use std::vec::Vec;

use rstar::RTree;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use wasm_bindgen_test::console_log;

use crate::config::{Config, InitializationConfig, InitializationType, RecordingConfig, Settings};
use crate::path::Path;
use crate::vec2::{Point2, Vec2};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct SimulationState {
    paths: Vec<Vec<Vec2>>,
}

#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct GrowthSimulation {
    config: Config,
    paths: Vec<Path>,
}

#[wasm_bindgen]
impl GrowthSimulation {
    pub fn new(width: u32, height: u32) -> Self {
        console_log!("creating growth simulation");
        Self {
            config: Config::new(width, height),
            paths: vec![],
        }
    }

    pub fn add_path(&mut self, path: Path) {
        self.paths.push(path);
    }

    pub fn get_config(&self) -> Config {
        self.config.clone()
    }

    pub fn update_config(&mut self, new_config: Config) {
        console_log!("updating config");
        self.config = new_config;
    }

    pub fn update_settings(&mut self, new_settings: Settings) {
        console_log!("updating settings");
        self.config.settings = new_settings;
    }

    pub fn update_initialization(&mut self, init: InitializationConfig) {
        console_log!("updating initialization");
        self.config.initialization = init;
    }

    pub fn update_recording(&mut self, rec: RecordingConfig) {
        console_log!("updating recording");
        self.config.recording = rec;
    }

    pub fn setup(&mut self) {
        console_log!("SETUP");
        match self.config.initialization.init_type {
            InitializationType::HorizontalLine => {
                self.paths.push(Path::horizontal(&self.config.settings))
            }
            InitializationType::VerticalLine => {
                self.paths.push(Path::vertical(&self.config.settings))
            }
            InitializationType::Polygon => self.paths.push(Path::polygon(
                &self.config.settings,
                self.config.initialization.polygon_config.unwrap(),
            )),
        };

        /* @todo fix */
        // for path in self.paths.iter_mut() {
        //     path.preprocess(&self.config.settings);
        // }
    }

    pub fn reset(&mut self) {
        self.paths = vec![];
    }

    pub fn update(&mut self) {
        /* @todo do this asynchronously between update calls */
        let rtree = RTree::bulk_load(self.all_points());

        for path in self.paths.iter_mut() {
            path.update(&self.config.settings, &rtree);
        }
    }

    fn path_points(&self) -> Vec<Vec<Point2>> {
        self.paths.iter().map(|p| p.node_points()).collect()
    }

    fn all_points(&self) -> Vec<Point2> {
        self.path_points().into_iter().flatten().collect()
    }

    fn path_vecs(&self) -> Vec<Vec<Vec2>> {
        self.paths.iter().map(|p| p.node_positions()).collect()
    }

    pub fn get_state(&self) -> JsValue {
        let state = SimulationState {
            paths: self.path_vecs(),
        };

        JsValue::from_serde(&state).unwrap()
    }
}
