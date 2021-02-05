import {customElement, property} from 'lit-element';
import {AmbleElement} from './AmbleElement';
import {AmbleHasLinks, AmbleHasSourceRefs} from './AmbleInterfaces';
import {AmbleSourceRefElement} from './AmbleSourceRefElement';

export const HIGHLIGHT_WHEN_Q = 'Question';
export const HIGHLIGHT_WHEN_A = 'Answer';
export const HIGHLIGHT_WHEN_R = 'Rationale';
export type HighlightWhen = typeof HIGHLIGHT_WHEN_Q | typeof HIGHLIGHT_WHEN_A | typeof HIGHLIGHT_WHEN_R;

@customElement('amble-question')
export class AmbleQuestionElement extends AmbleElement implements AmbleHasLinks, AmbleHasSourceRefs {
	public readonly answerEl: HTMLElement | null;
	@property({type: String})
	public readonly highlightWhen: HighlightWhen = HIGHLIGHT_WHEN_A;
	public readonly links: HTMLElement[];
	public readonly questionEl: HTMLElement | null;
	public readonly rationaleEl: HTMLElement | null;
	public readonly sourceRefs: AmbleSourceRefElement[];

	constructor() {
		super();
		this.questionEl = this.querySelector<HTMLElement>('[slot="question"]');
		this.answerEl = this.querySelector<HTMLElement>('[slot="answer"]');
		this.rationaleEl = this.querySelector<HTMLElement>('[slot="rationale"]');
		this.sourceRefs = Array.prototype.slice.apply(this.querySelectorAll('amble-source-ref, [is="amble-source-ref"]'));
		this.links = Array.prototype.slice.apply(this.querySelectorAll('.amble-link'));
	}
}
