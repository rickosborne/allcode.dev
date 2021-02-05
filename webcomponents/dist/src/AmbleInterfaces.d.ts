import { AmbleElement } from './AmbleElement';
import { AmbleSourceRefElement } from './AmbleSourceRefElement';
export declare type AmbleHasLinks = AmbleElement & {
    readonly links: HTMLElement[];
};
export declare type AmbleHasSourceRefs = AmbleElement & {
    readonly sourceRefs: AmbleSourceRefElement[];
};
