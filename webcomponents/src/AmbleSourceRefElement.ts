import {customElement, property} from 'lit-element';
import {AmbleElement} from './AmbleElement';

@customElement('amble-source-ref')
export class AmbleSourceRefElement extends AmbleElement {
	@property({type: String})
	public selector!: string;
	@property({type: String})
	public syntax: string | undefined;
}
