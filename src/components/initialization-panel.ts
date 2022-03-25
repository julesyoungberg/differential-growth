import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Initialization, initializationConfig } from '../growth-simulation/config';

import './button-element';
import './range-slider';

@customElement('initialization-panel')
export class InitializationPanel extends LitElement {
    @property({ type: Object })
    settings?: Initialization;

    static styles = css``;

    private updateSettings(newSettings: Partial<Initialization>) {
        console.log(newSettings);
        this.dispatchEvent(
            new CustomEvent('update-initialization', {
                bubbles: true,
                composed: true,
                detail: { initialization: newSettings },
            })
        );
    }

    private onInitTypeChange(event: Event) {
        const value = (event.target as HTMLSelectElement).value;
        console.log(value);
        this.updateSettings({ init_type: value });
    }

    private onPolygonSettingChange(
        key: keyof Initialization['polygon_config'],
        event: CustomEvent
    ) {
        this.updateSettings({
            polygon_config: {
                ...this.settings?.polygon_config,
                [key]: event.detail.value,
            } as Initialization['polygon_config'],
        });
    }

    render() {
        console.log('initialization', this.settings);
        const initType = this.settings?.init_type.toLowerCase();

        let content = html``;

        if (initType === 'polygon') {
            content = html`
                ${Object.keys(initializationConfig.configs.polygon).map((k) => {
                    const key = k as keyof Initialization['polygon_config'];
                    const config = initializationConfig.configs.polygon[key];
                    return config
                        ? html`
                              <range-slider
                                  label=${config.label}
                                  min=${config.min}
                                  max=${config.max}
                                  step=${config.step}
                                  value=${this.settings?.polygon_config[key] || 0}
                                  @change=${(event: CustomEvent) =>
                                      this.onPolygonSettingChange(key, event)}
                              ></range-slider>
                          `
                        : html``;
                })}
            `;
        }

        return html`
            <select @change=${this.onInitTypeChange}>
                ${initializationConfig.init_type.options.map(
                    (t) => html` <option value=${t} ?selected=${t === initType}>${t}</option> `
                )}
            </select>
            ${content}
        `;
    }
}
