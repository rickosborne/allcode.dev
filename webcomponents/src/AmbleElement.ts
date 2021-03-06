import {LitElement, property} from 'lit-element';
import {SelectorChangedEvent} from "./AllCodeStyleSelector";
import {catchAndLog} from './util';

export abstract class AmbleElement extends LitElement {
  @property({type: Boolean})
  public hidden = false;
  @property({type: String})
  public label = '';
  @property({type: String})
  public title = '';

  constructor() {
    super();
  }

  protected changed(key: PropertyKey, previous?: unknown): void {
    catchAndLog(this.requestUpdate(key, previous));
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Because https://github.com/w3c/csswg-drafts/issues/1914
    // Yeah.  Total hack.  There's a possibility we get out of sync.
    document.body.parentElement?.classList.forEach(c => this.classList.add(c));
    document.body.addEventListener(SelectorChangedEvent.EVENT_NAME, this.onSelectorChangedEvent.bind(this));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.body.removeEventListener(SelectorChangedEvent.EVENT_NAME, this.onSelectorChangedEvent.bind(this));
  }

  onSelectorChangedEvent(ev: Event): void {
    if (SelectorChangedEvent.isInstance(ev)) {
      ev.unused.forEach(c => this.classList.remove(c));
      this.classList.add(ev.value);
    }
  }
}
