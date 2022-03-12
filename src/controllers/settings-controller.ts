import { ReactiveController, ReactiveControllerHost } from 'lit';

export default class SettingsController implements ReactiveController {
    /** @todo build settings schema, act as config store */

    constructor(readonly host: ReactiveControllerHost) {
        // Store a reference to the host
        // Register for lifecycle updates
        host.addController(this);
    }

    hostConnected() {
        /** @todo setup */
    }

    hostDisconnected() {
        /** @todo cleanup */
    }
}
