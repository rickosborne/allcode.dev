import { AmbleElement } from './AmbleElement';
import { AmbleHasLinks, AmbleHasSourceRefs } from './AmbleInterfaces';
import { AmbleSourceRefElement } from './AmbleSourceRefElement';
export declare class AmbleStepElement extends AmbleElement implements AmbleHasLinks, AmbleHasSourceRefs {
    description: string | undefined;
    extra: string | undefined;
    readonly links: HTMLElement[];
    readonly sourceRefs: AmbleSourceRefElement[];
    constructor();
}
