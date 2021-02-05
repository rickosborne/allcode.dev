import {AmbleElement} from './AmbleElement';
import {AmbleSourceRefElement} from './AmbleSourceRefElement';

export type AmbleHasLinks = AmbleElement & {
	readonly links: HTMLElement[];
};

export type AmbleHasSourceRefs = AmbleElement & {
	readonly sourceRefs: AmbleSourceRefElement[];
};
