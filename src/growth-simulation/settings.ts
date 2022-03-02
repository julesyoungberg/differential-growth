export const defaultSettings = {
    maxSpeed: 0.5,
    maxForce: 0.2,
    separationDistance: 50.0,
    attractionDistance: 70.0,
    alignmentWeight: 1.0,
    attractionWeight: 0.5,
    separationWeight: 1.1,
    maxEdgeLength: 1.0,
};

export type Settings = typeof defaultSettings;
