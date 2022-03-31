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

export const settingsConfig = {
    width: {
        label: 'Width',
        min: 100,
        max: 1920,
        step: 1,
    },
    height: {
        label: 'Height',
        min: 100,
        max: 1080,
        step: 1,
    },
    max_speed: {
        label: 'Max Speed',
        min: 0,
        max: 1,
        step: 0.01,
    },
    max_force: {
        label: 'Max Force',
        min: 0,
        max: 1,
        step: 0.01,
    },
    separation_distance: {
        label: 'Separation Distance',
        min: 0,
        max: 100,
        step: 1,
    },
    attraction_distance: {
        label: 'Attraction Distance',
        min: 0,
        max: 100,
        step: 1,
    },
    alignment_weight: {
        label: 'Alignment Weight',
        min: 0,
        max: 2,
        step: 0.01,
    },
    attraction_weight: {
        label: 'Attraction Weight',
        min: 0,
        max: 2,
        step: 0.01,
    },
    separtion_weight: {
        label: 'Separation Weight',
        min: 0,
        max: 2,
        step: 0.01,
    },
    max_edge_length: {
        label: 'Max Edge Length',
        min: 1,
        max: 100,
        step: 0.1,
    },
    min_edge_length: {
        label: 'Min Edge Length',
        min: 0,
        max: 5,
        step: 0.1,
    },
    injection_probability: {
        label: 'Injection Probability',
        min: 0,
        max: 1,
        step: 0.01,
    },
};

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

export const polygonConfig = {
    n_sides: {
        label: 'Number of Sides',
        min: 3,
        max: 50,
        step: 1,
    },
    radius: {
        label: 'Radius',
        min: 10.0,
        max: 200.0,
        step: 0.5,
    },
};

export const INITIALIZATION_TYPES = ['HorizontalLine', 'VerticalLine', 'Polygon'] as const;

export type InitializationType = typeof INITIALIZATION_TYPES[number];

export const defaultInitialization = {
    init_type: 'Polygon',
    polygon_config: defaultPolygonConfig,
};

export type Initialization = typeof defaultInitialization;

export const initializationConfig = {
    init_type: {
        label: 'Initialization Type',
        inputType: 'select',
        options: INITIALIZATION_TYPES,
    },
    configs: {
        polygon: polygonConfig,
    },
};

export const defaultRectBoundsConfig = {
    width: 300.0,
    height: 300.0,
};

export type RectConfig = typeof defaultRectBoundsConfig;

export const rectConfig = {
    width: {
        label: 'Width',
        min: 10,
        step: 1,
    },
    height: {
        label: 'Height',
        min: 10,
        step: 1,
    },
};

export const BOUNDS_TYPES = ['None', 'View', 'Rect', 'Circle'] as const;

export type BoundsType = typeof BOUNDS_TYPES[number];

export const defaultBounds = {
    bounds_type: 'View',
    rect_config: defaultRectBoundsConfig,
};

export type Bounds = typeof defaultBounds;

export const defaultConfig = {
    settings: defaultSettings,
    initialization: defaultInitialization,
    bounds: defaultBounds,
    recording: defaultRecordingConfig,
};

export type Config = typeof defaultConfig;
