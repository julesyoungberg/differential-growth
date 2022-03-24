export const defaultSettings = {
    width: 0,
    height: 0,
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

export const settingsConfig = {
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
    }
};

export type Settings = typeof defaultSettings;
