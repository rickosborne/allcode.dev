import { TemplateResult } from 'lit-html';
import { AmbleElement } from './AmbleElement';
export declare class AmbleButtonElement extends AmbleElement {
    active: boolean;
    disabled: boolean;
    value: string | undefined;
    set bindableTitle(title: string);
    render(): TemplateResult;
}
