import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Settings } from '../growth-simulation/config';

import './button-element';
import './range-slider';

const settingsConfig = {
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

@customElement('settings-panel')
export class SettingsPanel extends LitElement {
    @property({ type: Object })
    settings?: Settings;

    static styles = css`
        .controls {
            margin-bottom: 12px;
        }
    `;

    private updateSettings(newSettings: Partial<Settings>) {
        this.dispatchEvent(
            new CustomEvent('update-settings', {
                bubbles: true,
                composed: true,
                detail: { settings: newSettings },
            })
        );
    }

    private onSettingChange(settingName: keyof Settings, event: CustomEvent) {
        this.updateSettings({ [settingName]: event.detail.value });
    }

    private randomize() {
        const newSettings = { ...this.settings };

        Object.keys(newSettings).forEach((k) => {
            if (['width', 'height'].includes(k)) {
                return;
            }

            const key = k as keyof Settings;
            const config = settingsConfig[key];
            if (!config) {
                return;
            }

            const range = config.max - config.min;
            newSettings[key] = Math.random() * range + config.min;
        });

        this.updateSettings(newSettings);
    }

    render() {
        console.log('settings-panel', this.settings);
        return html`
            <div class="controls">
                ${Object.keys(settingsConfig).map((k) => {
                    const key = k as keyof Settings;
                    const config = settingsConfig[key];
                    return config
                        ? html`
                              <range-slider
                                  label=${config.label}
                                  min=${config.min}
                                  max=${config.max}
                                  step=${config.step}
                                  value=${this.settings?.[key] || 0}
                                  @change=${(event: CustomEvent) =>
                                      this.onSettingChange(key, event)}
                              ></range-slider>
                          `
                        : html``;
                })}
            </div>
            <button-element @click=${this.randomize}>Randomize</button-element>
        `;
    }
}
