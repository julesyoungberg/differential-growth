import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Initialization } from '../growth-simulation/config';

import './button-element';
import './range-slider';

export const INITIALIZATION_TYPES = ['HorizontalLine', 'VerticalLine', 'Polygon'] as const;

export type InitializationType = typeof INITIALIZATION_TYPES[number];

const polygonConfig = {
    n_sides: {
        label: 'Number of Sides',
        min: 3,
        max: 50,
        step: 1,
    },
    radius: {
        label: 'Radius',
        min: 10.0,
        max: 200.0,
        step: 0.5,
    },
};

const initializationConfig = {
    init_type: {
        label: 'Initialization Type',
        inputType: 'select',
        options: INITIALIZATION_TYPES,
    },
    polygon: polygonConfig,
};

@customElement('initialization-panel')
export class InitializationPanel extends LitElement {
    @property({ type: Object })
    settings?: Initialization;

    static styles = css`
        .selector {
            margin-bottom: 24px;
        }
    `;

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
        const initType = this.settings?.init_type;

        let content = html``;

        if (initType === 'Polygon') {
            content = html`
                ${Object.keys(initializationConfig.polygon).map((k) => {
                    const key = k as keyof Initialization['polygon_config'];
                    const config = initializationConfig.polygon[key];
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
            <select @change=${this.onInitTypeChange} class="selector">
                ${initializationConfig.init_type.options.map(
                    (t) => html` <option value=${t} ?selected=${t === initType}>${t}</option> `
                )}
            </select>
            ${content}
        `;
    }
}
