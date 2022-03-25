import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Settings, settingsConfig } from '../growth-simulation/config';

import './button-element';
import './range-slider';

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
            const key = k as keyof Settings;
            const config = settingsConfig[key];
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
