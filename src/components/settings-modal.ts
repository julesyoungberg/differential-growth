import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import theme from '../theme';
import { Settings, settingsConfig } from '../growth-simulation/settings';

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
    `;

    private close() {
        this.dispatchEvent(new CustomEvent('closed', { bubbles: true, composed: true }));
    }

    private onSettingChange(settingName: keyof Settings, event: CustomEvent) {
        this.dispatchEvent(
            new CustomEvent('update-setting', {
                bubbles: true,
                composed: true,
                detail: { settingName, value: event.detail.value },
            })
        );
    }

    render() {
        return html`
            <modal-container ?open=${this.open}>
                <div class="settings-modal-wrapper">
                    <close-icon @click=${this.close}></close-icon>
                    <h2>Settings</h2>
                    ${Object.keys(this.settings as Record<string, number>).map((k) => {
                        const key = k as keyof Settings;
                        return html`
                            <range-slider
                                label=${settingsConfig[key].label}
                                min=${settingsConfig[key].min}
                                max=${settingsConfig[key].max}
                                step=${settingsConfig[key].step}
                                value=${this.settings?.[key] || 0}
                                @change=${(event: CustomEvent) => this.onSettingChange(key, event)}
                            ></range-slider>
                        `;
                    })}
                </div>
            </modal-container>
        `;
    }
}
