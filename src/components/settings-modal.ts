import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import theme from '../theme';
import { Settings, settingsConfig } from '../growth-simulation/settings';

import './button-element';
import './icons/close-icon';
import './modal-container';
import './range-slider';

@customElement('settings-modal')
export class SettingsModal extends LitElement {
    @property({ type: Boolean })
    open = false;

    @property({ type: Object })
    settings?: Settings;

    static styles = css`
        .settings-modal-wrapper {
            position: relative;
        }

        h2 {
            margin-top: 0px;
        }

        close-icon {
            position: absolute;
            top: 10px;
            right: 10px;
        }

        button-element {
            --button-padding: 8px 12px 12px 12px;
        }

        .controls {
            margin-bottom: 12px;
        }
    `;

    private close() {
        this.dispatchEvent(new CustomEvent('closed', { bubbles: true, composed: true }));
    }

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
        return html`
            <modal-container ?open=${this.open}>
                <div class="settings-modal-wrapper">
                    <close-icon @click=${this.close}></close-icon>
                    <h2>Settings</h2>
                    <div class="controls">
                        ${Object.keys(this.settings as Record<string, number>).map((k) => {
                            const key = k as keyof Settings;
                            const config = settingsConfig[key];
                            return html`
                                <range-slider
                                    label=${config.label}
                                    min=${config.min}
                                    max=${config.max}
                                    step=${config.step}
                                    value=${this.settings?.[key] || 0}
                                    @change=${(event: CustomEvent) => this.onSettingChange(key, event)}
                                ></range-slider>
                            `;
                        })}
                    </div>
                    <button-element @click=${this.randomize.bind(this)}>Randomize</button-element>
                </div>
            </modal-container>
        `;
    }
}
