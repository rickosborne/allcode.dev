import {LitElement, property} from 'lit-element';
import {catchAndLog} from './util';

export abstract class AmbleElement extends LitElement {
	@property({type: Boolean})
	public hidden = false;
	@property({type: String})
	public label = '';
	@property({type: String})
	public title = '';

	constructor() {
		super();
		// Because https://github.com/w3c/csswg-drafts/issues/1914
		document.body.parentElement?.classList.forEach(c => this.classList.add(c));
	}

	protected changed(key: PropertyKey, previous?: unknown): void {
		catchAndLog(this.requestUpdate(key, previous));
	}
}
