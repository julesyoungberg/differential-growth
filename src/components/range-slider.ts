import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('range-slider')
export class RangeSlider extends LitElement {
    @property({ type: String })
    label: string = '';

    @property({ type: Number })
    min = 0;

    @property({ type: Number })
    max = 1;

    @property({ type: Number })
    step = 0.01;

    @property({ type: Number })
    value = 0.5;

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
        }
    `;

    private onChange(event: InputEvent) {
        const value = parseFloat((event.target as HTMLInputElement).value);
        this.dispatchEvent(
            new CustomEvent('change', { bubbles: true, composed: true, detail: { value } })
        );
    }

    render() {
        return html`
            <label>
                ${this.label}
            </label>
            <input
                type="range"
                min=${this.min}
                max=${this.max}
                step=${this.step}
                value=${this.value}
                @change=${this.onChange}
            />
        `;
    }
}
