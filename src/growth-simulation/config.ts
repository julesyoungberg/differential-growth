export const defaultSettings = {
    width: 1200,
    height: 800,
    max_speed: 1.0,
    max_force: 0.9,
    separation_distance: 10.0,
    attraction_distance: 70.0,
    alignment_weight: 1.0,
    attraction_weight: 1.0,
    separtion_weight: 1.0,
    max_edge_length: 5.0,
    min_edge_length: 1.0,
    injection_probability: 0.5,
};

export type Settings = typeof defaultSettings;

export const defaultRecordingConfig = {
    recording: false,
};

export type RecordingConfig = typeof defaultRecordingConfig;

export const recordingConfig = {
    recording: {
        label: 'Recording',
        inputType: 'checkbox',
    },
};

export const defaultPolygonConfig = {
    n_sides: 50,
    radius: 100.0,
};

export type PolygonConfig = typeof defaultPolygonConfig;

export const defaultInitialization = {
    init_type: 'Polygon',
    polygon_config: defaultPolygonConfig,
};

export type Initialization = typeof defaultInitialization;

export const defaultRectBoundsConfig = {
    width: 300.0,
    height: 300.0,
};

export type RectConfig = typeof defaultRectBoundsConfig;

export const defaultCircleBoundsConfig = {
    radius: 100.0,
};

export type CircleConfig = typeof defaultCircleBoundsConfig;

export const defaultBounds = {
    bounds_type: 'View',
    rect_config: defaultRectBoundsConfig,
    circle_config: defaultCircleBoundsConfig,
};

export type Bounds = typeof defaultBounds;

export const defaultConfig = {
    settings: defaultSettings,
    initialization: defaultInitialization,
    bounds: defaultBounds,
    recording: defaultRecordingConfig,
};

export type Config = typeof defaultConfig;
