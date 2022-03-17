import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import theme from '../theme';
import { Settings, settingsConfig } from '../growth-simulation/settings';

import './button-element';
import './icons/close-icon';
import './modal-container';
import './range-slider';
import './tab-button';

const TABS = ['settings', 'initialization', 'recording'] as const;

type SettingsTab = typeof TABS[number];

function isSettingsTab(value: unknown): asserts value is SettingsTab {
    if (!TABS.includes(value as any)) {
        throw Error("received unexpected settings tab value: " + value);
    }
}

@customElement('settings-modal')
export class SettingsModal extends LitElement {
    @property({ type: Boolean })
    open = false;

    @property({ type: Object })
    settings?: Settings;

    @state()
    tab: SettingsTab = 'settings';

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

        .tabs {
            margin-bottom: 24px;
            border-bottom: 2px solid ${theme.colors.greyDark};
        }

        .controls {
            margin-bottom: 12px;
        }

        p {
            font-size: 14px;
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

    private handleTabClick(event: Event) {
        const target = event.target as HTMLElement;
        if (!target) {
            return;
        }

        const content = target.innerHTML.toLowerCase().trim().replace(/<!--\?lit\$\d+\$-->/, '');
        isSettingsTab(content);
        this.tab = content;
    }

    render() {
        return html`
            <modal-container ?open=${this.open}>
                <div class="settings-modal-wrapper">
                    <close-icon @click=${this.close}></close-icon>
                    <h2>Config</h2>
                    <p>After modifying the config, close the modal to restart the simulation.</p>
                    <div class="tabs" @click=${this.handleTabClick}>
                        ${TABS.map((tab) => html`
                            <tab-button class=${tab === this.tab ? 'active' : ''}>${tab}</tab-button>
                        `)}
                    </div>
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
                    <button-element @click=${this.randomize}>Randomize</button-element>
                </div>
            </modal-container>
        `;
    }
}
