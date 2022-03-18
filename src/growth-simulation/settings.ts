export const defaultSettings = {
    width: 0,
    height: 0,
    maxSpeed: 1.0,
    maxForce: 0.9,
    separationDistance: 10.0,
    attractionDistance: 70.0,
    alignmentWeight: 1.0,
    attractionWeight: 1.0,
    separationWeight: 1.0,
    maxEdgeLength: 5.0,
    minEdgeLength: 1.0,
    injectionProbability: 0.5,
};

export const settingsConfig = {
    maxSpeed: {
        label: 'Max Speed',
        min: 0,
        max: 1,
        step: 0.01,
    },
    maxForce: {
        label: 'Max Force',
        min: 0,
        max: 1,
        step: 0.01,
    },
    separationDistance: {
        label: 'Separation Distance',
        min: 0,
        max: 100,
        step: 1,
    },
    attractionDistance: {
        label: 'Attraction Distance',
        min: 0,
        max: 100,
        step: 1,
    },
    alignmentWeight: {
        label: 'Alignment Weight',
        min: 0,
        max: 2,
        step: 0.01,
    },
    attractionWeight: {
        label: 'Attraction Weight',
        min: 0,
        max: 2,
        step: 0.01,
    },
    separationWeight: {
        label: 'Separation Weight',
        min: 0,
        max: 2,
        step: 0.01,
    },
    maxEdgeLength: {
        label: 'Max Edge Length',
        min: 1,
        max: 100,
        step: 0.1,
    },
    minEdgeLength: {
        label: 'Min Edge Length',
        min: 0,
        max: 5,
        step: 0.1,
    },
    injectionProbability: {
        label: 'Injection Probability',
        min: 0,
        max: 1,
        step: 0.01,
    }
};

export type Settings = typeof defaultSettings;
