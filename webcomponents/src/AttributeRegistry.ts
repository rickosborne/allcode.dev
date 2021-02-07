import {ReadWrite} from "./ReadWriteRemove";

export interface AttributeRegistrySetupItem<T> {
  accessor: (owner: T) => string;
  key: string;
  mutator: (owner: T, value: string) => void;
}

interface StoreItem<T> extends AttributeRegistrySetupItem<T> {
  aliases: string[];
}

export class AttributeValue<T extends HTMLElement> implements ReadWrite<string> {
  constructor(
    private readonly target: T,
    private readonly item: StoreItem<T>,
    private readonly defaultValue: string,
  ) {
  }

  read(): string {
    return readAttribute(this.target, this.item.aliases, this.defaultValue);
  }

  write(value: string): boolean {
    this.target.setAttribute("data-" + this.item.key, value);
    return true;
  }
}

export class AttributeRegistryStore<T extends HTMLElement> {
  constructor(
    private readonly target: T,
    private readonly items: StoreItem<T>[],
  ) {
  }

  getValue(name: string, defaultValue = ""): AttributeValue<T> {
    const lcName = name.toLowerCase();
    const item = this.items.find(item => item.aliases.includes(lcName));
    if (item == null) {
      throw new Error(`Unknown attribute: ${name}`);
    }
    return new AttributeValue<T>(this.target, item, defaultValue);
  }

  update(name: string, oldValue: string, newValue: string, throwOnError = true): void {
    const lcName = name.toLowerCase();
    const item = this.items.find(item => item.aliases.includes(lcName));
    if (item == null) {
      if (throwOnError) {
        throw new Error(`Unknown attribute: ${name}`);
      }
      return;
    }
    item.mutator(this.target, newValue);
  }
}

export class AttributeRegistry<T extends HTMLElement> {
  private readonly storeItems: StoreItem<T>[];

  constructor(setup: AttributeRegistrySetupItem<T>[]) {
    this.storeItems = setup.map(item => {
      return Object.assign({aliases: attributeAliases(item.key)}, item);
    });
  }

  public get asObservedAttributes(): string[] {
    const attrs: string[] = [];
    this.storeItems.forEach(item => attrs.push(...item.aliases));
    return attrs;
  }

  public buildRegistry(target: T): AttributeRegistryStore<T> {
    return new AttributeRegistryStore<T>(target, this.storeItems);
  }
}

export function attributeAliases(name: string): string[] {
  const lcKey = name.toLowerCase();
  const aliases: string[] = ["data-" + lcKey, lcKey];
  const noHyphens = lcKey.replace(/-/g, "");
  if (lcKey !== noHyphens) {
    aliases.push("data-" + noHyphens, noHyphens);
  }
  return aliases;
}

export function readAttribute(tag: HTMLElement, name: string | string[], defaultValue = ""): string {
  const aliases = Array.isArray(name) ? name : attributeAliases(name);
  for (const alias of aliases) {
    const value = tag.getAttribute(alias);
    if (value != null) {
      return value;
    }
  }
  return defaultValue;
}
