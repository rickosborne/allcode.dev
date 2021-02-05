import {customElement, property} from 'lit-element';
import {AmbleElement} from './AmbleElement';
import {unindent} from './util';

@customElement('amble-source')
export class AmbleSourceElement extends AmbleElement {
	@property({type: String})
	public syntax = '';

	@property({type: String})
	public get source(): string {
		return this.innerText;
	}

	@property({type: String})
	public get unindentedSource(): string {
		return unindent(this.source);
	}
}
