import { AmbleElement } from './AmbleElement';
export declare class AmbleSourceElement extends AmbleElement {
    syntax: string;
    get source(): string;
    get unindentedSource(): string;
}
