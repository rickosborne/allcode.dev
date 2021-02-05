import {customElement, html, property} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {TemplateResult} from 'lit-html';
import {AmbleElement} from './AmbleElement';

@customElement('amble-button')
export class AmbleButtonElement extends AmbleElement {
	@property({type: Boolean})
	public active = false;
	@property({type: Boolean})
	public disabled = false;
	@property({type: String})
	public value: string | undefined;

	@property({type: String})
	public set bindableTitle(title: string) {
		const previousTitle = this.title;
		if (previousTitle !== title) {
			this.title = title;
			this.requestUpdate('title', previousTitle);
		}
	}

	public render(): TemplateResult {
		return this.hidden
			? html``
			: html`
					<link rel="stylesheet" href="src/AmbleButtonElement.css" />
					<button
						.title="${this.title}"
						aria-label="${this.label}"
						?disabled="${this.disabled}"
						class="${classMap({
							active: this.active,
							inactive: !this.active,
						})}"
					>
						<slot></slot>
					</button>
			  `;
	}
}
