import { ReactiveController, ReactiveControllerHost } from 'lit';

export default class SettingsController implements ReactiveController {
    /** @todo build settings schema, act as config store */
    private host: ReactiveControllerHost;

    constructor(host: ReactiveControllerHost) {
        // Store a reference to the host
        this.host = host;
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
