import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import theme from '../theme';

@customElement('modal-container')
export class ModalContainer extends LitElement {
    @property({ type: Boolean })
    open = false;

    static styles = css`
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
        }

        .modal-overlay.open {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${theme.colors.overlay};
        }

        .modal-wrapper {
            width: 100%;
            max-width: 600px;
            max-height: 100%;
            background-color: ${theme.colors.background};
            border-radius: ${theme.borderRadius};
            color: ${theme.colors.text};
            padding: 20px;
        }
    `;

    private close() {
        this.dispatchEvent(new CustomEvent('closed', { bubbles: true, composed: true }));
    }

    render() {
        return html`
            <div class=${classMap({ 'modal-overlay': true, open: this.open })} @click=${this.close}>
                <div
                    class=${classMap({ 'modal-wrapper': true, open: this.open })}
                    @click=${(event: Event) => event.stopPropagation()}
                >
                    <slot></slot>
                </div>
            </div>
        `;
    }
}
