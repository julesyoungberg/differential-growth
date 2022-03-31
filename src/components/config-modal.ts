import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import theme from '../theme';
import { Bounds, Initialization, RecordingConfig, Settings, settingsConfig } from '../growth-simulation/config';

import './button-element';
import './icons/close-icon';
import './initialization-panel';
import './modal-container';
import './range-slider';
import './tab-button';
import './settings-panel';

const TABS = ['settings', 'initialization', 'bounds', 'recording'] as const;

type SettingsTab = typeof TABS[number];

function isSettingsTab(value: unknown): asserts value is SettingsTab {
    if (!TABS.includes(value as any)) {
        throw Error('received unexpected settings tab value: ' + value);
    }
}

@customElement('config-modal')
export class ConfigModal extends LitElement {
    @property({ type: Boolean })
    open = false;

    @property({ type: Object })
    settings?: Settings;

    @property({ type: Object })
    initialization?: Initialization;

    @property({ type: Object })
    bounds?: Bounds;

    @property({ type: Object })
    recording?: RecordingConfig;

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

        p {
            font-size: 14px;
        }
    `;

    private close() {
        this.dispatchEvent(new CustomEvent('closed', { bubbles: true, composed: true }));
    }

    private handleTabClick(event: Event) {
        const target = event.target as HTMLElement;
        if (!target) {
            return;
        }

        const content = target.innerHTML
            .toLowerCase()
            .trim()
            .replace(/<!--\?lit\$\d+\$-->/, '');
        isSettingsTab(content);
        this.tab = content;
    }

    render() {
        console.log('config-modal', this.settings, this.initialization);

        let content = html``;

        if (this.tab === 'settings') {
            content = html` <settings-panel .settings=${this.settings}></settings-panel> `;
        } else if (this.tab === 'initialization') {
            content = html`
                <initialization-panel
                    .settings=${this.initialization}
                ></initialization-panel>
            `;
        } else if (this.tab === 'bounds') {
            content = html``;
        }

        return html`
            <modal-container ?open=${this.open}>
                <div class="settings-modal-wrapper">
                    <close-icon @click=${this.close}></close-icon>
                    <h2>Config</h2>
                    <p>After modifying the config, close the modal to restart the simulation.</p>
                    <div class="tabs" @click=${this.handleTabClick}>
                        ${TABS.map(
                            (tab) => html`
                                <tab-button class=${tab === this.tab ? 'active' : ''}
                                    >${tab}</tab-button
                                >
                            `
                        )}
                    </div>
                    ${content}
                </div>
            </modal-container>
        `;
    }
}
