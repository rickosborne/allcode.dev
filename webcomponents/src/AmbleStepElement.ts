import {customElement} from 'lit-element';
import {AmbleElement} from './AmbleElement';
import {AmbleHasLinks, AmbleHasSourceRefs} from './AmbleInterfaces';
import {AmbleSourceRefElement} from './AmbleSourceRefElement';
import {undefIfEmpty} from './util';

@customElement('amble-step')
export class AmbleStepElement extends AmbleElement implements AmbleHasLinks, AmbleHasSourceRefs {
	public description: string | undefined;
	public extra: string | undefined;
	public readonly links: HTMLElement[];
	public readonly sourceRefs: AmbleSourceRefElement[];

	constructor() {
		super();
		this.description = undefIfEmpty(this.querySelector('[slot="description"]')?.innerHTML);
		this.extra = undefIfEmpty(this.querySelector('[slot="extra"]')?.innerHTML);
		this.sourceRefs = Array.prototype.slice.apply(this.querySelectorAll('amble-source-ref, [is="amble-source-ref"]'));
		this.links = Array.prototype.slice.apply(this.querySelectorAll('.amble-link'));
	}
}
