use std::vec::Vec;

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen_test::console_log;

use crate::bounds::*;
use crate::config::*;
use crate::path::Path;
use crate::spatial_index;
use crate::spatial_index::*;
use crate::utils;
use crate::vec2::Point2;

#[wasm_bindgen]
pub struct GrowthSimulation {
    ctx: Option<web_sys::CanvasRenderingContext2d>,
    bounds: Box<dyn Bounds>,
    config: Config,
    paths: Vec<Path>,
}

#[wasm_bindgen]
impl GrowthSimulation {
    pub fn new(width: u32, height: u32) -> Self {
        console_log!("creating growth simulation");
        utils::set_panic_hook();
        Self {
            ctx: None,
            bounds: Box::new(NoBounds {}),
            config: Config::new(width, height),
            paths: vec![],
        }
    }

    pub fn set_canvas(&mut self, id: String) {
        let document = web_sys::window().unwrap().document().unwrap();
        let app_container = document
            .query_selector("my-app")
            .unwrap()
            .unwrap()
            .dyn_into::<web_sys::HtmlElement>()
            .unwrap();

        let selector = format!("#{}", id);
        console_log!("selecting {}", selector);
        let canvas: web_sys::HtmlCanvasElement = app_container
            .shadow_root()
            .unwrap()
            .query_selector(selector.as_str())
            .unwrap()
            .unwrap()
            .dyn_into::<web_sys::HtmlCanvasElement>()
            .map_err(|_| ())
            .unwrap();

        let context = canvas
            .get_context("2d")
            .unwrap()
            .unwrap()
            .dyn_into::<web_sys::CanvasRenderingContext2d>()
            .unwrap();

        self.ctx = Some(context);
    }

    pub fn add_path(&mut self, path: Path) {
        self.paths.push(path);
    }

    pub fn get_config(&self) -> JsValue {
        JsValue::from_serde(&self.config).unwrap()
    }

    pub fn update_config(&mut self, val: &JsValue) {
        console_log!("updating config");
        let config: Config = val.into_serde().unwrap();
        self.config = config;
    }

    pub fn update_settings(&mut self, val: &JsValue) {
        console_log!("updating settings");
        let new_settings: Settings = val.into_serde().unwrap();
        self.config.settings = new_settings;
    }

    pub fn update_initialization(&mut self, val: &JsValue) {
        console_log!("updating initialization");
        let init: InitializationConfig = val.into_serde().unwrap();
        self.config.initialization = init;
    }

    pub fn update_recording(&mut self, val: &JsValue) {
        console_log!("updating recording");
        let rec: RecordingConfig = val.into_serde().unwrap();
        self.config.recording = rec;
    }

    pub fn setup(&mut self) {
        console_log!("SETUP");
        self.paths = vec![];
        match self.config.initialization.init_type {
            InitializationType::HorizontalLine => {
                self.paths.push(Path::horizontal(&self.config.settings))
            }
            InitializationType::VerticalLine => {
                self.paths.push(Path::vertical(&self.config.settings))
            }
            InitializationType::Polygon => self.paths.push(Path::polygon(
                &self.config.settings,
                self.config.initialization.polygon_config,
            )),
        };

        self.bounds = get_bounds(self.config);

        for path in self.paths.iter_mut() {
            path.preprocess(&self.config.settings);
        }
    }

    pub fn reset(&mut self) {
        self.paths = vec![];
    }

    pub fn draw(&self) {
        let ctx = self.ctx.as_ref().unwrap();

        ctx.save();

        ctx.clear_rect(
            0.0,
            0.0,
            self.config.settings.width as f64,
            self.config.settings.height as f64,
        );

        ctx.set_fill_style(&"#000000".into());

        ctx.fill_rect(
            0.0,
            0.0,
            self.config.settings.width as f64,
            self.config.settings.height as f64,
        );

        for path in self.paths.iter() {
            path.draw(ctx);
        }

        ctx.restore();
    }

    fn get_spatial_index(&self) -> Box<dyn SpatialIndex> {
        spatial_index::index_points(self.all_points(), SpatialIndexType::RTree)
    }

    pub fn update(&mut self) {
        /* @todo do this asynchronously between update calls */
        let index = self.get_spatial_index();

        for path in self.paths.iter_mut() {
            path.update(&self.config.settings, &index, &self.bounds);
        }

        self.draw();
    }

    fn path_points(&self) -> Vec<Vec<Point2>> {
        self.paths.iter().map(|p| p.node_points()).collect()
    }

    fn all_points(&self) -> Vec<Point2> {
        self.path_points().into_iter().flatten().collect()
    }
}
