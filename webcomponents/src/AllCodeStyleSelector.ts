import {
  attributeAliases,
  AttributeRegistry,
  AttributeRegistryStore,
  AttributeValue,
  readAttribute
} from "./AttributeRegistry";
import {StoredValue} from "./StoredValue";
import {isNothing} from "./util";

export class SelectorChangedEvent extends Event {
  public static EVENT_NAME = "allcode-selector-changed";

  constructor(
    public readonly key: string,
    public readonly value: string,
    public readonly unused: string[],
  ) {
    super(SelectorChangedEvent.EVENT_NAME, {bubbles: true, cancelable: true, composed: true});
  }

  public static isInstance(event: Event): event is SelectorChangedEvent {
    if (event instanceof SelectorChangedEvent) {
      return true;
    }
    // Safari.  Sigh.
    const typed = event as SelectorChangedEvent;
    // noinspection SuspiciousTypeOfGuard
    return typed != null && typed.type === this.EVENT_NAME &&
      typeof typed.value === "string" && typeof typed.key === "string" && Array.isArray(typed.unused);
  }
}

export class AllCodeStyleSelector extends HTMLElement {
  protected static readonly attrs: AttributeRegistry<AllCodeStyleSelector> = new AttributeRegistry<AllCodeStyleSelector>([
    {
      accessor: s => s.destination,
      key: "destination",
      mutator: (s, v) => s.destination = v,
    },
    {
      accessor: s => s.storageName,
      key: "storage-name",
      mutator: (s, v) => s.setStorageName(v),
    },
    {
      accessor: s => s.defaultValue,
      key: "default",
      mutator: (s, v) => s.setDefaultValue(v),
    },
    {
      accessor: s => s.value,
      key: "value",
      mutator: (s, v) => s.setValue(v),
    }
  ]);
  public defaultValue: string;
  private readonly defaultValueAttribute: AttributeValue<AllCodeStyleSelector>;
  public destination: string;
  private readonly destinationAttribute: AttributeValue<AllCodeStyleSelector>;
  private readonly options: HTMLElement[] = [];
  private readonly registry: AttributeRegistryStore<AllCodeStyleSelector>;
  private readonly shadow: ShadowRoot;
  public storageName: string;
  private readonly storageNameAttribute: AttributeValue<AllCodeStyleSelector>;
  private stored?: StoredValue<string>;
  public value: string;
  private readonly valueAttribute: AttributeValue<AllCodeStyleSelector>;
  private readonly values: string[] = [];

  constructor() {
    super();
    this.shadow = this.attachShadow({mode: "open"});
    if (this.shadow == null) {
      console.log("no shadow!");
    }
    this.registry = AllCodeStyleSelector.attrs.buildRegistry(this);
    this.defaultValueAttribute = this.registry.getValue("default");
    this.defaultValue = this.defaultValueAttribute.read();
    this.destinationAttribute = this.registry.getValue("destination");
    this.destination = this.destinationAttribute.read();
    this.storageNameAttribute = this.registry.getValue("storage-name");
    this.storageName = this.storageNameAttribute.read();
    this.valueAttribute = this.registry.getValue("value");
    this.value = this.valueAttribute.read();
    if (this.storageName != null && this.storageName !== "") {
      this.stored = new StoredValue<string>(this.storageName, this.defaultValue);
      const storedValue = this.stored.read();
      if (storedValue !== this.defaultValue) {
        this.value = storedValue;
      }
    }
  }

  public static get observedAttributes(): string[] {
    return this.attrs.asObservedAttributes;
  }

  // noinspection JSUnusedGlobalSymbols
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    this.registry.update(name, oldValue, newValue, true);
  }

  connectedCallback(): void {
    this.options.splice(0, this.options.length);
    this.values.splice(0, this.values.length);
    let child: ChildNode | null;
    while ((child = this.shadow.firstChild)) {
      this.shadow.removeChild(child);
    }
    this.options.push(...Array.prototype.slice.apply(this.querySelectorAll("[slot=option]")));
    const valueAliases = attributeAliases("value");
    const style: HTMLStyleElement = document.createElement("style");
    style.textContent = `
        .allcode-style-selector-option {
          flex: 1;
        }
        .allcode-style-selector-option input[type=radio] { display: none; }
        .allcode-style-selector-option input[type=radio] ~ * {
          display: block;
          padding: 0.25em;
          text-align: center;
          border-radius: 1em;
        }
        .allcode-style-selector-option input[type=radio]:checked ~ * {
          font-weight: bold;
          background-color: var(--lighter-20);
        }
        label {
          background-color: var(--darker-20);
        }
        label:first-of-type {
          border-top-left-radius: 1em;
          border-bottom-left-radius: 1em;
        }
        label:last-of-type {
          border-top-right-radius: 1em;
          border-bottom-right-radius: 1em;
        }
      `;
    this.shadow.appendChild(style);
    this.options.forEach(option => {
      const container = document.createElement("label");
      container.className = "allcode-style-selector-option";
      const radio: HTMLInputElement = document.createElement("input");
      radio.type = "radio";
      radio.name = this.storageName;
      const optionValue = readAttribute(option, valueAliases);
      this.values.push(optionValue);
      if (optionValue === this.value || (isNothing(this.value) && optionValue === this.defaultValue)) {
        radio.checked = true;
        this.value = optionValue;
      }
      radio.value = optionValue;
      radio.addEventListener("change", () => this.setValue(optionValue));
      container.appendChild(radio);
      container.appendChild(option);
      this.shadow.append(container);
    });
    this.updateDestination();
  }

  onChange(): void {
    const event = new SelectorChangedEvent(this.storageName, this.value, this.values.filter(v => v !== this.value));
    this.dispatchEvent(event);
  }

  setDefaultValue(value: string): void {
    if (value !== this.defaultValue) {
      this.stored = isNothing(this.storageName) ? undefined : new StoredValue<string>(this.storageName, value);
      this.defaultValue = value;
    }
  }

  setStorageName(storageName: string): void {
    if (storageName !== this.storageName) {
      this.stored = isNothing(storageName) ? undefined : new StoredValue<string>(storageName, this.defaultValue);
      this.storageName = storageName;
    }
  }

  setValue(value: string): void {
    if (value !== this.value) {
      this.stored?.write(isNothing(value) ? this.defaultValue : value);
      this.value = value;
      this.updateDestination();
    }
  }

  private updateDestination() {
    let destination: HTMLElement = document.body;
    if (this.destination === "root") {
      destination = document.body.parentElement || destination;
    }
    this.values.forEach(other => {
      if (this.value === other) {
        destination.classList.add(this.value);
      } else {
        destination.classList.remove(other);
      }
    });
    this.onChange();
  }
}

customElements.define("allcode-style-selector", AllCodeStyleSelector);
