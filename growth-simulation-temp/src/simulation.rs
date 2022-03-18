use std::vec::Vec;

use rstar::RTree;
use wasm_bindgen::prelude::*;

use crate::path::Path;
use crate::settings::Settings;
use crate::vec2::Point2;

#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct GrowthSimulation {
    paths: Vec<Path>,
    settings: Settings,
}

#[wasm_bindgen]
impl GrowthSimulation {
    pub fn new(width: u32, height: u32) -> Self {
        Self {
            paths: vec![],
            settings: Settings::new(width, height),
        }
    }

    pub fn add_path(&mut self, path: Path) {
        self.paths.push(path);
    }

    pub fn get_settings(&self) -> Settings {
        self.settings.clone()
    }

    pub fn update_settings(&mut self, new_settings: Settings) {
        self.settings = new_settings;
    }

    pub fn reset(&mut self) {
        self.paths = vec![];
    }

    pub fn update(&mut self) {
        /* @todo do this asynchronously between update calls */
        let rtree = RTree::bulk_load(self.all_points());

        for path in self.paths.iter_mut() {
            path.update(&self.settings, &rtree);
        }
    }

    fn path_points(&self) -> Vec<Vec<Point2>> {
        self.paths.iter().map(|p| p.node_points()).collect()
    }

    fn all_points(&self) -> Vec<Point2> {
        self.path_points().into_iter().flatten().collect()
    }
}
