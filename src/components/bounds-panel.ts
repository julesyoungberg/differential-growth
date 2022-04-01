import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Bounds } from '../growth-simulation/config';

import './range-slider';

export const BOUNDS_TYPES = ['None', 'View', 'Rect', 'Circle'] as const;

export type BoundsType = typeof BOUNDS_TYPES[number];

export const rectConfig = {
    width: {
        label: 'Width',
        min: 10,
        step: 1,
    },
    height: {
        label: 'Height',
        min: 10,
        step: 1,
    },
};

export const circleConfig = {
    radius: {
        label: 'Radius',
        min: 10,
        step: 1,
    },
};

const boundsConfig = {
    bounds_type: {
        label: 'Bounds Type',
        inputType: 'select',
        options: BOUNDS_TYPES,
    },
    rect: rectConfig,
    circle: circleConfig,
};

@customElement('bounds-panel')
export class BoundsPanel extends LitElement {
    @property({ type: Object })
    settings?: Bounds;

    @property({ type: Number })
    width = 0;

    @property({ type: Number })
    height = 0;

    static styles = css`
        .selector {
            margin-bottom: 24px;
        }
    `;

    private updateSettings(newSettings: Partial<Bounds>) {
        this.dispatchEvent(
            new CustomEvent('update-bounds', {
                bubbles: true,
                composed: true,
                detail: { bounds: newSettings },
            })
        );
    }

    private onBoundsTypeChange(event: Event) {
        const value = (event.target as HTMLSelectElement).value;
        console.log(value);
        this.updateSettings({ bounds_type: value });
    }

    private onRectSettingChange(key: keyof Bounds['rect_config'], event: CustomEvent) {
        this.updateSettings({
            rect_config: {
                ...this.settings?.rect_config,
                [key]: event.detail.value,
            } as Bounds['rect_config'],
        });
    }

    private onCircleSettingChange(key: keyof Bounds['circle_config'], event: CustomEvent) {
        this.updateSettings({
            circle_config: {
                ...this.settings?.circle_config,
                [key]: event.detail.value,
            } as Bounds['circle_config'],
        });
    }

    render() {
        const boundsType = this.settings?.bounds_type;
        
        let content = html``;

        if (boundsType === 'Rect') {
            content = html`
                ${Object.keys(boundsConfig.rect).map((k) => {
                    const key = k as keyof Bounds['rect_config'];
                    const config = boundsConfig.rect[key];
                    return config
                        ? html`
                            <range-slider
                                label=${config.label}
                                min=${config.min}
                                max=${k === "width" ? this.width : this.height}
                                step=${config.step}
                                value=${this.settings?.rect_config[key] || config.min}
                                @change=${(event: CustomEvent) =>
                                    this.onRectSettingChange(key, event)}
                              ></range-slider>
                        `
                        : html``;
                })}
            `;
        } else if (boundsType === 'Circle') {
            const config = boundsConfig.circle.radius;
            content = html`
                <range-slider
                    label=${config.label}
                    min=${config.min}
                    max=${Math.max(this.width, this.height)}
                    step=${config.step}
                    value=${this.settings?.circle_config.radius || config.min}
                    @change=${(event: CustomEvent) => this.onCircleSettingChange('radius', event)}
                ></range-slider>
            `;
        }

        return html`
            <select @change=${this.onBoundsTypeChange} class="selector">
                ${boundsConfig.bounds_type.options.map(
                    (t) => html` <option value=${t} ?selected=${t === boundsType}>${t}</option> `
                )}
            </select>
            ${content}
        `;
    }
}
