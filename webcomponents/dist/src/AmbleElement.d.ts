import { LitElement } from 'lit-element';
export declare abstract class AmbleElement extends LitElement {
    hidden: boolean;
    label: string;
    title: string;
    constructor();
    protected changed(key: PropertyKey, previous?: unknown): void;
}
