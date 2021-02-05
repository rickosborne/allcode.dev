/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/lit-element/lib/css-tag.js":
/*!*************************************************!*\
  !*** ./node_modules/lit-element/lib/css-tag.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "supportsAdoptingStyleSheets": () => (/* binding */ supportsAdoptingStyleSheets),
/* harmony export */   "CSSResult": () => (/* binding */ CSSResult),
/* harmony export */   "unsafeCSS": () => (/* binding */ unsafeCSS),
/* harmony export */   "css": () => (/* binding */ css)
/* harmony export */ });
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
/**
 * Whether the current browser supports `adoptedStyleSheets`.
 */
const supportsAdoptingStyleSheets = (window.ShadowRoot) &&
    (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
    ('adoptedStyleSheets' in Document.prototype) &&
    ('replace' in CSSStyleSheet.prototype);
const constructionToken = Symbol();
class CSSResult {
    constructor(cssText, safeToken) {
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
        if (this._styleSheet === undefined) {
            // Note, if `supportsAdoptingStyleSheets` is true then we assume
            // CSSStyleSheet is constructable.
            if (supportsAdoptingStyleSheets) {
                this._styleSheet = new CSSStyleSheet();
                this._styleSheet.replaceSync(this.cssText);
            }
            else {
                this._styleSheet = null;
            }
        }
        return this._styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
/**
 * Wrap a value for interpolation in a [[`css`]] tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */
const unsafeCSS = (value) => {
    return new CSSResult(String(value), constructionToken);
};
const textFromCSSResult = (value) => {
    if (value instanceof CSSResult) {
        return value.cssText;
    }
    else if (typeof value === 'number') {
        return value;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
    }
};
/**
 * Template tag which which can be used with LitElement's [[LitElement.styles |
 * `styles`]] property to set element styles. For security reasons, only literal
 * string values may be used. To incorporate non-literal values [[`unsafeCSS`]]
 * may be used inside a template string part.
 */
const css = (strings, ...values) => {
    const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, constructionToken);
};
//# sourceMappingURL=css-tag.js.map

/***/ }),

/***/ "./node_modules/lit-element/lib/decorators.js":
/*!****************************************************!*\
  !*** ./node_modules/lit-element/lib/decorators.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "customElement": () => (/* binding */ customElement),
/* harmony export */   "property": () => (/* binding */ property),
/* harmony export */   "internalProperty": () => (/* binding */ internalProperty),
/* harmony export */   "query": () => (/* binding */ query),
/* harmony export */   "queryAsync": () => (/* binding */ queryAsync),
/* harmony export */   "queryAll": () => (/* binding */ queryAll),
/* harmony export */   "eventOptions": () => (/* binding */ eventOptions),
/* harmony export */   "queryAssignedNodes": () => (/* binding */ queryAssignedNodes)
/* harmony export */ });
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const legacyCustomElement = (tagName, clazz) => {
    window.customElements.define(tagName, clazz);
    // Cast as any because TS doesn't recognize the return type as being a
    // subtype of the decorated class when clazz is typed as
    // `Constructor<HTMLElement>` for some reason.
    // `Constructor<HTMLElement>` is helpful to make sure the decorator is
    // applied to elements however.
    // tslint:disable-next-line:no-any
    return clazz;
};
const standardCustomElement = (tagName, descriptor) => {
    const { kind, elements } = descriptor;
    return {
        kind,
        elements,
        // This callback is called once the class is otherwise fully defined
        finisher(clazz) {
            window.customElements.define(tagName, clazz);
        }
    };
};
/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * ```
 * @customElement('my-element')
 * class MyElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 * @category Decorator
 * @param tagName The name of the custom element to define.
 */
const customElement = (tagName) => (classOrDescriptor) => (typeof classOrDescriptor === 'function') ?
    legacyCustomElement(tagName, classOrDescriptor) :
    standardCustomElement(tagName, classOrDescriptor);
const standardProperty = (options, element) => {
    // When decorating an accessor, pass it through and add property metadata.
    // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
    // stomp over the user's accessor.
    if (element.kind === 'method' && element.descriptor &&
        !('value' in element.descriptor)) {
        return Object.assign(Object.assign({}, element), { finisher(clazz) {
                clazz.createProperty(element.key, options);
            } });
    }
    else {
        // createProperty() takes care of defining the property, but we still
        // must return some kind of descriptor, so return a descriptor for an
        // unused prototype field. The finisher calls createProperty().
        return {
            kind: 'field',
            key: Symbol(),
            placement: 'own',
            descriptor: {},
            // When @babel/plugin-proposal-decorators implements initializers,
            // do this instead of the initializer below. See:
            // https://github.com/babel/babel/issues/9260 extras: [
            //   {
            //     kind: 'initializer',
            //     placement: 'own',
            //     initializer: descriptor.initializer,
            //   }
            // ],
            initializer() {
                if (typeof element.initializer === 'function') {
                    this[element.key] = element.initializer.call(this);
                }
            },
            finisher(clazz) {
                clazz.createProperty(element.key, options);
            }
        };
    }
};
const legacyProperty = (options, proto, name) => {
    proto.constructor
        .createProperty(name, options);
};
/**
 * A property decorator which creates a LitElement property which reflects a
 * corresponding attribute value. A [[`PropertyDeclaration`]] may optionally be
 * supplied to configure property features.
 *
 * This decorator should only be used for public fields. Private or protected
 * fields should use the [[`internalProperty`]] decorator.
 *
 * @example
 * ```ts
 * class MyElement {
 *   @property({ type: Boolean })
 *   clicked = false;
 * }
 * ```
 * @category Decorator
 * @ExportDecoratedItems
 */
function property(options) {
    // tslint:disable-next-line:no-any decorator
    return (protoOrDescriptor, name) => (name !== undefined) ?
        legacyProperty(options, protoOrDescriptor, name) :
        standardProperty(options, protoOrDescriptor);
}
/**
 * Declares a private or protected property that still triggers updates to the
 * element when it changes.
 *
 * Properties declared this way must not be used from HTML or HTML templating
 * systems, they're solely for properties internal to the element. These
 * properties may be renamed by optimization tools like closure compiler.
 * @category Decorator
 */
function internalProperty(options) {
    return property({ attribute: false, hasChanged: options === null || options === void 0 ? void 0 : options.hasChanged });
}
/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 * @param cache An optional boolean which when true performs the DOM query only
 * once and caches the result.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * @example
 *
 * ```ts
 * class MyElement {
 *   @query('#first')
 *   first;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
function query(selector, cache) {
    return (protoOrDescriptor, 
    // tslint:disable-next-line:no-any decorator
    name) => {
        const descriptor = {
            get() {
                return this.renderRoot.querySelector(selector);
            },
            enumerable: true,
            configurable: true,
        };
        if (cache) {
            const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
            descriptor.get = function () {
                if (this[key] === undefined) {
                    (this[key] =
                        this.renderRoot.querySelector(selector));
                }
                return this[key];
            };
        }
        return (name !== undefined) ?
            legacyQuery(descriptor, protoOrDescriptor, name) :
            standardQuery(descriptor, protoOrDescriptor);
    };
}
// Note, in the future, we may extend this decorator to support the use case
// where the queried element may need to do work to become ready to interact
// with (e.g. load some implementation code). If so, we might elect to
// add a second argument defining a function that can be run to make the
// queried element loaded/updated/ready.
/**
 * A property decorator that converts a class property into a getter that
 * returns a promise that resolves to the result of a querySelector on the
 * element's renderRoot done after the element's `updateComplete` promise
 * resolves. When the queried property may change with element state, this
 * decorator can be used instead of requiring users to await the
 * `updateComplete` before accessing the property.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * @example
 * ```ts
 * class MyElement {
 *   @queryAsync('#first')
 *   first;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 *
 * // external usage
 * async doSomethingWithFirst() {
 *  (await aMyElement.first).doSomething();
 * }
 * ```
 * @category Decorator
 */
function queryAsync(selector) {
    return (protoOrDescriptor, 
    // tslint:disable-next-line:no-any decorator
    name) => {
        const descriptor = {
            async get() {
                await this.updateComplete;
                return this.renderRoot.querySelector(selector);
            },
            enumerable: true,
            configurable: true,
        };
        return (name !== undefined) ?
            legacyQuery(descriptor, protoOrDescriptor, name) :
            standardQuery(descriptor, protoOrDescriptor);
    };
}
/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See:
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
 *
 * @example
 * ```ts
 * class MyElement {
 *   @queryAll('div')
 *   divs;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
function queryAll(selector) {
    return (protoOrDescriptor, 
    // tslint:disable-next-line:no-any decorator
    name) => {
        const descriptor = {
            get() {
                return this.renderRoot.querySelectorAll(selector);
            },
            enumerable: true,
            configurable: true,
        };
        return (name !== undefined) ?
            legacyQuery(descriptor, protoOrDescriptor, name) :
            standardQuery(descriptor, protoOrDescriptor);
    };
}
const legacyQuery = (descriptor, proto, name) => {
    Object.defineProperty(proto, name, descriptor);
};
const standardQuery = (descriptor, element) => ({
    kind: 'method',
    placement: 'prototype',
    key: element.key,
    descriptor,
});
const standardEventOptions = (options, element) => {
    return Object.assign(Object.assign({}, element), { finisher(clazz) {
            Object.assign(clazz.prototype[element.key], options);
        } });
};
const legacyEventOptions = 
// tslint:disable-next-line:no-any legacy decorator
(options, proto, name) => {
    Object.assign(proto[name], options);
};
/**
 * Adds event listener options to a method used as an event listener in a
 * lit-html template.
 *
 * @param options An object that specifies event listener options as accepted by
 * `EventTarget#addEventListener` and `EventTarget#removeEventListener`.
 *
 * Current browsers support the `capture`, `passive`, and `once` options. See:
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters
 *
 * @example
 * ```ts
 * class MyElement {
 *   clicked = false;
 *
 *   render() {
 *     return html`
 *       <div @click=${this._onClick}`>
 *         <button></button>
 *       </div>
 *     `;
 *   }
 *
 *   @eventOptions({capture: true})
 *   _onClick(e) {
 *     this.clicked = true;
 *   }
 * }
 * ```
 * @category Decorator
 */
function eventOptions(options) {
    // Return value typed as any to prevent TypeScript from complaining that
    // standard decorator function signature does not match TypeScript decorator
    // signature
    // TODO(kschaaf): unclear why it was only failing on this decorator and not
    // the others
    return ((protoOrDescriptor, name) => (name !== undefined) ?
        legacyEventOptions(options, protoOrDescriptor, name) :
        standardEventOptions(options, protoOrDescriptor));
}
// x-browser support for matches
// tslint:disable-next-line:no-any
const ElementProto = Element.prototype;
const legacyMatches = ElementProto.msMatchesSelector || ElementProto.webkitMatchesSelector;
/**
 * A property decorator that converts a class property into a getter that
 * returns the `assignedNodes` of the given named `slot`. Note, the type of
 * this property should be annotated as `NodeListOf<HTMLElement>`.
 *
 * @param slotName A string name of the slot.
 * @param flatten A boolean which when true flattens the assigned nodes,
 * meaning any assigned nodes that are slot elements are replaced with their
 * assigned nodes.
 * @param selector A string which filters the results to elements that match
 * the given css selector.
 *
 * * @example
 * ```ts
 * class MyElement {
 *   @queryAssignedNodes('list', true, '.item')
 *   listItems;
 *
 *   render() {
 *     return html`
 *       <slot name="list"></slot>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
function queryAssignedNodes(slotName = '', flatten = false, selector = '') {
    return (protoOrDescriptor, 
    // tslint:disable-next-line:no-any decorator
    name) => {
        const descriptor = {
            get() {
                const slotSelector = `slot${slotName ? `[name=${slotName}]` : ':not([name])'}`;
                const slot = this.renderRoot.querySelector(slotSelector);
                let nodes = slot && slot.assignedNodes({ flatten });
                if (nodes && selector) {
                    nodes = nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE &&
                        node.matches ?
                        node.matches(selector) :
                        legacyMatches.call(node, selector));
                }
                return nodes;
            },
            enumerable: true,
            configurable: true,
        };
        return (name !== undefined) ?
            legacyQuery(descriptor, protoOrDescriptor, name) :
            standardQuery(descriptor, protoOrDescriptor);
    };
}
//# sourceMappingURL=decorators.js.map

/***/ }),

/***/ "./node_modules/lit-element/lib/updating-element.js":
/*!**********************************************************!*\
  !*** ./node_modules/lit-element/lib/updating-element.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaultConverter": () => (/* binding */ defaultConverter),
/* harmony export */   "notEqual": () => (/* binding */ notEqual),
/* harmony export */   "UpdatingElement": () => (/* binding */ UpdatingElement)
/* harmony export */ });
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var _a;
/**
 * Use this module if you want to create your own base class extending
 * [[UpdatingElement]].
 * @packageDocumentation
 */
/*
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
window.JSCompiler_renameProperty =
    (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value ? '' : null;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                return value == null ? value : JSON.stringify(value);
        }
        return value;
    },
    fromAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value !== null;
            case Number:
                return value === null ? null : Number(value);
            case Object:
            case Array:
                return JSON.parse(value);
        }
        return value;
    }
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual
};
const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
/**
 * The Closure JS Compiler doesn't currently have good support for static
 * property semantics where "this" is dynamic (e.g.
 * https://github.com/google/closure-compiler/issues/3177 and others) so we use
 * this hack to bypass any rewriting by the compiler.
 */
const finalized = 'finalized';
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 * @noInheritDoc
 */
class UpdatingElement extends HTMLElement {
    constructor() {
        super();
        this.initialize();
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     */
    static get observedAttributes() {
        // note: piggy backing on this to ensure we're finalized.
        this.finalize();
        const attributes = [];
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this._classProperties.forEach((v, p) => {
            const attr = this._attributeNameForProperty(p, v);
            if (attr !== undefined) {
                this._attributeToPropertyMap.set(attr, p);
                attributes.push(attr);
            }
        });
        return attributes;
    }
    /**
     * Ensures the private `_classProperties` property metadata is created.
     * In addition to `finalize` this is also called in `createProperty` to
     * ensure the `@property` decorator can add property metadata.
     */
    /** @nocollapse */
    static _ensureClassProperties() {
        // ensure private storage for property declarations.
        if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
            this._classProperties = new Map();
            // NOTE: Workaround IE11 not supporting Map constructor argument.
            const superProperties = Object.getPrototypeOf(this)._classProperties;
            if (superProperties !== undefined) {
                superProperties.forEach((v, k) => this._classProperties.set(k, v));
            }
        }
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a PropertyDeclaration for the property with the given options.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     *
     * @nocollapse
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        // Note, since this can be called by the `@property` decorator which
        // is called before `finalize`, we ensure storage exists for property
        // metadata.
        this._ensureClassProperties();
        this._classProperties.set(name, options);
        // Do not generate an accessor if the prototype already has one, since
        // it would be lost otherwise and that would never be the user's intention;
        // Instead, we expect users to call `requestUpdate` themselves from
        // user-defined accessors. Note that if the super has an accessor we will
        // still overwrite it
        if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
            return;
        }
        const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
        const descriptor = this.getPropertyDescriptor(name, key, options);
        if (descriptor !== undefined) {
            Object.defineProperty(this.prototype, name, descriptor);
        }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     *   class MyElement extends LitElement {
     *     static getPropertyDescriptor(name, key, options) {
     *       const defaultDescriptor =
     *           super.getPropertyDescriptor(name, key, options);
     *       const setter = defaultDescriptor.set;
     *       return {
     *         get: defaultDescriptor.get,
     *         set(value) {
     *           setter.call(this, value);
     *           // custom action.
     *         },
     *         configurable: true,
     *         enumerable: true
     *       }
     *     }
     *   }
     *
     * @nocollapse
     */
    static getPropertyDescriptor(name, key, options) {
        return {
            // tslint:disable-next-line:no-any no symbol in index
            get() {
                return this[key];
            },
            set(value) {
                const oldValue = this[name];
                this[key] = value;
                this
                    .requestUpdateInternal(name, oldValue, options);
            },
            configurable: true,
            enumerable: true
        };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a PropertyDeclaration via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override `createProperty`.
     *
     * @nocollapse
     * @final
     */
    static getPropertyOptions(name) {
        return this._classProperties && this._classProperties.get(name) ||
            defaultPropertyDeclaration;
    }
    /**
     * Creates property accessors for registered properties and ensures
     * any superclasses are also finalized.
     * @nocollapse
     */
    static finalize() {
        // finalize any superclasses
        const superCtor = Object.getPrototypeOf(this);
        if (!superCtor.hasOwnProperty(finalized)) {
            superCtor.finalize();
        }
        this[finalized] = true;
        this._ensureClassProperties();
        // initialize Map populated in observedAttributes
        this._attributeToPropertyMap = new Map();
        // make any properties
        // Note, only process "own" properties since this element will inherit
        // any properties defined on the superClass, and finalization ensures
        // the entire prototype chain is finalized.
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
            const props = this.properties;
            // support symbols in properties (IE11 does not support this)
            const propKeys = [
                ...Object.getOwnPropertyNames(props),
                ...(typeof Object.getOwnPropertySymbols === 'function') ?
                    Object.getOwnPropertySymbols(props) :
                    []
            ];
            // This for/of is ok because propKeys is an array
            for (const p of propKeys) {
                // note, use of `any` is due to TypeSript lack of support for symbol in
                // index types
                // tslint:disable-next-line:no-any no symbol in index
                this.createProperty(p, props[p]);
            }
        }
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static _attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false ?
            undefined :
            (typeof attribute === 'string' ?
                attribute :
                (typeof name === 'string' ? name.toLowerCase() : undefined));
    }
    /**
     * Returns true if a property should request an update.
     * Called when a property value is set and uses the `hasChanged`
     * option for the property if present or a strict identity check.
     * @nocollapse
     */
    static _valueHasChanged(value, old, hasChanged = notEqual) {
        return hasChanged(value, old);
    }
    /**
     * Returns the property value for the given attribute value.
     * Called via the `attributeChangedCallback` and uses the property's
     * `converter` or `converter.fromAttribute` property option.
     * @nocollapse
     */
    static _propertyValueFromAttribute(value, options) {
        const type = options.type;
        const converter = options.converter || defaultConverter;
        const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
        return fromAttribute ? fromAttribute(value, type) : value;
    }
    /**
     * Returns the attribute value for the given property value. If this
     * returns undefined, the property will *not* be reflected to an attribute.
     * If this returns null, the attribute will be removed, otherwise the
     * attribute will be set to the value.
     * This uses the property's `reflect` and `type.toAttribute` property options.
     * @nocollapse
     */
    static _propertyValueToAttribute(value, options) {
        if (options.reflect === undefined) {
            return;
        }
        const type = options.type;
        const converter = options.converter;
        const toAttribute = converter && converter.toAttribute ||
            defaultConverter.toAttribute;
        return toAttribute(value, type);
    }
    /**
     * Performs element initialization. By default captures any pre-set values for
     * registered properties.
     */
    initialize() {
        this._updateState = 0;
        this._updatePromise =
            new Promise((res) => this._enableUpdatingResolver = res);
        this._changedProperties = new Map();
        this._saveInstanceProperties();
        // ensures first update will be caught by an early access of
        // `updateComplete`
        this.requestUpdateInternal();
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */
    _saveInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.constructor
            ._classProperties.forEach((_v, p) => {
            if (this.hasOwnProperty(p)) {
                const value = this[p];
                delete this[p];
                if (!this._instanceProperties) {
                    this._instanceProperties = new Map();
                }
                this._instanceProperties.set(p, value);
            }
        });
    }
    /**
     * Applies previously saved instance properties.
     */
    _applyInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        // tslint:disable-next-line:no-any
        this._instanceProperties.forEach((v, p) => this[p] = v);
        this._instanceProperties = undefined;
    }
    connectedCallback() {
        // Ensure first connection completes an update. Updates cannot complete
        // before connection.
        this.enableUpdating();
    }
    enableUpdating() {
        if (this._enableUpdatingResolver !== undefined) {
            this._enableUpdatingResolver();
            this._enableUpdatingResolver = undefined;
        }
    }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     */
    disconnectedCallback() {
    }
    /**
     * Synchronizes property values when attributes change.
     */
    attributeChangedCallback(name, old, value) {
        if (old !== value) {
            this._attributeToProperty(name, value);
        }
    }
    _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
        const ctor = this.constructor;
        const attr = ctor._attributeNameForProperty(name, options);
        if (attr !== undefined) {
            const attrValue = ctor._propertyValueToAttribute(value, options);
            // an undefined value does not change the attribute.
            if (attrValue === undefined) {
                return;
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
        }
    }
    _attributeToProperty(name, value) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
            return;
        }
        const ctor = this.constructor;
        // Note, hint this as an `AttributeMap` so closure clearly understands
        // the type; it has issues with tracking types through statics
        // tslint:disable-next-line:no-unnecessary-type-assertion
        const propName = ctor._attributeToPropertyMap.get(name);
        if (propName !== undefined) {
            const options = ctor.getPropertyOptions(propName);
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
            this[propName] =
                // tslint:disable-next-line:no-any
                ctor._propertyValueFromAttribute(value, options);
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
        }
    }
    /**
     * This protected version of `requestUpdate` does not access or return the
     * `updateComplete` promise. This promise can be overridden and is therefore
     * not free to access.
     */
    requestUpdateInternal(name, oldValue, options) {
        let shouldRequestUpdate = true;
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            const ctor = this.constructor;
            options = options || ctor.getPropertyOptions(name);
            if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
                if (!this._changedProperties.has(name)) {
                    this._changedProperties.set(name, oldValue);
                }
                // Add to reflecting properties set.
                // Note, it's important that every change has a chance to add the
                // property to `_reflectingProperties`. This ensures setting
                // attribute + property reflects correctly.
                if (options.reflect === true &&
                    !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
                    if (this._reflectingProperties === undefined) {
                        this._reflectingProperties = new Map();
                    }
                    this._reflectingProperties.set(name, options);
                }
            }
            else {
                // Abort the request if the property should not be considered changed.
                shouldRequestUpdate = false;
            }
        }
        if (!this._hasRequestedUpdate && shouldRequestUpdate) {
            this._updatePromise = this._enqueueUpdate();
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should
     * be called when an element should update based on some state not triggered
     * by setting a property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored. Returns the `updateComplete` Promise which is resolved
     * when the update completes.
     *
     * @param name {PropertyKey} (optional) name of requesting property
     * @param oldValue {any} (optional) old value of requesting property
     * @returns {Promise} A Promise that is resolved when the update completes.
     */
    requestUpdate(name, oldValue) {
        this.requestUpdateInternal(name, oldValue);
        return this.updateComplete;
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async _enqueueUpdate() {
        this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await this._updatePromise;
        }
        catch (e) {
            // Ignore any previous errors. We only care that the previous cycle is
            // done. Any error should have been handled in the previous update.
        }
        const result = this.performUpdate();
        // If `performUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.
        if (result != null) {
            await result;
        }
        return !this._hasRequestedUpdate;
    }
    get _hasRequestedUpdate() {
        return (this._updateState & STATE_UPDATE_REQUESTED);
    }
    get hasUpdated() {
        return (this._updateState & STATE_HAS_UPDATED);
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * You can override this method to change the timing of updates. If this
     * method is overridden, `super.performUpdate()` must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```
     * protected async performUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.performUpdate();
     * }
     * ```
     */
    performUpdate() {
        // Abort any update if one is not pending when this is called.
        // This can happen if `performUpdate` is called early to "flush"
        // the update.
        if (!this._hasRequestedUpdate) {
            return;
        }
        // Mixin instance properties once, if they exist.
        if (this._instanceProperties) {
            this._applyInstanceProperties();
        }
        let shouldUpdate = false;
        const changedProperties = this._changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.update(changedProperties);
            }
            else {
                this._markUpdated();
            }
        }
        catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            // Ensure element can accept additional updates after an exception.
            this._markUpdated();
            throw e;
        }
        if (shouldUpdate) {
            if (!(this._updateState & STATE_HAS_UPDATED)) {
                this._updateState = this._updateState | STATE_HAS_UPDATED;
                this.firstUpdated(changedProperties);
            }
            this.updated(changedProperties);
        }
    }
    _markUpdated() {
        this._changedProperties = new Map();
        this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `_getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super._getUpdateComplete()`, then any subsequent state.
     *
     * @returns {Promise} The Promise returns a boolean that indicates if the
     * update resolved without triggering another update.
     */
    get updateComplete() {
        return this._getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async _getUpdateComplete() {
     *       await super._getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     */
    _getUpdateComplete() {
        return this._updatePromise;
    }
    /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    update(_changedProperties) {
        if (this._reflectingProperties !== undefined &&
            this._reflectingProperties.size > 0) {
            // Use forEach so this works even if for/of loops are compiled to for
            // loops expecting arrays
            this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
            this._reflectingProperties = undefined;
        }
        this._markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    updated(_changedProperties) {
    }
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    firstUpdated(_changedProperties) {
    }
}
_a = finalized;
/**
 * Marks class as having finished creating properties.
 */
UpdatingElement[_a] = true;
//# sourceMappingURL=updating-element.js.map

/***/ }),

/***/ "./node_modules/lit-element/lit-element.js":
/*!*************************************************!*\
  !*** ./node_modules/lit-element/lit-element.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UpdatingElement": () => (/* reexport safe */ _lib_updating_element_js__WEBPACK_IMPORTED_MODULE_1__.UpdatingElement),
/* harmony export */   "defaultConverter": () => (/* reexport safe */ _lib_updating_element_js__WEBPACK_IMPORTED_MODULE_1__.defaultConverter),
/* harmony export */   "notEqual": () => (/* reexport safe */ _lib_updating_element_js__WEBPACK_IMPORTED_MODULE_1__.notEqual),
/* harmony export */   "customElement": () => (/* reexport safe */ _lib_decorators_js__WEBPACK_IMPORTED_MODULE_2__.customElement),
/* harmony export */   "eventOptions": () => (/* reexport safe */ _lib_decorators_js__WEBPACK_IMPORTED_MODULE_2__.eventOptions),
/* harmony export */   "internalProperty": () => (/* reexport safe */ _lib_decorators_js__WEBPACK_IMPORTED_MODULE_2__.internalProperty),
/* harmony export */   "property": () => (/* reexport safe */ _lib_decorators_js__WEBPACK_IMPORTED_MODULE_2__.property),
/* harmony export */   "query": () => (/* reexport safe */ _lib_decorators_js__WEBPACK_IMPORTED_MODULE_2__.query),
/* harmony export */   "queryAll": () => (/* reexport safe */ _lib_decorators_js__WEBPACK_IMPORTED_MODULE_2__.queryAll),
/* harmony export */   "queryAssignedNodes": () => (/* reexport safe */ _lib_decorators_js__WEBPACK_IMPORTED_MODULE_2__.queryAssignedNodes),
/* harmony export */   "queryAsync": () => (/* reexport safe */ _lib_decorators_js__WEBPACK_IMPORTED_MODULE_2__.queryAsync),
/* harmony export */   "html": () => (/* reexport safe */ lit_html_lit_html_js__WEBPACK_IMPORTED_MODULE_3__.html),
/* harmony export */   "svg": () => (/* reexport safe */ lit_html_lit_html_js__WEBPACK_IMPORTED_MODULE_3__.svg),
/* harmony export */   "TemplateResult": () => (/* reexport safe */ lit_html_lit_html_js__WEBPACK_IMPORTED_MODULE_3__.TemplateResult),
/* harmony export */   "SVGTemplateResult": () => (/* reexport safe */ lit_html_lit_html_js__WEBPACK_IMPORTED_MODULE_3__.SVGTemplateResult),
/* harmony export */   "CSSResult": () => (/* reexport safe */ _lib_css_tag_js__WEBPACK_IMPORTED_MODULE_4__.CSSResult),
/* harmony export */   "css": () => (/* reexport safe */ _lib_css_tag_js__WEBPACK_IMPORTED_MODULE_4__.css),
/* harmony export */   "supportsAdoptingStyleSheets": () => (/* reexport safe */ _lib_css_tag_js__WEBPACK_IMPORTED_MODULE_4__.supportsAdoptingStyleSheets),
/* harmony export */   "unsafeCSS": () => (/* reexport safe */ _lib_css_tag_js__WEBPACK_IMPORTED_MODULE_4__.unsafeCSS),
/* harmony export */   "LitElement": () => (/* binding */ LitElement)
/* harmony export */ });
/* harmony import */ var lit_html_lib_shady_render_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit-html/lib/shady-render.js */ "./node_modules/lit-html/lib/shady-render.js");
/* harmony import */ var _lib_updating_element_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/updating-element.js */ "./node_modules/lit-element/lib/updating-element.js");
/* harmony import */ var _lib_decorators_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/decorators.js */ "./node_modules/lit-element/lib/decorators.js");
/* harmony import */ var lit_html_lit_html_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lit-html/lit-html.js */ "./node_modules/lit-html/lit-html.js");
/* harmony import */ var _lib_css_tag_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/css-tag.js */ "./node_modules/lit-element/lib/css-tag.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * The main LitElement module, which defines the [[`LitElement`]] base class and
 * related APIs.
 *
 *  LitElement components can define a template and a set of observed
 * properties. Changing an observed property triggers a re-render of the
 * element.
 *
 *  Import [[`LitElement`]] and [[`html`]] from this module to create a
 * component:
 *
 *  ```js
 * import {LitElement, html} from 'lit-element';
 *
 * class MyElement extends LitElement {
 *
 *   // Declare observed properties
 *   static get properties() {
 *     return {
 *       adjective: {}
 *     }
 *   }
 *
 *   constructor() {
 *     this.adjective = 'awesome';
 *   }
 *
 *   // Define the element's template
 *   render() {
 *     return html`<p>your ${adjective} template here</p>`;
 *   }
 * }
 *
 * customElements.define('my-element', MyElement);
 * ```
 *
 * `LitElement` extends [[`UpdatingElement`]] and adds lit-html templating.
 * The `UpdatingElement` class is provided for users that want to build
 * their own custom element base classes that don't use lit-html.
 *
 * @packageDocumentation
 */







// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
(window['litElementVersions'] || (window['litElementVersions'] = []))
    .push('2.4.0');
/**
 * Sentinal value used to avoid calling lit-html's render function when
 * subclasses do not implement `render`
 */
const renderNotImplemented = {};
/**
 * Base element class that manages element properties and attributes, and
 * renders a lit-html template.
 *
 * To define a component, subclass `LitElement` and implement a
 * `render` method to provide the component's template. Define properties
 * using the [[`properties`]] property or the [[`property`]] decorator.
 */
class LitElement extends _lib_updating_element_js__WEBPACK_IMPORTED_MODULE_1__.UpdatingElement {
    /**
     * Return the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * @nocollapse
     */
    static getStyles() {
        return this.styles;
    }
    /** @nocollapse */
    static _getUniqueStyles() {
        // Only gather styles once per class
        if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) {
            return;
        }
        // Take care not to call `this.getStyles()` multiple times since this
        // generates new CSSResults each time.
        // TODO(sorvell): Since we do not cache CSSResults by input, any
        // shared styles will generate new stylesheet objects, which is wasteful.
        // This should be addressed when a browser ships constructable
        // stylesheets.
        const userStyles = this.getStyles();
        if (Array.isArray(userStyles)) {
            // De-duplicate styles preserving the _last_ instance in the set.
            // This is a performance optimization to avoid duplicated styles that can
            // occur especially when composing via subclassing.
            // The last item is kept to try to preserve the cascade order with the
            // assumption that it's most important that last added styles override
            // previous styles.
            const addStyles = (styles, set) => styles.reduceRight((set, s) => 
            // Note: On IE set.add() does not return the set
            Array.isArray(s) ? addStyles(s, set) : (set.add(s), set), set);
            // Array.from does not work on Set in IE, otherwise return
            // Array.from(addStyles(userStyles, new Set<CSSResult>())).reverse()
            const set = addStyles(userStyles, new Set());
            const styles = [];
            set.forEach((v) => styles.unshift(v));
            this._styles = styles;
        }
        else {
            this._styles = userStyles === undefined ? [] : [userStyles];
        }
        // Ensure that there are no invalid CSSStyleSheet instances here. They are
        // invalid in two conditions.
        // (1) the sheet is non-constructible (`sheet` of a HTMLStyleElement), but
        //     this is impossible to check except via .replaceSync or use
        // (2) the ShadyCSS polyfill is enabled (:. supportsAdoptingStyleSheets is
        //     false)
        this._styles = this._styles.map((s) => {
            if (s instanceof CSSStyleSheet && !_lib_css_tag_js__WEBPACK_IMPORTED_MODULE_4__.supportsAdoptingStyleSheets) {
                // Flatten the cssText from the passed constructible stylesheet (or
                // undetectable non-constructible stylesheet). The user might have
                // expected to update their stylesheets over time, but the alternative
                // is a crash.
                const cssText = Array.prototype.slice.call(s.cssRules)
                    .reduce((css, rule) => css + rule.cssText, '');
                return (0,_lib_css_tag_js__WEBPACK_IMPORTED_MODULE_4__.unsafeCSS)(cssText);
            }
            return s;
        });
    }
    /**
     * Performs element initialization. By default this calls
     * [[`createRenderRoot`]] to create the element [[`renderRoot`]] node and
     * captures any pre-set values for registered properties.
     */
    initialize() {
        super.initialize();
        this.constructor._getUniqueStyles();
        this.renderRoot = this.createRenderRoot();
        // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
        // element's getRootNode(). While this could be done, we're choosing not to
        // support this now since it would require different logic around de-duping.
        if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
            this.adoptStyles();
        }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */
    createRenderRoot() {
        return this.attachShadow({ mode: 'open' });
    }
    /**
     * Applies styling to the element shadowRoot using the [[`styles`]]
     * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
     * available and will fallback otherwise. When Shadow DOM is polyfilled,
     * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
     * is available but `adoptedStyleSheets` is not, styles are appended to the
     * end of the `shadowRoot` to [mimic spec
     * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
     */
    adoptStyles() {
        const styles = this.constructor._styles;
        if (styles.length === 0) {
            return;
        }
        // There are three separate cases here based on Shadow DOM support.
        // (1) shadowRoot polyfilled: use ShadyCSS
        // (2) shadowRoot.adoptedStyleSheets available: use it
        // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
        // rendering
        if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
            window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map((s) => s.cssText), this.localName);
        }
        else if (_lib_css_tag_js__WEBPACK_IMPORTED_MODULE_4__.supportsAdoptingStyleSheets) {
            this.renderRoot.adoptedStyleSheets =
                styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
        }
        else {
            // This must be done after rendering so the actual style insertion is done
            // in `update`.
            this._needsShimAdoptedStyleSheets = true;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        // Note, first update/render handles styleElement so we only call this if
        // connected after first update.
        if (this.hasUpdated && window.ShadyCSS !== undefined) {
            window.ShadyCSS.styleElement(this);
        }
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param _changedProperties Map of changed properties with old values
     */
    update(changedProperties) {
        // Setting properties in `render` should not trigger an update. Since
        // updates are allowed after super.update, it's important to call `render`
        // before that.
        const templateResult = this.render();
        super.update(changedProperties);
        // If render is not implemented by the component, don't call lit-html render
        if (templateResult !== renderNotImplemented) {
            this.constructor
                .render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
        }
        // When native Shadow DOM is used but adoptedStyles are not supported,
        // insert styling after rendering to ensure adoptedStyles have highest
        // priority.
        if (this._needsShimAdoptedStyleSheets) {
            this._needsShimAdoptedStyleSheets = false;
            this.constructor._styles.forEach((s) => {
                const style = document.createElement('style');
                style.textContent = s.cssText;
                this.renderRoot.appendChild(style);
            });
        }
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's `NodePart` - typically a
     * `TemplateResult`. Setting properties inside this method will *not* trigger
     * the element to update.
     */
    render() {
        return renderNotImplemented;
    }
}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See updating-element.ts for more information.
 */
LitElement['finalized'] = true;
/**
 * Reference to the underlying library method used to render the element's
 * DOM. By default, points to the `render` method from lit-html's shady-render
 * module.
 *
 * **Most users will never need to touch this property.**
 *
 * This  property should not be confused with the `render` instance method,
 * which should be overridden to define a template for the element.
 *
 * Advanced users creating a new base class based on LitElement can override
 * this property to point to a custom render method with a signature that
 * matches [shady-render's `render`
 * method](https://lit-html.polymer-project.org/api/modules/shady_render.html#render).
 *
 * @nocollapse
 */
LitElement.render = lit_html_lib_shady_render_js__WEBPACK_IMPORTED_MODULE_0__.render;
//# sourceMappingURL=lit-element.js.map

/***/ }),

/***/ "./node_modules/lit-html/directives/class-map.js":
/*!*******************************************************!*\
  !*** ./node_modules/lit-html/directives/class-map.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "classMap": () => (/* binding */ classMap)
/* harmony export */ });
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lit-html.js */ "./node_modules/lit-html/lit-html.js");
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

// IE11 doesn't support classList on SVG elements, so we emulate it with a Set
class ClassList {
    constructor(element) {
        this.classes = new Set();
        this.changed = false;
        this.element = element;
        const classList = (element.getAttribute('class') || '').split(/\s+/);
        for (const cls of classList) {
            this.classes.add(cls);
        }
    }
    add(cls) {
        this.classes.add(cls);
        this.changed = true;
    }
    remove(cls) {
        this.classes.delete(cls);
        this.changed = true;
    }
    commit() {
        if (this.changed) {
            let classString = '';
            this.classes.forEach((cls) => classString += cls + ' ');
            this.element.setAttribute('class', classString);
        }
    }
}
/**
 * Stores the ClassInfo object applied to a given AttributePart.
 * Used to unset existing values when a new ClassInfo object is applied.
 */
const previousClassesCache = new WeakMap();
/**
 * A directive that applies CSS classes. This must be used in the `class`
 * attribute and must be the only part used in the attribute. It takes each
 * property in the `classInfo` argument and adds the property name to the
 * element's `class` if the property value is truthy; if the property value is
 * falsey, the property name is removed from the element's `class`. For example
 * `{foo: bar}` applies the class `foo` if the value of `bar` is truthy.
 * @param classInfo {ClassInfo}
 */
const classMap = (0,_lit_html_js__WEBPACK_IMPORTED_MODULE_0__.directive)((classInfo) => (part) => {
    if (!(part instanceof _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.AttributePart) || (part instanceof _lit_html_js__WEBPACK_IMPORTED_MODULE_0__.PropertyPart) ||
        part.committer.name !== 'class' || part.committer.parts.length > 1) {
        throw new Error('The `classMap` directive must be used in the `class` attribute ' +
            'and must be the only part in the attribute.');
    }
    const { committer } = part;
    const { element } = committer;
    let previousClasses = previousClassesCache.get(part);
    if (previousClasses === undefined) {
        // Write static classes once
        // Use setAttribute() because className isn't a string on SVG elements
        element.setAttribute('class', committer.strings.join(' '));
        previousClassesCache.set(part, previousClasses = new Set());
    }
    const classList = (element.classList || new ClassList(element));
    // Remove old classes that no longer apply
    // We use forEach() instead of for-of so that re don't require down-level
    // iteration.
    previousClasses.forEach((name) => {
        if (!(name in classInfo)) {
            classList.remove(name);
            previousClasses.delete(name);
        }
    });
    // Add or remove classes based on their classMap value
    for (const name in classInfo) {
        const value = classInfo[name];
        if (value != previousClasses.has(name)) {
            // We explicitly want a loose truthy check of `value` because it seems
            // more convenient that '' and 0 are skipped.
            if (value) {
                classList.add(name);
                previousClasses.add(name);
            }
            else {
                classList.remove(name);
                previousClasses.delete(name);
            }
        }
    }
    if (typeof classList.commit === 'function') {
        classList.commit();
    }
});
//# sourceMappingURL=class-map.js.map

/***/ }),

/***/ "./node_modules/lit-html/directives/unsafe-html.js":
/*!*********************************************************!*\
  !*** ./node_modules/lit-html/directives/unsafe-html.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "unsafeHTML": () => (/* binding */ unsafeHTML)
/* harmony export */ });
/* harmony import */ var _lib_parts_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/parts.js */ "./node_modules/lit-html/lib/parts.js");
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lit-html.js */ "./node_modules/lit-html/lit-html.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


// For each part, remember the value that was last rendered to the part by the
// unsafeHTML directive, and the DocumentFragment that was last set as a value.
// The DocumentFragment is used as a unique key to check if the last value
// rendered to the part was with unsafeHTML. If not, we'll always re-render the
// value passed to unsafeHTML.
const previousValues = new WeakMap();
/**
 * Renders the result as HTML, rather than text.
 *
 * Note, this is unsafe to use with any user-provided input that hasn't been
 * sanitized or escaped, as it may lead to cross-site-scripting
 * vulnerabilities.
 */
const unsafeHTML = (0,_lit_html_js__WEBPACK_IMPORTED_MODULE_1__.directive)((value) => (part) => {
    if (!(part instanceof _lit_html_js__WEBPACK_IMPORTED_MODULE_1__.NodePart)) {
        throw new Error('unsafeHTML can only be used in text bindings');
    }
    const previousValue = previousValues.get(part);
    if (previousValue !== undefined && (0,_lib_parts_js__WEBPACK_IMPORTED_MODULE_0__.isPrimitive)(value) &&
        value === previousValue.value && part.value === previousValue.fragment) {
        return;
    }
    const template = document.createElement('template');
    template.innerHTML = value; // innerHTML casts to string internally
    const fragment = document.importNode(template.content, true);
    part.setValue(fragment);
    previousValues.set(part, { value, fragment });
});
//# sourceMappingURL=unsafe-html.js.map

/***/ }),

/***/ "./node_modules/lit-html/directives/until.js":
/*!***************************************************!*\
  !*** ./node_modules/lit-html/directives/until.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "until": () => (/* binding */ until)
/* harmony export */ });
/* harmony import */ var _lib_parts_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/parts.js */ "./node_modules/lit-html/lib/parts.js");
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lit-html.js */ "./node_modules/lit-html/lit-html.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


const _state = new WeakMap();
// Effectively infinity, but a SMI.
const _infinity = 0x7fffffff;
/**
 * Renders one of a series of values, including Promises, to a Part.
 *
 * Values are rendered in priority order, with the first argument having the
 * highest priority and the last argument having the lowest priority. If a
 * value is a Promise, low-priority values will be rendered until it resolves.
 *
 * The priority of values can be used to create placeholder content for async
 * data. For example, a Promise with pending content can be the first,
 * highest-priority, argument, and a non_promise loading indicator template can
 * be used as the second, lower-priority, argument. The loading indicator will
 * render immediately, and the primary content will render when the Promise
 * resolves.
 *
 * Example:
 *
 *     const content = fetch('./content.txt').then(r => r.text());
 *     html`${until(content, html`<span>Loading...</span>`)}`
 */
const until = (0,_lit_html_js__WEBPACK_IMPORTED_MODULE_1__.directive)((...args) => (part) => {
    let state = _state.get(part);
    if (state === undefined) {
        state = {
            lastRenderedIndex: _infinity,
            values: [],
        };
        _state.set(part, state);
    }
    const previousValues = state.values;
    let previousLength = previousValues.length;
    state.values = args;
    for (let i = 0; i < args.length; i++) {
        // If we've rendered a higher-priority value already, stop.
        if (i > state.lastRenderedIndex) {
            break;
        }
        const value = args[i];
        // Render non-Promise values immediately
        if ((0,_lib_parts_js__WEBPACK_IMPORTED_MODULE_0__.isPrimitive)(value) ||
            typeof value.then !== 'function') {
            part.setValue(value);
            state.lastRenderedIndex = i;
            // Since a lower-priority value will never overwrite a higher-priority
            // synchronous value, we can stop processing now.
            break;
        }
        // If this is a Promise we've already handled, skip it.
        if (i < previousLength && value === previousValues[i]) {
            continue;
        }
        // We have a Promise that we haven't seen before, so priorities may have
        // changed. Forget what we rendered before.
        state.lastRenderedIndex = _infinity;
        previousLength = 0;
        Promise.resolve(value).then((resolvedValue) => {
            const index = state.values.indexOf(value);
            // If state.values doesn't contain the value, we've re-rendered without
            // the value, so don't render it. Then, only render if the value is
            // higher-priority than what's already been rendered.
            if (index > -1 && index < state.lastRenderedIndex) {
                state.lastRenderedIndex = index;
                part.setValue(resolvedValue);
                part.commit();
            }
        });
    }
});
//# sourceMappingURL=until.js.map

/***/ }),

/***/ "./node_modules/lit-html/lib/default-template-processor.js":
/*!*****************************************************************!*\
  !*** ./node_modules/lit-html/lib/default-template-processor.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefaultTemplateProcessor": () => (/* binding */ DefaultTemplateProcessor),
/* harmony export */   "defaultTemplateProcessor": () => (/* binding */ defaultTemplateProcessor)
/* harmony export */ });
/* harmony import */ var _parts_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parts.js */ "./node_modules/lit-html/lib/parts.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
        const prefix = name[0];
        if (prefix === '.') {
            const committer = new _parts_js__WEBPACK_IMPORTED_MODULE_0__.PropertyCommitter(element, name.slice(1), strings);
            return committer.parts;
        }
        if (prefix === '@') {
            return [new _parts_js__WEBPACK_IMPORTED_MODULE_0__.EventPart(element, name.slice(1), options.eventContext)];
        }
        if (prefix === '?') {
            return [new _parts_js__WEBPACK_IMPORTED_MODULE_0__.BooleanAttributePart(element, name.slice(1), strings)];
        }
        const committer = new _parts_js__WEBPACK_IMPORTED_MODULE_0__.AttributeCommitter(element, name, strings);
        return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */
    handleTextExpression(options) {
        return new _parts_js__WEBPACK_IMPORTED_MODULE_0__.NodePart(options);
    }
}
const defaultTemplateProcessor = new DefaultTemplateProcessor();
//# sourceMappingURL=default-template-processor.js.map

/***/ }),

/***/ "./node_modules/lit-html/lib/directive.js":
/*!************************************************!*\
  !*** ./node_modules/lit-html/lib/directive.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "directive": () => (/* binding */ directive),
/* harmony export */   "isDirective": () => (/* binding */ isDirective)
/* harmony export */ });
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */
const directive = (f) => ((...args) => {
    const d = f(...args);
    directives.set(d, true);
    return d;
});
const isDirective = (o) => {
    return typeof o === 'function' && directives.has(o);
};
//# sourceMappingURL=directive.js.map

/***/ }),

/***/ "./node_modules/lit-html/lib/dom.js":
/*!******************************************!*\
  !*** ./node_modules/lit-html/lib/dom.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isCEPolyfill": () => (/* binding */ isCEPolyfill),
/* harmony export */   "reparentNodes": () => (/* binding */ reparentNodes),
/* harmony export */   "removeNodes": () => (/* binding */ removeNodes)
/* harmony export */ });
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = typeof window !== 'undefined' &&
    window.customElements != null &&
    window.customElements.polyfillWrapFlushCallback !==
        undefined;
/**
 * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
 * into another container (could be the same container), before `before`. If
 * `before` is null, it appends the nodes to the container.
 */
const reparentNodes = (container, start, end = null, before = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.insertBefore(start, before);
        start = n;
    }
};
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */
const removeNodes = (container, start, end = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.removeChild(start);
        start = n;
    }
};
//# sourceMappingURL=dom.js.map

/***/ }),

/***/ "./node_modules/lit-html/lib/modify-template.js":
/*!******************************************************!*\
  !*** ./node_modules/lit-html/lib/modify-template.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "removeNodesFromTemplate": () => (/* binding */ removeNodesFromTemplate),
/* harmony export */   "insertNodeIntoTemplate": () => (/* binding */ insertNodeIntoTemplate)
/* harmony export */ });
/* harmony import */ var _template_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template.js */ "./node_modules/lit-html/lib/template.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
/**
 * Removes the list of nodes from a Template safely. In addition to removing
 * nodes from the Template, the Template part indices are updated to match
 * the mutated Template DOM.
 *
 * As the template is walked the removal state is tracked and
 * part indices are adjusted as needed.
 *
 * div
 *   div#1 (remove) <-- start removing (removing node is div#1)
 *     div
 *       div#2 (remove)  <-- continue removing (removing node is still div#1)
 *         div
 * div <-- stop removing since previous sibling is the removing node (div#1,
 * removed 4 nodes)
 */
function removeNodesFromTemplate(template, nodesToRemove) {
    const { element: { content }, parts } = template;
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let part = parts[partIndex];
    let nodeIndex = -1;
    let removeCount = 0;
    const nodesToRemoveInTemplate = [];
    let currentRemovingNode = null;
    while (walker.nextNode()) {
        nodeIndex++;
        const node = walker.currentNode;
        // End removal if stepped past the removing node
        if (node.previousSibling === currentRemovingNode) {
            currentRemovingNode = null;
        }
        // A node to remove was found in the template
        if (nodesToRemove.has(node)) {
            nodesToRemoveInTemplate.push(node);
            // Track node we're removing
            if (currentRemovingNode === null) {
                currentRemovingNode = node;
            }
        }
        // When removing, increment count by which to adjust subsequent part indices
        if (currentRemovingNode !== null) {
            removeCount++;
        }
        while (part !== undefined && part.index === nodeIndex) {
            // If part is in a removed node deactivate it by setting index to -1 or
            // adjust the index as needed.
            part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
            // go to the next active part.
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
            part = parts[partIndex];
        }
    }
    nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
}
const countNodes = (node) => {
    let count = (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) ? 0 : 1;
    const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
    while (walker.nextNode()) {
        count++;
    }
    return count;
};
const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
    for (let i = startIndex + 1; i < parts.length; i++) {
        const part = parts[i];
        if ((0,_template_js__WEBPACK_IMPORTED_MODULE_0__.isTemplatePartActive)(part)) {
            return i;
        }
    }
    return -1;
};
/**
 * Inserts the given node into the Template, optionally before the given
 * refNode. In addition to inserting the node into the Template, the Template
 * part indices are updated to match the mutated Template DOM.
 */
function insertNodeIntoTemplate(template, node, refNode = null) {
    const { element: { content }, parts } = template;
    // If there's no refNode, then put node at end of template.
    // No part indices need to be shifted in this case.
    if (refNode === null || refNode === undefined) {
        content.appendChild(node);
        return;
    }
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let insertCount = 0;
    let walkerIndex = -1;
    while (walker.nextNode()) {
        walkerIndex++;
        const walkerNode = walker.currentNode;
        if (walkerNode === refNode) {
            insertCount = countNodes(node);
            refNode.parentNode.insertBefore(node, refNode);
        }
        while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
            // If we've inserted the node, simply adjust all subsequent parts
            if (insertCount > 0) {
                while (partIndex !== -1) {
                    parts[partIndex].index += insertCount;
                    partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                }
                return;
            }
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }
    }
}
//# sourceMappingURL=modify-template.js.map

/***/ }),

/***/ "./node_modules/lit-html/lib/part.js":
/*!*******************************************!*\
  !*** ./node_modules/lit-html/lib/part.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "noChange": () => (/* binding */ noChange),
/* harmony export */   "nothing": () => (/* binding */ nothing)
/* harmony export */ });
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */
const nothing = {};
//# sourceMappingURL=part.js.map

/***/ }),

/***/ "./node_modules/lit-html/lib/parts.js":
/*!********************************************!*\
  !*** ./node_modules/lit-html/lib/parts.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isPrimitive": () => (/* binding */ isPrimitive),
/* harmony export */   "isIterable": () => (/* binding */ isIterable),
/* harmony export */   "AttributeCommitter": () => (/* binding */ AttributeCommitter),
/* harmony export */   "AttributePart": () => (/* binding */ AttributePart),
/* harmony export */   "NodePart": () => (/* binding */ NodePart),
/* harmony export */   "BooleanAttributePart": () => (/* binding */ BooleanAttributePart),
/* harmony export */   "PropertyCommitter": () => (/* binding */ PropertyCommitter),
/* harmony export */   "PropertyPart": () => (/* binding */ PropertyPart),
/* harmony export */   "EventPart": () => (/* binding */ EventPart)
/* harmony export */ });
/* harmony import */ var _directive_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./directive.js */ "./node_modules/lit-html/lib/directive.js");
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom.js */ "./node_modules/lit-html/lib/dom.js");
/* harmony import */ var _part_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./part.js */ "./node_modules/lit-html/lib/part.js");
/* harmony import */ var _template_instance_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./template-instance.js */ "./node_modules/lit-html/lib/template-instance.js");
/* harmony import */ var _template_result_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./template-result.js */ "./node_modules/lit-html/lib/template-result.js");
/* harmony import */ var _template_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./template.js */ "./node_modules/lit-html/lib/template.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */






const isPrimitive = (value) => {
    return (value === null ||
        !(typeof value === 'object' || typeof value === 'function'));
};
const isIterable = (value) => {
    return Array.isArray(value) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attribute. The value is only set once even if there are multiple parts
 * for an attribute.
 */
class AttributeCommitter {
    constructor(element, name, strings) {
        this.dirty = true;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.parts = [];
        for (let i = 0; i < strings.length - 1; i++) {
            this.parts[i] = this._createPart();
        }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */
    _createPart() {
        return new AttributePart(this);
    }
    _getValue() {
        const strings = this.strings;
        const l = strings.length - 1;
        const parts = this.parts;
        // If we're assigning an attribute via syntax like:
        //    attr="${foo}"  or  attr=${foo}
        // but not
        //    attr="${foo} ${bar}" or attr="${foo} baz"
        // then we don't want to coerce the attribute value into one long
        // string. Instead we want to just return the value itself directly,
        // so that sanitizeDOMValue can get the actual value rather than
        // String(value)
        // The exception is if v is an array, in which case we do want to smash
        // it together into a string without calling String() on the array.
        //
        // This also allows trusted values (when using TrustedTypes) being
        // assigned to DOM sinks without being stringified in the process.
        if (l === 1 && strings[0] === '' && strings[1] === '') {
            const v = parts[0].value;
            if (typeof v === 'symbol') {
                return String(v);
            }
            if (typeof v === 'string' || !isIterable(v)) {
                return v;
            }
        }
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const part = parts[i];
            if (part !== undefined) {
                const v = part.value;
                if (isPrimitive(v) || !isIterable(v)) {
                    text += typeof v === 'string' ? v : String(v);
                }
                else {
                    for (const t of v) {
                        text += typeof t === 'string' ? t : String(t);
                    }
                }
            }
        }
        text += strings[l];
        return text;
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            this.element.setAttribute(this.name, this._getValue());
        }
    }
}
/**
 * A Part that controls all or part of an attribute value.
 */
class AttributePart {
    constructor(committer) {
        this.value = undefined;
        this.committer = committer;
    }
    setValue(value) {
        if (value !== _part_js__WEBPACK_IMPORTED_MODULE_2__.noChange && (!isPrimitive(value) || value !== this.value)) {
            this.value = value;
            // If the value is a not a directive, dirty the committer so that it'll
            // call setAttribute. If the value is a directive, it'll dirty the
            // committer if it calls setValue().
            if (!(0,_directive_js__WEBPACK_IMPORTED_MODULE_0__.isDirective)(value)) {
                this.committer.dirty = true;
            }
        }
    }
    commit() {
        while ((0,_directive_js__WEBPACK_IMPORTED_MODULE_0__.isDirective)(this.value)) {
            const directive = this.value;
            this.value = _part_js__WEBPACK_IMPORTED_MODULE_2__.noChange;
            directive(this);
        }
        if (this.value === _part_js__WEBPACK_IMPORTED_MODULE_2__.noChange) {
            return;
        }
        this.committer.commit();
    }
}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */
class NodePart {
    constructor(options) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.options = options;
    }
    /**
     * Appends this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendInto(container) {
        this.startNode = container.appendChild((0,_template_js__WEBPACK_IMPORTED_MODULE_5__.createMarker)());
        this.endNode = container.appendChild((0,_template_js__WEBPACK_IMPORTED_MODULE_5__.createMarker)());
    }
    /**
     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
     * such as those that appear in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterNode(ref) {
        this.startNode = ref;
        this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part) {
        part.__insert(this.startNode = (0,_template_js__WEBPACK_IMPORTED_MODULE_5__.createMarker)());
        part.__insert(this.endNode = (0,_template_js__WEBPACK_IMPORTED_MODULE_5__.createMarker)());
    }
    /**
     * Inserts this part after the `ref` part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref) {
        ref.__insert(this.startNode = (0,_template_js__WEBPACK_IMPORTED_MODULE_5__.createMarker)());
        this.endNode = ref.endNode;
        ref.endNode = this.startNode;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        if (this.startNode.parentNode === null) {
            return;
        }
        while ((0,_directive_js__WEBPACK_IMPORTED_MODULE_0__.isDirective)(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = _part_js__WEBPACK_IMPORTED_MODULE_2__.noChange;
            directive(this);
        }
        const value = this.__pendingValue;
        if (value === _part_js__WEBPACK_IMPORTED_MODULE_2__.noChange) {
            return;
        }
        if (isPrimitive(value)) {
            if (value !== this.value) {
                this.__commitText(value);
            }
        }
        else if (value instanceof _template_result_js__WEBPACK_IMPORTED_MODULE_4__.TemplateResult) {
            this.__commitTemplateResult(value);
        }
        else if (value instanceof Node) {
            this.__commitNode(value);
        }
        else if (isIterable(value)) {
            this.__commitIterable(value);
        }
        else if (value === _part_js__WEBPACK_IMPORTED_MODULE_2__.nothing) {
            this.value = _part_js__WEBPACK_IMPORTED_MODULE_2__.nothing;
            this.clear();
        }
        else {
            // Fallback, will render the string representation
            this.__commitText(value);
        }
    }
    __insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    __commitNode(value) {
        if (this.value === value) {
            return;
        }
        this.clear();
        this.__insert(value);
        this.value = value;
    }
    __commitText(value) {
        const node = this.startNode.nextSibling;
        value = value == null ? '' : value;
        // If `value` isn't already a string, we explicitly convert it here in case
        // it can't be implicitly converted - i.e. it's a symbol.
        const valueAsString = typeof value === 'string' ? value : String(value);
        if (node === this.endNode.previousSibling &&
            node.nodeType === 3 /* Node.TEXT_NODE */) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if this.value is primitive?
            node.data = valueAsString;
        }
        else {
            this.__commitNode(document.createTextNode(valueAsString));
        }
        this.value = value;
    }
    __commitTemplateResult(value) {
        const template = this.options.templateFactory(value);
        if (this.value instanceof _template_instance_js__WEBPACK_IMPORTED_MODULE_3__.TemplateInstance &&
            this.value.template === template) {
            this.value.update(value.values);
        }
        else {
            // Make sure we propagate the template processor from the TemplateResult
            // so that we use its syntax extension, etc. The template factory comes
            // from the render function options so that it can control template
            // caching and preprocessing.
            const instance = new _template_instance_js__WEBPACK_IMPORTED_MODULE_3__.TemplateInstance(template, value.processor, this.options);
            const fragment = instance._clone();
            instance.update(value.values);
            this.__commitNode(fragment);
            this.value = instance;
        }
    }
    __commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _value is an array, then the previous render was of an
        // iterable and _value will contain the NodeParts from the previous
        // render. If _value is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this.value)) {
            this.value = [];
            this.clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this.value;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            // Try to reuse an existing part
            itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                itemPart = new NodePart(this.options);
                itemParts.push(itemPart);
                if (partIndex === 0) {
                    itemPart.appendIntoPart(this);
                }
                else {
                    itemPart.insertAfterPart(itemParts[partIndex - 1]);
                }
            }
            itemPart.setValue(item);
            itemPart.commit();
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
            this.clear(itemPart && itemPart.endNode);
        }
    }
    clear(startNode = this.startNode) {
        (0,_dom_js__WEBPACK_IMPORTED_MODULE_1__.removeNodes)(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */
class BooleanAttributePart {
    constructor(element, name, strings) {
        this.value = undefined;
        this.__pendingValue = undefined;
        if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
            throw new Error('Boolean attributes can only contain a single expression');
        }
        this.element = element;
        this.name = name;
        this.strings = strings;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while ((0,_directive_js__WEBPACK_IMPORTED_MODULE_0__.isDirective)(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = _part_js__WEBPACK_IMPORTED_MODULE_2__.noChange;
            directive(this);
        }
        if (this.__pendingValue === _part_js__WEBPACK_IMPORTED_MODULE_2__.noChange) {
            return;
        }
        const value = !!this.__pendingValue;
        if (this.value !== value) {
            if (value) {
                this.element.setAttribute(this.name, '');
            }
            else {
                this.element.removeAttribute(this.name);
            }
            this.value = value;
        }
        this.__pendingValue = _part_js__WEBPACK_IMPORTED_MODULE_2__.noChange;
    }
}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */
class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
        super(element, name, strings);
        this.single =
            (strings.length === 2 && strings[0] === '' && strings[1] === '');
    }
    _createPart() {
        return new PropertyPart(this);
    }
    _getValue() {
        if (this.single) {
            return this.parts[0].value;
        }
        return super._getValue();
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.element[this.name] = this._getValue();
        }
    }
}
class PropertyPart extends AttributePart {
}
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the third
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.
let eventOptionsSupported = false;
// Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module
(() => {
    try {
        const options = {
            get capture() {
                eventOptionsSupported = true;
                return false;
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.addEventListener('test', options, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.removeEventListener('test', options, options);
    }
    catch (_e) {
        // event options not supported
    }
})();
class EventPart {
    constructor(element, eventName, eventContext) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.element = element;
        this.eventName = eventName;
        this.eventContext = eventContext;
        this.__boundHandleEvent = (e) => this.handleEvent(e);
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while ((0,_directive_js__WEBPACK_IMPORTED_MODULE_0__.isDirective)(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = _part_js__WEBPACK_IMPORTED_MODULE_2__.noChange;
            directive(this);
        }
        if (this.__pendingValue === _part_js__WEBPACK_IMPORTED_MODULE_2__.noChange) {
            return;
        }
        const newListener = this.__pendingValue;
        const oldListener = this.value;
        const shouldRemoveListener = newListener == null ||
            oldListener != null &&
                (newListener.capture !== oldListener.capture ||
                    newListener.once !== oldListener.once ||
                    newListener.passive !== oldListener.passive);
        const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        if (shouldAddListener) {
            this.__options = getOptions(newListener);
            this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        this.value = newListener;
        this.__pendingValue = _part_js__WEBPACK_IMPORTED_MODULE_2__.noChange;
    }
    handleEvent(event) {
        if (typeof this.value === 'function') {
            this.value.call(this.eventContext || this.element, event);
        }
        else {
            this.value.handleEvent(event);
        }
    }
}
// We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.
const getOptions = (o) => o &&
    (eventOptionsSupported ?
        { capture: o.capture, passive: o.passive, once: o.once } :
        o.capture);
//# sourceMappingURL=parts.js.map

/***/ }),

/***/ "./node_modules/lit-html/lib/render.js":
/*!*********************************************!*\
  !*** ./node_modules/lit-html/lib/render.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parts": () => (/* binding */ parts),
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom.js */ "./node_modules/lit-html/lib/dom.js");
/* harmony import */ var _parts_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parts.js */ "./node_modules/lit-html/lib/parts.js");
/* harmony import */ var _template_factory_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./template-factory.js */ "./node_modules/lit-html/lib/template-factory.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */



const parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */
const render = (result, container, options) => {
    let part = parts.get(container);
    if (part === undefined) {
        (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.removeNodes)(container, container.firstChild);
        parts.set(container, part = new _parts_js__WEBPACK_IMPORTED_MODULE_1__.NodePart(Object.assign({ templateFactory: _template_factory_js__WEBPACK_IMPORTED_MODULE_2__.templateFactory }, options)));
        part.appendInto(container);
    }
    part.setValue(result);
    part.commit();
};
//# sourceMappingURL=render.js.map

/***/ }),

/***/ "./node_modules/lit-html/lib/shady-render.js":
/*!***************************************************!*\
  !*** ./node_modules/lit-html/lib/shady-render.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "html": () => (/* reexport safe */ _lit_html_js__WEBPACK_IMPORTED_MODULE_6__.html),
/* harmony export */   "svg": () => (/* reexport safe */ _lit_html_js__WEBPACK_IMPORTED_MODULE_6__.svg),
/* harmony export */   "TemplateResult": () => (/* reexport safe */ _lit_html_js__WEBPACK_IMPORTED_MODULE_6__.TemplateResult),
/* harmony export */   "shadyTemplateFactory": () => (/* binding */ shadyTemplateFactory),
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom.js */ "./node_modules/lit-html/lib/dom.js");
/* harmony import */ var _modify_template_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modify-template.js */ "./node_modules/lit-html/lib/modify-template.js");
/* harmony import */ var _render_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./render.js */ "./node_modules/lit-html/lib/render.js");
/* harmony import */ var _template_factory_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./template-factory.js */ "./node_modules/lit-html/lib/template-factory.js");
/* harmony import */ var _template_instance_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./template-instance.js */ "./node_modules/lit-html/lib/template-instance.js");
/* harmony import */ var _template_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./template.js */ "./node_modules/lit-html/lib/template.js");
/* harmony import */ var _lit_html_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../lit-html.js */ "./node_modules/lit-html/lit-html.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Module to add shady DOM/shady CSS polyfill support to lit-html template
 * rendering. See the [[render]] method for details.
 *
 * @packageDocumentation
 */
/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */







// Get a key to lookup in `templateCaches`.
const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
let compatibleShadyCSSVersion = true;
if (typeof window.ShadyCSS === 'undefined') {
    compatibleShadyCSSVersion = false;
}
else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn(`Incompatible ShadyCSS version detected. ` +
        `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` +
        `@webcomponents/shadycss@1.3.1.`);
    compatibleShadyCSSVersion = false;
}
/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */
const shadyTemplateFactory = (scopeName) => (result) => {
    const cacheKey = getTemplateCacheKey(result.type, scopeName);
    let templateCache = _template_factory_js__WEBPACK_IMPORTED_MODULE_3__.templateCaches.get(cacheKey);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        _template_factory_js__WEBPACK_IMPORTED_MODULE_3__.templateCaches.set(cacheKey, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    const key = result.strings.join(_template_js__WEBPACK_IMPORTED_MODULE_5__.marker);
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        const element = result.getTemplateElement();
        if (compatibleShadyCSSVersion) {
            window.ShadyCSS.prepareTemplateDom(element, scopeName);
        }
        template = new _template_js__WEBPACK_IMPORTED_MODULE_5__.Template(result, element);
        templateCache.keyString.set(key, template);
    }
    templateCache.stringsArray.set(result.strings, template);
    return template;
};
const TEMPLATE_TYPES = ['html', 'svg'];
/**
 * Removes all style elements from Templates for the given scopeName.
 */
const removeStylesFromLitTemplates = (scopeName) => {
    TEMPLATE_TYPES.forEach((type) => {
        const templates = _template_factory_js__WEBPACK_IMPORTED_MODULE_3__.templateCaches.get(getTemplateCacheKey(type, scopeName));
        if (templates !== undefined) {
            templates.keyString.forEach((template) => {
                const { element: { content } } = template;
                // IE 11 doesn't support the iterable param Set constructor
                const styles = new Set();
                Array.from(content.querySelectorAll('style')).forEach((s) => {
                    styles.add(s);
                });
                (0,_modify_template_js__WEBPACK_IMPORTED_MODULE_1__.removeNodesFromTemplate)(template, styles);
            });
        }
    });
};
const shadyRenderSet = new Set();
/**
 * For the given scope name, ensures that ShadyCSS style scoping is performed.
 * This is done just once per scope name so the fragment and template cannot
 * be modified.
 * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
 * to be scoped and appended to the document
 * (2) removes style elements from all lit-html Templates for this scope name.
 *
 * Note, <style> elements can only be placed into templates for the
 * initial rendering of the scope. If <style> elements are included in templates
 * dynamically rendered to the scope (after the first scope render), they will
 * not be scoped and the <style> will be left in the template and rendered
 * output.
 */
const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
    shadyRenderSet.add(scopeName);
    // If `renderedDOM` is stamped from a Template, then we need to edit that
    // Template's underlying template element. Otherwise, we create one here
    // to give to ShadyCSS, which still requires one while scoping.
    const templateElement = !!template ? template.element : document.createElement('template');
    // Move styles out of rendered DOM and store.
    const styles = renderedDOM.querySelectorAll('style');
    const { length } = styles;
    // If there are no styles, skip unnecessary work
    if (length === 0) {
        // Ensure prepareTemplateStyles is called to support adding
        // styles via `prepareAdoptedCssText` since that requires that
        // `prepareTemplateStyles` is called.
        //
        // ShadyCSS will only update styles containing @apply in the template
        // given to `prepareTemplateStyles`. If no lit Template was given,
        // ShadyCSS will not be able to update uses of @apply in any relevant
        // template. However, this is not a problem because we only create the
        // template for the purpose of supporting `prepareAdoptedCssText`,
        // which doesn't support @apply at all.
        window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
        return;
    }
    const condensedStyle = document.createElement('style');
    // Collect styles into a single style. This helps us make sure ShadyCSS
    // manipulations will not prevent us from being able to fix up template
    // part indices.
    // NOTE: collecting styles is inefficient for browsers but ShadyCSS
    // currently does this anyway. When it does not, this should be changed.
    for (let i = 0; i < length; i++) {
        const style = styles[i];
        style.parentNode.removeChild(style);
        condensedStyle.textContent += style.textContent;
    }
    // Remove styles from nested templates in this scope.
    removeStylesFromLitTemplates(scopeName);
    // And then put the condensed style into the "root" template passed in as
    // `template`.
    const content = templateElement.content;
    if (!!template) {
        (0,_modify_template_js__WEBPACK_IMPORTED_MODULE_1__.insertNodeIntoTemplate)(template, condensedStyle, content.firstChild);
    }
    else {
        content.insertBefore(condensedStyle, content.firstChild);
    }
    // Note, it's important that ShadyCSS gets the template that `lit-html`
    // will actually render so that it can update the style inside when
    // needed (e.g. @apply native Shadow DOM case).
    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    const style = content.querySelector('style');
    if (window.ShadyCSS.nativeShadow && style !== null) {
        // When in native Shadow DOM, ensure the style created by ShadyCSS is
        // included in initially rendered output (`renderedDOM`).
        renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
    }
    else if (!!template) {
        // When no style is left in the template, parts will be broken as a
        // result. To fix this, we put back the style node ShadyCSS removed
        // and then tell lit to remove that node from the template.
        // There can be no style in the template in 2 cases (1) when Shady DOM
        // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
        // is in use ShadyCSS removes the style if it contains no content.
        // NOTE, ShadyCSS creates its own style so we can safely add/remove
        // `condensedStyle` here.
        content.insertBefore(condensedStyle, content.firstChild);
        const removes = new Set();
        removes.add(condensedStyle);
        (0,_modify_template_js__WEBPACK_IMPORTED_MODULE_1__.removeNodesFromTemplate)(template, removes);
    }
};
/**
 * Extension to the standard `render` method which supports rendering
 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
 * or when the webcomponentsjs
 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
 *
 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
 * when native ShadowDOM is unavailable. The `scopeName` will be added to
 * the class attribute of all rendered DOM. In addition, any style elements will
 * be automatically re-written with this `scopeName` selector and moved out
 * of the rendered DOM and into the document `<head>`.
 *
 * It is common to use this render method in conjunction with a custom element
 * which renders a shadowRoot. When this is done, typically the element's
 * `localName` should be used as the `scopeName`.
 *
 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
 * custom properties (needed only on older browsers like IE11) and a shim for
 * a deprecated feature called `@apply` that supports applying a set of css
 * custom properties to a given location.
 *
 * Usage considerations:
 *
 * * Part values in `<style>` elements are only applied the first time a given
 * `scopeName` renders. Subsequent changes to parts in style elements will have
 * no effect. Because of this, parts in style elements should only be used for
 * values that will never change, for example parts that set scope-wide theme
 * values or parts which render shared style elements.
 *
 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
 * custom element's `constructor` is not supported. Instead rendering should
 * either done asynchronously, for example at microtask timing (for example
 * `Promise.resolve()`), or be deferred until the first time the element's
 * `connectedCallback` runs.
 *
 * Usage considerations when using shimmed custom properties or `@apply`:
 *
 * * Whenever any dynamic changes are made which affect
 * css custom properties, `ShadyCSS.styleElement(element)` must be called
 * to update the element. There are two cases when this is needed:
 * (1) the element is connected to a new parent, (2) a class is added to the
 * element that causes it to match different custom properties.
 * To address the first case when rendering a custom element, `styleElement`
 * should be called in the element's `connectedCallback`.
 *
 * * Shimmed custom properties may only be defined either for an entire
 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
 * matches an element with a shadowRoot. In other words, instead of flowing from
 * parent to child as do native css custom properties, shimmed custom properties
 * flow only from shadowRoots to nested shadowRoots.
 *
 * * When using `@apply` mixing css shorthand property names with
 * non-shorthand names (for example `border` and `border-width`) is not
 * supported.
 */
const render = (result, container, options) => {
    if (!options || typeof options !== 'object' || !options.scopeName) {
        throw new Error('The `scopeName` option is required.');
    }
    const scopeName = options.scopeName;
    const hasRendered = _render_js__WEBPACK_IMPORTED_MODULE_2__.parts.has(container);
    const needsScoping = compatibleShadyCSSVersion &&
        container.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ &&
        !!container.host;
    // Handle first render to a scope specially...
    const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
    // On first scope render, render into a fragment; this cannot be a single
    // fragment that is reused since nested renders can occur synchronously.
    const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
    (0,_render_js__WEBPACK_IMPORTED_MODULE_2__.render)(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
    // When performing first scope render,
    // (1) We've rendered into a fragment so that there's a chance to
    // `prepareTemplateStyles` before sub-elements hit the DOM
    // (which might cause them to render based on a common pattern of
    // rendering in a custom element's `connectedCallback`);
    // (2) Scope the template with ShadyCSS one time only for this scope.
    // (3) Render the fragment into the container and make sure the
    // container knows its `part` is the one we just rendered. This ensures
    // DOM will be re-used on subsequent renders.
    if (firstScopeRender) {
        const part = _render_js__WEBPACK_IMPORTED_MODULE_2__.parts.get(renderContainer);
        _render_js__WEBPACK_IMPORTED_MODULE_2__.parts.delete(renderContainer);
        // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
        // that should apply to `renderContainer` even if the rendered value is
        // not a TemplateInstance. However, it will only insert scoped styles
        // into the document if `prepareTemplateStyles` has already been called
        // for the given scope name.
        const template = part.value instanceof _template_instance_js__WEBPACK_IMPORTED_MODULE_4__.TemplateInstance ?
            part.value.template :
            undefined;
        prepareTemplateStyles(scopeName, renderContainer, template);
        (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.removeNodes)(container, container.firstChild);
        container.appendChild(renderContainer);
        _render_js__WEBPACK_IMPORTED_MODULE_2__.parts.set(container, part);
    }
    // After elements have hit the DOM, update styling if this is the
    // initial render to this container.
    // This is needed whenever dynamic changes are made so it would be
    // safest to do every render; however, this would regress performance
    // so we leave it up to the user to call `ShadyCSS.styleElement`
    // for dynamic changes.
    if (!hasRendered && needsScoping) {
        window.ShadyCSS.styleElement(container.host);
    }
};
//# sourceMappingURL=shady-render.js.map

/***/ }),

/***/ "./node_modules/lit-html/lib/template-factory.js":
/*!*******************************************************!*\
  !*** ./node_modules/lit-html/lib/template-factory.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "templateFactory": () => (/* binding */ templateFactory),
/* harmony export */   "templateCaches": () => (/* binding */ templateCaches)
/* harmony export */ });
/* harmony import */ var _template_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template.js */ "./node_modules/lit-html/lib/template.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content
    const key = result.strings.join(_template_js__WEBPACK_IMPORTED_MODULE_0__.marker);
    // Check if we already have a Template for this key
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        // If we have not seen this key before, create a new Template
        template = new _template_js__WEBPACK_IMPORTED_MODULE_0__.Template(result, result.getTemplateElement());
        // Cache the Template for this key
        templateCache.keyString.set(key, template);
    }
    // Cache all future queries for this TemplateStringsArray
    templateCache.stringsArray.set(result.strings, template);
    return template;
}
const templateCaches = new Map();
//# sourceMappingURL=template-factory.js.map

/***/ }),

/***/ "./node_modules/lit-html/lib/template-instance.js":
/*!********************************************************!*\
  !*** ./node_modules/lit-html/lib/template-instance.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TemplateInstance": () => (/* binding */ TemplateInstance)
/* harmony export */ });
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom.js */ "./node_modules/lit-html/lib/dom.js");
/* harmony import */ var _template_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./template.js */ "./node_modules/lit-html/lib/template.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
    constructor(template, processor, options) {
        this.__parts = [];
        this.template = template;
        this.processor = processor;
        this.options = options;
    }
    update(values) {
        let i = 0;
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.setValue(values[i]);
            }
            i++;
        }
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.commit();
            }
        }
    }
    _clone() {
        // There are a number of steps in the lifecycle of a template instance's
        // DOM fragment:
        //  1. Clone - create the instance fragment
        //  2. Adopt - adopt into the main document
        //  3. Process - find part markers and create parts
        //  4. Upgrade - upgrade custom elements
        //  5. Update - set node, attribute, property, etc., values
        //  6. Connect - connect to the document. Optional and outside of this
        //     method.
        //
        // We have a few constraints on the ordering of these steps:
        //  * We need to upgrade before updating, so that property values will pass
        //    through any property setters.
        //  * We would like to process before upgrading so that we're sure that the
        //    cloned fragment is inert and not disturbed by self-modifying DOM.
        //  * We want custom elements to upgrade even in disconnected fragments.
        //
        // Given these constraints, with full custom elements support we would
        // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
        //
        // But Safari does not implement CustomElementRegistry#upgrade, so we
        // can not implement that order and still have upgrade-before-update and
        // upgrade disconnected fragments. So we instead sacrifice the
        // process-before-upgrade constraint, since in Custom Elements v1 elements
        // must not modify their light DOM in the constructor. We still have issues
        // when co-existing with CEv0 elements like Polymer 1, and with polyfills
        // that don't strictly adhere to the no-modification rule because shadow
        // DOM, which may be created in the constructor, is emulated by being placed
        // in the light DOM.
        //
        // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
        // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
        // in one step.
        //
        // The Custom Elements v1 polyfill supports upgrade(), so the order when
        // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
        // Connect.
        const fragment = _dom_js__WEBPACK_IMPORTED_MODULE_0__.isCEPolyfill ?
            this.template.element.content.cloneNode(true) :
            document.importNode(this.template.element.content, true);
        const stack = [];
        const parts = this.template.parts;
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        let partIndex = 0;
        let nodeIndex = 0;
        let part;
        let node = walker.nextNode();
        // Loop through all the nodes and parts of a template
        while (partIndex < parts.length) {
            part = parts[partIndex];
            if (!(0,_template_js__WEBPACK_IMPORTED_MODULE_1__.isTemplatePartActive)(part)) {
                this.__parts.push(undefined);
                partIndex++;
                continue;
            }
            // Progress the tree walker until we find our next part's node.
            // Note that multiple parts may share the same node (attribute parts
            // on a single element), so this loop may not run at all.
            while (nodeIndex < part.index) {
                nodeIndex++;
                if (node.nodeName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
                if ((node = walker.nextNode()) === null) {
                    // We've exhausted the content inside a nested template element.
                    // Because we still have parts (the outer for-loop), we know:
                    // - There is a template in the stack
                    // - The walker will find a nextNode outside the template
                    walker.currentNode = stack.pop();
                    node = walker.nextNode();
                }
            }
            // We've arrived at our part's node.
            if (part.type === 'node') {
                const part = this.processor.handleTextExpression(this.options);
                part.insertAfterNode(node.previousSibling);
                this.__parts.push(part);
            }
            else {
                this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
            }
            partIndex++;
        }
        if (_dom_js__WEBPACK_IMPORTED_MODULE_0__.isCEPolyfill) {
            document.adoptNode(fragment);
            customElements.upgrade(fragment);
        }
        return fragment;
    }
}
//# sourceMappingURL=template-instance.js.map

/***/ }),

/***/ "./node_modules/lit-html/lib/template-result.js":
/*!******************************************************!*\
  !*** ./node_modules/lit-html/lib/template-result.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TemplateResult": () => (/* binding */ TemplateResult),
/* harmony export */   "SVGTemplateResult": () => (/* binding */ SVGTemplateResult)
/* harmony export */ });
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom.js */ "./node_modules/lit-html/lib/dom.js");
/* harmony import */ var _template_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./template.js */ "./node_modules/lit-html/lib/template.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @module lit-html
 */


/**
 * Our TrustedTypePolicy for HTML which is declared using the html template
 * tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 */
const policy = window.trustedTypes &&
    trustedTypes.createPolicy('lit-html', { createHTML: (s) => s });
const commentMarker = ` ${_template_js__WEBPACK_IMPORTED_MODULE_1__.marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(strings, values, type, processor) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    getHTML() {
        const l = this.strings.length - 1;
        let html = '';
        let isCommentBinding = false;
        for (let i = 0; i < l; i++) {
            const s = this.strings[i];
            // For each binding we want to determine the kind of marker to insert
            // into the template source before it's parsed by the browser's HTML
            // parser. The marker type is based on whether the expression is in an
            // attribute, text, or comment position.
            //   * For node-position bindings we insert a comment with the marker
            //     sentinel as its text content, like <!--{{lit-guid}}-->.
            //   * For attribute bindings we insert just the marker sentinel for the
            //     first binding, so that we support unquoted attribute bindings.
            //     Subsequent bindings can use a comment marker because multi-binding
            //     attributes must be quoted.
            //   * For comment bindings we insert just the marker sentinel so we don't
            //     close the comment.
            //
            // The following code scans the template source, but is *not* an HTML
            // parser. We don't need to track the tree structure of the HTML, only
            // whether a binding is inside a comment, and if not, if it appears to be
            // the first binding in an attribute.
            const commentOpen = s.lastIndexOf('<!--');
            // We're in comment position if we have a comment open with no following
            // comment close. Because <-- can appear in an attribute value there can
            // be false positives.
            isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                s.indexOf('-->', commentOpen + 1) === -1;
            // Check to see if we have an attribute-like sequence preceding the
            // expression. This can match "name=value" like structures in text,
            // comments, and attribute values, so there can be false-positives.
            const attributeMatch = _template_js__WEBPACK_IMPORTED_MODULE_1__.lastAttributeNameRegex.exec(s);
            if (attributeMatch === null) {
                // We're only in this branch if we don't have a attribute-like
                // preceding sequence. For comments, this guards against unusual
                // attribute values like <div foo="<!--${'bar'}">. Cases like
                // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                // below.
                html += s + (isCommentBinding ? commentMarker : _template_js__WEBPACK_IMPORTED_MODULE_1__.nodeMarker);
            }
            else {
                // For attributes we use just a marker sentinel, and also append a
                // $lit$ suffix to the name to opt-out of attribute-specific parsing
                // that IE and Edge do for style and certain SVG attributes.
                html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                    attributeMatch[2] + _template_js__WEBPACK_IMPORTED_MODULE_1__.boundAttributeSuffix + attributeMatch[3] +
                    _template_js__WEBPACK_IMPORTED_MODULE_1__.marker;
            }
        }
        html += this.strings[l];
        return html;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        let value = this.getHTML();
        if (policy !== undefined) {
            // this is secure because `this.strings` is a TemplateStringsArray.
            // TODO: validate this when
            // https://github.com/tc39/proposal-array-is-template-object is
            // implemented.
            value = policy.createHTML(value);
        }
        template.innerHTML = value;
        return template;
    }
}
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTML in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */
class SVGTemplateResult extends TemplateResult {
    getHTML() {
        return `<svg>${super.getHTML()}</svg>`;
    }
    getTemplateElement() {
        const template = super.getTemplateElement();
        const content = template.content;
        const svgElement = content.firstChild;
        content.removeChild(svgElement);
        (0,_dom_js__WEBPACK_IMPORTED_MODULE_0__.reparentNodes)(content, svgElement.firstChild);
        return template;
    }
}
//# sourceMappingURL=template-result.js.map

/***/ }),

/***/ "./node_modules/lit-html/lib/template.js":
/*!***********************************************!*\
  !*** ./node_modules/lit-html/lib/template.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "marker": () => (/* binding */ marker),
/* harmony export */   "nodeMarker": () => (/* binding */ nodeMarker),
/* harmony export */   "markerRegex": () => (/* binding */ markerRegex),
/* harmony export */   "boundAttributeSuffix": () => (/* binding */ boundAttributeSuffix),
/* harmony export */   "Template": () => (/* binding */ Template),
/* harmony export */   "isTemplatePartActive": () => (/* binding */ isTemplatePartActive),
/* harmony export */   "createMarker": () => (/* binding */ createMarker),
/* harmony export */   "lastAttributeNameRegex": () => (/* binding */ lastAttributeNameRegex)
/* harmony export */ });
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */
const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */
const boundAttributeSuffix = '$lit$';
/**
 * An updatable Template that tracks the location of dynamic parts.
 */
class Template {
    constructor(result, element) {
        this.parts = [];
        this.element = element;
        const nodesToRemove = [];
        const stack = [];
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        // Keeps track of the last index associated with a part. We try to delete
        // unnecessary nodes, but we never want to associate two different parts
        // to the same index. They must have a constant node between.
        let lastPartIndex = 0;
        let index = -1;
        let partIndex = 0;
        const { strings, values: { length } } = result;
        while (partIndex < length) {
            const node = walker.nextNode();
            if (node === null) {
                // We've exhausted the content inside a nested template element.
                // Because we still have parts (the outer for-loop), we know:
                // - There is a template in the stack
                // - The walker will find a nextNode outside the template
                walker.currentNode = stack.pop();
                continue;
            }
            index++;
            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                if (node.hasAttributes()) {
                    const attributes = node.attributes;
                    const { length } = attributes;
                    // Per
                    // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                    // attributes are not guaranteed to be returned in document order.
                    // In particular, Edge/IE can return them out of order, so we cannot
                    // assume a correspondence between part index and attribute index.
                    let count = 0;
                    for (let i = 0; i < length; i++) {
                        if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                            count++;
                        }
                    }
                    while (count-- > 0) {
                        // Get the template literal section leading up to the first
                        // expression in this attribute
                        const stringForPart = strings[partIndex];
                        // Find the attribute name
                        const name = lastAttributeNameRegex.exec(stringForPart)[2];
                        // Find the corresponding attribute
                        // All bound attributes have had a suffix added in
                        // TemplateResult#getHTML to opt out of special attribute
                        // handling. To look up the attribute value we also need to add
                        // the suffix.
                        const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                        const attributeValue = node.getAttribute(attributeLookupName);
                        node.removeAttribute(attributeLookupName);
                        const statics = attributeValue.split(markerRegex);
                        this.parts.push({ type: 'attribute', index, name, strings: statics });
                        partIndex += statics.length - 1;
                    }
                }
                if (node.tagName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
            }
            else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                const data = node.data;
                if (data.indexOf(marker) >= 0) {
                    const parent = node.parentNode;
                    const strings = data.split(markerRegex);
                    const lastIndex = strings.length - 1;
                    // Generate a new text node for each literal section
                    // These nodes are also used as the markers for node parts
                    for (let i = 0; i < lastIndex; i++) {
                        let insert;
                        let s = strings[i];
                        if (s === '') {
                            insert = createMarker();
                        }
                        else {
                            const match = lastAttributeNameRegex.exec(s);
                            if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                                s = s.slice(0, match.index) + match[1] +
                                    match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                            }
                            insert = document.createTextNode(s);
                        }
                        parent.insertBefore(insert, node);
                        this.parts.push({ type: 'node', index: ++index });
                    }
                    // If there's no text, we must insert a comment to mark our place.
                    // Else, we can trust it will stick around after cloning.
                    if (strings[lastIndex] === '') {
                        parent.insertBefore(createMarker(), node);
                        nodesToRemove.push(node);
                    }
                    else {
                        node.data = strings[lastIndex];
                    }
                    // We have a part for each match found
                    partIndex += lastIndex;
                }
            }
            else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                if (node.data === marker) {
                    const parent = node.parentNode;
                    // Add a new marker node to be the startNode of the Part if any of
                    // the following are true:
                    //  * We don't have a previousSibling
                    //  * The previousSibling is already the start of a previous part
                    if (node.previousSibling === null || index === lastPartIndex) {
                        index++;
                        parent.insertBefore(createMarker(), node);
                    }
                    lastPartIndex = index;
                    this.parts.push({ type: 'node', index });
                    // If we don't have a nextSibling, keep this node so we have an end.
                    // Else, we can remove it to save future costs.
                    if (node.nextSibling === null) {
                        node.data = '';
                    }
                    else {
                        nodesToRemove.push(node);
                        index--;
                    }
                    partIndex++;
                }
                else {
                    let i = -1;
                    while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                        // Comment node has a binding marker inside, make an inactive part
                        // The binding won't work, but subsequent bindings will
                        // TODO (justinfagnani): consider whether it's even worth it to
                        // make bindings in comments work
                        this.parts.push({ type: 'node', index: -1 });
                        partIndex++;
                    }
                }
            }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
const endsWith = (str, suffix) => {
    const index = str.length - suffix.length;
    return index >= 0 && str.slice(index) === suffix;
};
const isTemplatePartActive = (part) => part.index !== -1;
// Allows `document.createComment('')` to be renamed for a
// small manual size-savings.
const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex = 
// eslint-disable-next-line no-control-regex
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
//# sourceMappingURL=template.js.map

/***/ }),

/***/ "./node_modules/lit-html/lit-html.js":
/*!*******************************************!*\
  !*** ./node_modules/lit-html/lit-html.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefaultTemplateProcessor": () => (/* reexport safe */ _lib_default_template_processor_js__WEBPACK_IMPORTED_MODULE_0__.DefaultTemplateProcessor),
/* harmony export */   "defaultTemplateProcessor": () => (/* reexport safe */ _lib_default_template_processor_js__WEBPACK_IMPORTED_MODULE_0__.defaultTemplateProcessor),
/* harmony export */   "directive": () => (/* reexport safe */ _lib_directive_js__WEBPACK_IMPORTED_MODULE_2__.directive),
/* harmony export */   "isDirective": () => (/* reexport safe */ _lib_directive_js__WEBPACK_IMPORTED_MODULE_2__.isDirective),
/* harmony export */   "removeNodes": () => (/* reexport safe */ _lib_dom_js__WEBPACK_IMPORTED_MODULE_3__.removeNodes),
/* harmony export */   "reparentNodes": () => (/* reexport safe */ _lib_dom_js__WEBPACK_IMPORTED_MODULE_3__.reparentNodes),
/* harmony export */   "noChange": () => (/* reexport safe */ _lib_part_js__WEBPACK_IMPORTED_MODULE_4__.noChange),
/* harmony export */   "nothing": () => (/* reexport safe */ _lib_part_js__WEBPACK_IMPORTED_MODULE_4__.nothing),
/* harmony export */   "AttributeCommitter": () => (/* reexport safe */ _lib_parts_js__WEBPACK_IMPORTED_MODULE_5__.AttributeCommitter),
/* harmony export */   "AttributePart": () => (/* reexport safe */ _lib_parts_js__WEBPACK_IMPORTED_MODULE_5__.AttributePart),
/* harmony export */   "BooleanAttributePart": () => (/* reexport safe */ _lib_parts_js__WEBPACK_IMPORTED_MODULE_5__.BooleanAttributePart),
/* harmony export */   "EventPart": () => (/* reexport safe */ _lib_parts_js__WEBPACK_IMPORTED_MODULE_5__.EventPart),
/* harmony export */   "isIterable": () => (/* reexport safe */ _lib_parts_js__WEBPACK_IMPORTED_MODULE_5__.isIterable),
/* harmony export */   "isPrimitive": () => (/* reexport safe */ _lib_parts_js__WEBPACK_IMPORTED_MODULE_5__.isPrimitive),
/* harmony export */   "NodePart": () => (/* reexport safe */ _lib_parts_js__WEBPACK_IMPORTED_MODULE_5__.NodePart),
/* harmony export */   "PropertyCommitter": () => (/* reexport safe */ _lib_parts_js__WEBPACK_IMPORTED_MODULE_5__.PropertyCommitter),
/* harmony export */   "PropertyPart": () => (/* reexport safe */ _lib_parts_js__WEBPACK_IMPORTED_MODULE_5__.PropertyPart),
/* harmony export */   "parts": () => (/* reexport safe */ _lib_render_js__WEBPACK_IMPORTED_MODULE_6__.parts),
/* harmony export */   "render": () => (/* reexport safe */ _lib_render_js__WEBPACK_IMPORTED_MODULE_6__.render),
/* harmony export */   "templateCaches": () => (/* reexport safe */ _lib_template_factory_js__WEBPACK_IMPORTED_MODULE_7__.templateCaches),
/* harmony export */   "templateFactory": () => (/* reexport safe */ _lib_template_factory_js__WEBPACK_IMPORTED_MODULE_7__.templateFactory),
/* harmony export */   "TemplateInstance": () => (/* reexport safe */ _lib_template_instance_js__WEBPACK_IMPORTED_MODULE_8__.TemplateInstance),
/* harmony export */   "SVGTemplateResult": () => (/* reexport safe */ _lib_template_result_js__WEBPACK_IMPORTED_MODULE_1__.SVGTemplateResult),
/* harmony export */   "TemplateResult": () => (/* reexport safe */ _lib_template_result_js__WEBPACK_IMPORTED_MODULE_1__.TemplateResult),
/* harmony export */   "createMarker": () => (/* reexport safe */ _lib_template_js__WEBPACK_IMPORTED_MODULE_9__.createMarker),
/* harmony export */   "isTemplatePartActive": () => (/* reexport safe */ _lib_template_js__WEBPACK_IMPORTED_MODULE_9__.isTemplatePartActive),
/* harmony export */   "Template": () => (/* reexport safe */ _lib_template_js__WEBPACK_IMPORTED_MODULE_9__.Template),
/* harmony export */   "html": () => (/* binding */ html),
/* harmony export */   "svg": () => (/* binding */ svg)
/* harmony export */ });
/* harmony import */ var _lib_default_template_processor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/default-template-processor.js */ "./node_modules/lit-html/lib/default-template-processor.js");
/* harmony import */ var _lib_template_result_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/template-result.js */ "./node_modules/lit-html/lib/template-result.js");
/* harmony import */ var _lib_directive_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/directive.js */ "./node_modules/lit-html/lib/directive.js");
/* harmony import */ var _lib_dom_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/dom.js */ "./node_modules/lit-html/lib/dom.js");
/* harmony import */ var _lib_part_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/part.js */ "./node_modules/lit-html/lib/part.js");
/* harmony import */ var _lib_parts_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/parts.js */ "./node_modules/lit-html/lib/parts.js");
/* harmony import */ var _lib_render_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/render.js */ "./node_modules/lit-html/lib/render.js");
/* harmony import */ var _lib_template_factory_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./lib/template-factory.js */ "./node_modules/lit-html/lib/template-factory.js");
/* harmony import */ var _lib_template_instance_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./lib/template-instance.js */ "./node_modules/lit-html/lib/template-instance.js");
/* harmony import */ var _lib_template_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./lib/template.js */ "./node_modules/lit-html/lib/template.js");
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 *
 * Main lit-html module.
 *
 * Main exports:
 *
 * -  [[html]]
 * -  [[svg]]
 * -  [[render]]
 *
 * @packageDocumentation
 */
/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */




// TODO(justinfagnani): remove line when we get NodePart moving methods








// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
if (typeof window !== 'undefined') {
    (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.3.0');
}
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => new _lib_template_result_js__WEBPACK_IMPORTED_MODULE_1__.TemplateResult(strings, values, 'html', _lib_default_template_processor_js__WEBPACK_IMPORTED_MODULE_0__.defaultTemplateProcessor);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */
const svg = (strings, ...values) => new _lib_template_result_js__WEBPACK_IMPORTED_MODULE_1__.SVGTemplateResult(strings, values, 'svg', _lib_default_template_processor_js__WEBPACK_IMPORTED_MODULE_0__.defaultTemplateProcessor);
//# sourceMappingURL=lit-html.js.map

/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AmbleViewerElement = exports.AmbleStepElement = exports.AmbleSourceRefElement = exports.AmbleSourceElement = exports.AmbleQuestionElement = exports.AmbleCodeElement = exports.AmbleButtonElement = void 0;
var AmbleButtonElement_1 = __webpack_require__(/*! ./src/AmbleButtonElement */ "./src/AmbleButtonElement.ts");
Object.defineProperty(exports, "AmbleButtonElement", ({ enumerable: true, get: function () { return AmbleButtonElement_1.AmbleButtonElement; } }));
var AmbleCodeElement_1 = __webpack_require__(/*! ./src/AmbleCodeElement */ "./src/AmbleCodeElement.ts");
Object.defineProperty(exports, "AmbleCodeElement", ({ enumerable: true, get: function () { return AmbleCodeElement_1.AmbleCodeElement; } }));
var AmbleQuestionElement_1 = __webpack_require__(/*! ./src/AmbleQuestionElement */ "./src/AmbleQuestionElement.ts");
Object.defineProperty(exports, "AmbleQuestionElement", ({ enumerable: true, get: function () { return AmbleQuestionElement_1.AmbleQuestionElement; } }));
var AmbleSourceElement_1 = __webpack_require__(/*! ./src/AmbleSourceElement */ "./src/AmbleSourceElement.ts");
Object.defineProperty(exports, "AmbleSourceElement", ({ enumerable: true, get: function () { return AmbleSourceElement_1.AmbleSourceElement; } }));
var AmbleSourceRefElement_1 = __webpack_require__(/*! ./src/AmbleSourceRefElement */ "./src/AmbleSourceRefElement.ts");
Object.defineProperty(exports, "AmbleSourceRefElement", ({ enumerable: true, get: function () { return AmbleSourceRefElement_1.AmbleSourceRefElement; } }));
var AmbleStepElement_1 = __webpack_require__(/*! ./src/AmbleStepElement */ "./src/AmbleStepElement.ts");
Object.defineProperty(exports, "AmbleStepElement", ({ enumerable: true, get: function () { return AmbleStepElement_1.AmbleStepElement; } }));
var AmbleViewerElement_1 = __webpack_require__(/*! ./src/AmbleViewerElement */ "./src/AmbleViewerElement.ts");
Object.defineProperty(exports, "AmbleViewerElement", ({ enumerable: true, get: function () { return AmbleViewerElement_1.AmbleViewerElement; } }));


/***/ }),

/***/ "./src/AmbleArt.ts":
/*!*************************!*\
  !*** ./src/AmbleArt.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LINK_SVG = exports.SHOW_MORE_SVG = exports.INFO_SVG = exports.EXIT_FULL_SCREEN_SVG = exports.FULL_SCREEN_SVG = exports.LAYOUT_SVG = exports.CHECKED_BOX_SVG = exports.SHOW_LESS_SVG = exports.SELF_ASSESSMENT_SVG = exports.WALK_THROUGH_SVG = exports.ARROW_RIGHT_SVG = exports.ARROW_LEFT_SVG = void 0;
const lit_element_js_1 = __webpack_require__(/*! ../node_modules/lit-element/lit-element.js */ "./node_modules/lit-element/lit-element.js");
// function artSvg(
//   iconName: string,
//   bounds: string = '-1 -1 11 11',
//   prefix: string = '/src/',
// ): TemplateResult {
//   return html`
//     <svg viewBox="${bounds}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
//       <use xlink:href="${prefix}#${iconName}"></use>
//     </svg>
//   `;
// }
exports.ARROW_LEFT_SVG = lit_element_js_1.html `
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M2.5,4.5 l4,-4 v8 z" />
	</svg>
`;
exports.ARROW_RIGHT_SVG = lit_element_js_1.html `
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M6.5,4.5 l-4,4 v-8 z" />
	</svg>
`;
exports.WALK_THROUGH_SVG = lit_element_js_1.html `
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M0,7 l2,-2 v4 l-2,-2 M9,7 l-2,2 v-4 l2,2 M4,4.5 v3.5 h1 v-3.5 M5,5.5 a2.5,2.5,0,1,0,-1,0 v-1 a1.5,1.5,0,1,1,1,0 v1" />
	</svg>
`;
exports.SELF_ASSESSMENT_SVG = lit_element_js_1.html `
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M0,7 l2,-2 v4 l-2,-2 M4,7 h1 v1 h-1 v-1 M9,7 l-2,2 v-4 l2,2 M4,6 h1 v-1 l2,-2 v-1.5 l-1,-1 h-3 l-1,1 l0.6,0.6 l1,-0.7 h1.8 l0.7,0.7 v0.5 l-2,2 v1.4" />
	</svg>
`;
exports.SHOW_LESS_SVG = lit_element_js_1.html `
	<svg viewbox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M0.5,5 l4,-4 l4,4 l-1,1 l-3,-3 l-3,3 z" />
		<path d="M0,8 h1 v1 h-1 v-1 M2,8 h1 v1 h-1 v-1 M4,8 h1 v1 h-1 v-1 M6,8 h1 v1 h-1 v-1 M8,8 h1 v1 h-1 v-1" />
	</svg>
`;
exports.CHECKED_BOX_SVG = lit_element_js_1.html `
	<svg viewbox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M1,1 h6 l-1,1 h-4 v5 h5 v-2 l1,-1 v4 h-7 z" />
		<path d="M2,5 l1,-1 l1,1 l4,-4 l1,1 l-5,5 z" />
	</svg>
`;
exports.LAYOUT_SVG = lit_element_js_1.html `
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M0,0 h4 v5 h-4 v-4 M5,0 h4 v3 h-4 v-3 M0,6 h4 v3 h-4 v-3 M5,4 h4 v5 h-4 v-5" />
	</svg>
`;
exports.FULL_SCREEN_SVG = lit_element_js_1.html `
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M0,0 h3 v1 h-2 v2 h-1 v-3 M6,0 h3 v3 h-1 v-2 h-2 v-1 M8,6 h1 v3 h-3 v-1 h2 v-2 M0,9 v-3 h1 v2 h2 v1 h-3" />
	</svg>
`;
exports.EXIT_FULL_SCREEN_SVG = lit_element_js_1.html `
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M2,4 v-1 h2 v-2 h1 v3 h-3 M6,4 v-3 h1 v2 h2 v1 h-3 M2,5 h3 v3 h-1 v-2 h-2 v-1 M6,5 h3 v1 h-2 v2 h-1 v-3" />
	</svg>
`;
exports.INFO_SVG = lit_element_js_1.html `
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M4.5,1 a3.5,3.5,0,0,1,0,7 v-1 h0.5 v-3.5 h-0.5 v-0.5 a0.5,0.5,0,0,0,0,-1 v-1 a3.5,3.5,0,0,0,0,7 v-1 h-0.5 v-3.5 h0.5 v-0.5 a0.5,0.5,0,0,1,0,-1 v-1" />
	</svg>
`;
exports.SHOW_MORE_SVG = lit_element_js_1.html `
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M0,3 q2,-2,4.5,-2 q2.5,0,4.5,2 h-3 A1.5,1.5,0,0,0,3,3 A1.5,1.5,0,0,0,6,3 h3 q-2.5,2,-4.5,2 q-2,0,-4.5-2 M4,3 A0.5,0.5,0,0,0,5,3 A0.5,0.5,0,0,0,4,3 M0.5,6 l0.5,-0.5 l3.5,2 l3.5,-2 l0.5,0.5 l-4,2.25 l-4,-2.25" />
	</svg>
`;
exports.LINK_SVG = lit_element_js_1.html `
	<svg viewBox="-1 -1 11 11" class="amble-icon" xmlns="http://www.w3.org/2000/svg">
		<path d="M1,8 v-4 h1 v3 h3 v1 h-4 m2,-3 l2,-2 l-1,-1 h3 v3 l-1,-1 l-2,2 l-1,-1" />
	</svg>
`;


/***/ }),

/***/ "./src/AmbleButtonElement.ts":
/*!***********************************!*\
  !*** ./src/AmbleButtonElement.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AmbleButtonElement = void 0;
const lit_element_1 = __webpack_require__(/*! lit-element */ "./node_modules/lit-element/lit-element.js");
const class_map_1 = __webpack_require__(/*! lit-html/directives/class-map */ "./node_modules/lit-html/directives/class-map.js");
const AmbleElement_1 = __webpack_require__(/*! ./AmbleElement */ "./src/AmbleElement.ts");
let AmbleButtonElement = class AmbleButtonElement extends AmbleElement_1.AmbleElement {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "active", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "disabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    set bindableTitle(title) {
        const previousTitle = this.title;
        if (previousTitle !== title) {
            this.title = title;
            this.requestUpdate('title', previousTitle);
        }
    }
    render() {
        return this.hidden
            ? lit_element_1.html ``
            : lit_element_1.html `
					<link rel="stylesheet" href="src/AmbleButtonElement.css" />
					<button
						.title="${this.title}"
						aria-label="${this.label}"
						?disabled="${this.disabled}"
						class="${class_map_1.classMap({
                active: this.active,
                inactive: !this.active,
            })}"
					>
						<slot></slot>
					</button>
			  `;
    }
};
__decorate([
    lit_element_1.property({ type: Boolean }),
    __metadata("design:type", Object)
], AmbleButtonElement.prototype, "active", void 0);
__decorate([
    lit_element_1.property({ type: Boolean }),
    __metadata("design:type", Object)
], AmbleButtonElement.prototype, "disabled", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", Object)
], AmbleButtonElement.prototype, "value", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], AmbleButtonElement.prototype, "bindableTitle", null);
AmbleButtonElement = __decorate([
    lit_element_1.customElement('amble-button')
], AmbleButtonElement);
exports.AmbleButtonElement = AmbleButtonElement;


/***/ }),

/***/ "./src/AmbleCodeElement.ts":
/*!*********************************!*\
  !*** ./src/AmbleCodeElement.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AmbleCodeElement = exports.CodeChangeRequestEvent = exports.CodeChangeRequestEventType = void 0;
const lit_element_1 = __webpack_require__(/*! lit-element */ "./node_modules/lit-element/lit-element.js");
const class_map_1 = __webpack_require__(/*! lit-html/directives/class-map */ "./node_modules/lit-html/directives/class-map.js");
const unsafe_html_1 = __webpack_require__(/*! lit-html/directives/unsafe-html */ "./node_modules/lit-html/directives/unsafe-html.js");
const until_1 = __webpack_require__(/*! lit-html/directives/until */ "./node_modules/lit-html/directives/until.js");
const AmbleArt_1 = __webpack_require__(/*! ./AmbleArt */ "./src/AmbleArt.ts");
const AmbleElement_1 = __webpack_require__(/*! ./AmbleElement */ "./src/AmbleElement.ts");
const AmbleSourceFormatter_1 = __webpack_require__(/*! ./AmbleSourceFormatter */ "./src/AmbleSourceFormatter.ts");
const ResolvablePromise_1 = __webpack_require__(/*! ./ResolvablePromise */ "./src/ResolvablePromise.ts");
exports.CodeChangeRequestEventType = 'codechangerequest';
class CodeChangeRequestEvent extends Event {
    constructor(step, codeElement) {
        super(exports.CodeChangeRequestEventType, {
            bubbles: true,
            cancelable: true,
            composed: true,
        });
        Object.defineProperty(this, "step", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: step
        });
        Object.defineProperty(this, "codeElement", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: codeElement
        });
    }
}
exports.CodeChangeRequestEvent = CodeChangeRequestEvent;
let AmbleCodeElement = class AmbleCodeElement extends AmbleElement_1.AmbleElement {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_codeEl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_navControls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "highlightClass", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'highlight'
        });
        Object.defineProperty(this, "highlighted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ResolvablePromise_1.resolvablePromise()
        });
        Object.defineProperty(this, "highlighter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: AmbleSourceFormatter_1.cachingHighlighter()
        });
        Object.defineProperty(this, "index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "previousHighlightSelector", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "previousHighlights", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "source", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "syntax", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    get codeEl() {
        var _a;
        if (this._codeEl == null) {
            const el = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('.amble-syntax-highlighted');
            if (el != null) {
                this._codeEl = el;
            }
        }
        return this._codeEl;
    }
    set navControls(show) {
        const previous = this._navControls;
        if (previous !== show) {
            this._navControls = show;
            this.requestUpdate('navControls', show);
        }
    }
    clearHighlighted() {
        this.previousHighlightSelector = undefined;
        this.previousHighlights.forEach((el) => el.classList.remove(this.highlightClass));
        this.previousHighlights.splice(0, this.previousHighlights.length);
    }
    emitChangeRequest(step) {
        this.dispatchEvent(new CodeChangeRequestEvent(step, this));
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.highlighter(this.source, this.syntax.split(',')[0])
            .then((html) => this.highlighted.resolve(unsafe_html_1.unsafeHTML(html)))
            .catch((reason) => this.highlighted.reject(reason));
    }
    onNextLanguage() {
        this.emitChangeRequest(1);
    }
    onPrevLanguage() {
        this.emitChangeRequest(-1);
    }
    render() {
        return lit_element_1.html `
			<link rel="stylesheet" href="src/AmbleCodeElement.css" />
			<div
				class=${class_map_1.classMap({
            'amble-code-nav': this._navControls,
            'amble-code-no-nav': !this._navControls,
            'amble-code-window': true,
        })}
			>
				<pre><code class="amble-syntax-highlighted">${until_1.until(this.highlighted, this.source)}</code></pre>
				<div class="amble-code-language">
					<label>${this.label}</label>
					<amble-button @click="${this.onPrevLanguage}" class="amble-code-language-prev" label="Previous Language" title="Previous Language">${AmbleArt_1.ARROW_LEFT_SVG}</amble-button>
					<amble-button @click="${this.onNextLanguage}" class="amble-code-language-next" label="Next Language" title="Next Language">${AmbleArt_1.ARROW_RIGHT_SVG}</amble-button>
				</div>
			</div>
		`;
    }
    setHighlightedSourceRefs(refs) {
        if (refs != null) {
            const codeEl = this.codeEl;
            if (codeEl == null) {
                setTimeout(() => this.setHighlightedSourceRefs(refs), 100);
            }
            else {
                const langIds = this.syntax.split(',');
                const ref = refs.filter((r) => r.languageId == null || langIds.includes(r.languageId))[0];
                if (ref == null) {
                    this.clearHighlighted();
                }
                else if (ref.selector !== this.previousHighlightSelector) {
                    this.clearHighlighted();
                    this.previousHighlightSelector = ref.selector;
                    const selected = Array.prototype.slice.apply(codeEl.querySelectorAll(ref.selector));
                    this.previousHighlights.push(...selected);
                    selected.forEach((el) => el.classList.add(this.highlightClass));
                }
            }
        }
        else {
            this.clearHighlighted();
        }
    }
};
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", Object)
], AmbleCodeElement.prototype, "highlightClass", void 0);
__decorate([
    lit_element_1.property({ type: Number }),
    __metadata("design:type", Number)
], AmbleCodeElement.prototype, "index", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", String)
], AmbleCodeElement.prototype, "source", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", String)
], AmbleCodeElement.prototype, "syntax", void 0);
__decorate([
    lit_element_1.property({ type: Boolean }),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], AmbleCodeElement.prototype, "navControls", null);
AmbleCodeElement = __decorate([
    lit_element_1.customElement('amble-code')
], AmbleCodeElement);
exports.AmbleCodeElement = AmbleCodeElement;


/***/ }),

/***/ "./src/AmbleElement.ts":
/*!*****************************!*\
  !*** ./src/AmbleElement.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AmbleElement = void 0;
const lit_element_1 = __webpack_require__(/*! lit-element */ "./node_modules/lit-element/lit-element.js");
const util_1 = __webpack_require__(/*! ./util */ "./src/util.ts");
class AmbleElement extends lit_element_1.LitElement {
    constructor() {
        super();
        Object.defineProperty(this, "hidden", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "label", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ''
        });
        Object.defineProperty(this, "title", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ''
        });
    }
    changed(key, previous) {
        util_1.catchAndLog(this.requestUpdate(key, previous));
    }
}
__decorate([
    lit_element_1.property({ type: Boolean }),
    __metadata("design:type", Object)
], AmbleElement.prototype, "hidden", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", Object)
], AmbleElement.prototype, "label", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", Object)
], AmbleElement.prototype, "title", void 0);
exports.AmbleElement = AmbleElement;


/***/ }),

/***/ "./src/AmbleQuestionElement.ts":
/*!*************************************!*\
  !*** ./src/AmbleQuestionElement.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AmbleQuestionElement = exports.HIGHLIGHT_WHEN_R = exports.HIGHLIGHT_WHEN_A = exports.HIGHLIGHT_WHEN_Q = void 0;
const lit_element_1 = __webpack_require__(/*! lit-element */ "./node_modules/lit-element/lit-element.js");
const AmbleElement_1 = __webpack_require__(/*! ./AmbleElement */ "./src/AmbleElement.ts");
exports.HIGHLIGHT_WHEN_Q = 'Question';
exports.HIGHLIGHT_WHEN_A = 'Answer';
exports.HIGHLIGHT_WHEN_R = 'Rationale';
let AmbleQuestionElement = class AmbleQuestionElement extends AmbleElement_1.AmbleElement {
    constructor() {
        super();
        Object.defineProperty(this, "answerEl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "highlightWhen", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: exports.HIGHLIGHT_WHEN_A
        });
        Object.defineProperty(this, "links", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "questionEl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "rationaleEl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sourceRefs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.questionEl = this.querySelector('[slot="question"]');
        this.answerEl = this.querySelector('[slot="answer"]');
        this.rationaleEl = this.querySelector('[slot="rationale"]');
        this.sourceRefs = Array.prototype.slice.apply(this.querySelectorAll('amble-source-ref, [is="amble-source-ref"]'));
        this.links = Array.prototype.slice.apply(this.querySelectorAll('.amble-link'));
    }
};
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", String)
], AmbleQuestionElement.prototype, "highlightWhen", void 0);
AmbleQuestionElement = __decorate([
    lit_element_1.customElement('amble-question'),
    __metadata("design:paramtypes", [])
], AmbleQuestionElement);
exports.AmbleQuestionElement = AmbleQuestionElement;


/***/ }),

/***/ "./src/AmbleSourceElement.ts":
/*!***********************************!*\
  !*** ./src/AmbleSourceElement.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AmbleSourceElement = void 0;
const lit_element_1 = __webpack_require__(/*! lit-element */ "./node_modules/lit-element/lit-element.js");
const AmbleElement_1 = __webpack_require__(/*! ./AmbleElement */ "./src/AmbleElement.ts");
const util_1 = __webpack_require__(/*! ./util */ "./src/util.ts");
let AmbleSourceElement = class AmbleSourceElement extends AmbleElement_1.AmbleElement {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "syntax", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ''
        });
    }
    get source() {
        return this.innerText;
    }
    get unindentedSource() {
        return util_1.unindent(this.source);
    }
};
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", Object)
], AmbleSourceElement.prototype, "syntax", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], AmbleSourceElement.prototype, "source", null);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], AmbleSourceElement.prototype, "unindentedSource", null);
AmbleSourceElement = __decorate([
    lit_element_1.customElement('amble-source')
], AmbleSourceElement);
exports.AmbleSourceElement = AmbleSourceElement;


/***/ }),

/***/ "./src/AmbleSourceFormatter.ts":
/*!*************************************!*\
  !*** ./src/AmbleSourceFormatter.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cachingHighlighter = exports.COUNTED_CLASS_NAMES = exports.OP_NAMES = void 0;
exports.OP_NAMES = {
    '!': 'bang',
    '!=': 'neq',
    '%': 'percent',
    '&': 'and',
    '&&': 'andand',
    '&amp;': 'and',
    '&amp;&amp;': 'andand',
    '&gt;': 'gt',
    '&gt;=': 'gte',
    '&lt;': 'lt',
    '&lt;&gt;': 'gtlt',
    '&lt;=': 'lte',
    '*': 'star',
    '**': 'starstar',
    '+': 'plus',
    '++': 'plusplus',
    '-': 'minus',
    '-&gt;': 'rarr',
    '--': 'minusminus',
    '->': 'rarr',
    '/': 'slash',
    ':': 'colon',
    ':=': 'coloneq',
    '<': 'lt',
    '<=': 'lte',
    '<>': 'gtlt',
    '=': 'eq',
    '=&gt;': 'eqgt',
    '==': 'eqeq',
    '=>': 'eqgt',
    '>': 'gt',
    '>=': 'gte',
    '?': 'q',
    '\\': 'backslash',
    '^': 'caret',
    '|': 'or',
    '||': 'oror',
};
exports.COUNTED_CLASS_NAMES = ['variable', 'keyword', 'class-name', 'annotation', 'boolean', 'namespace', 'number'];
function getPrism() {
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existing = window.Prism;
        if (existing != null) {
            resolve(existing);
        }
        else {
            document.addEventListener('load', () => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const loaded = window.Prism;
                if (loaded == null) {
                    reject(new Error('Prism not configured.'));
                }
                else {
                    resolve(loaded);
                }
            });
        }
    });
}
function formatSource(code, language) {
    return getPrism().then((prism) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const grammar = prism.languages[language];
        if (grammar == null) {
            console.warn(`No grammar for language: ${language}`);
            return '';
        }
        try {
            const typeCounts = {};
            const cleanAndCount = (prefix, value) => {
                const clean = value.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
                const key = `${prefix}-${clean}`;
                const count = (typeCounts[key] || 0) + 1;
                typeCounts[key] = count;
                return [key, `${key}-${count}`];
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return prism
                .highlight(code, grammar, language)
                .split(/\r\n|[\r\n]/g)
                .map((line, index) => {
                const l = line
                    .replace(/<span\s+class="(.+?)">(.*?)<\/span>/g, (all, classNames, value) => {
                    const cns = classNames.split(/\s+/g);
                    for (const type of exports.COUNTED_CLASS_NAMES) {
                        if (cns.includes(type)) {
                            cns.push(...cleanAndCount(type, value));
                        }
                    }
                    if (cns.includes('operator')) {
                        const opName = exports.OP_NAMES[value];
                        if (opName != null) {
                            cns.push(...cleanAndCount('operator', opName));
                        }
                    }
                    return `<span class="${cns.join(' ')}">${value}</span>`;
                })
                    .replace(/((?:^|<\/span>)[ \t]*)([a-zA-Z0-9_]+)([ \t]*(?:<span|$))/, (all, pre, mid, post) => {
                    return `${pre}<span class="bare ${cleanAndCount('bare', mid).join(' ')}">${mid}</span>${post}`;
                });
                return `<span class="line line-${index + 1}">${l}</span>`;
            })
                .join('\n');
        }
        catch (err) {
            console.error('Error while highlighting', language, code, err);
        }
        return code;
    });
}
function cachingHighlighter() {
    const cache = {};
    return (code, language) => {
        let snips = cache[language];
        if (snips == null) {
            snips = {};
            cache[language] = snips;
        }
        const html = snips[code];
        if (html != null) {
            return Promise.resolve(html);
        }
        const detabified = code.replace(/\t/g, '  ');
        return formatSource(detabified, language).then((html) => {
            snips[code] = html;
            return html;
        });
    };
}
exports.cachingHighlighter = cachingHighlighter;


/***/ }),

/***/ "./src/AmbleSourceRefElement.ts":
/*!**************************************!*\
  !*** ./src/AmbleSourceRefElement.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AmbleSourceRefElement = void 0;
const lit_element_1 = __webpack_require__(/*! lit-element */ "./node_modules/lit-element/lit-element.js");
const AmbleElement_1 = __webpack_require__(/*! ./AmbleElement */ "./src/AmbleElement.ts");
let AmbleSourceRefElement = class AmbleSourceRefElement extends AmbleElement_1.AmbleElement {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "selector", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "languageId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
};
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", String)
], AmbleSourceRefElement.prototype, "selector", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", Object)
], AmbleSourceRefElement.prototype, "languageId", void 0);
AmbleSourceRefElement = __decorate([
    lit_element_1.customElement('amble-source-ref')
], AmbleSourceRefElement);
exports.AmbleSourceRefElement = AmbleSourceRefElement;


/***/ }),

/***/ "./src/AmbleStepElement.ts":
/*!*********************************!*\
  !*** ./src/AmbleStepElement.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AmbleStepElement = void 0;
const lit_element_1 = __webpack_require__(/*! lit-element */ "./node_modules/lit-element/lit-element.js");
const AmbleElement_1 = __webpack_require__(/*! ./AmbleElement */ "./src/AmbleElement.ts");
const util_1 = __webpack_require__(/*! ./util */ "./src/util.ts");
let AmbleStepElement = class AmbleStepElement extends AmbleElement_1.AmbleElement {
    constructor() {
        var _a, _b;
        super();
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "extra", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "links", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sourceRefs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.description = util_1.undefIfEmpty((_a = this.querySelector('[slot="description"]')) === null || _a === void 0 ? void 0 : _a.innerHTML);
        this.extra = util_1.undefIfEmpty((_b = this.querySelector('[slot="extra"]')) === null || _b === void 0 ? void 0 : _b.innerHTML);
        this.sourceRefs = Array.prototype.slice.apply(this.querySelectorAll('amble-source-ref, [is="amble-source-ref"]'));
        this.links = Array.prototype.slice.apply(this.querySelectorAll('.amble-link'));
    }
};
AmbleStepElement = __decorate([
    lit_element_1.customElement('amble-step'),
    __metadata("design:paramtypes", [])
], AmbleStepElement);
exports.AmbleStepElement = AmbleStepElement;


/***/ }),

/***/ "./src/AmbleViewerElement.ts":
/*!***********************************!*\
  !*** ./src/AmbleViewerElement.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AmbleViewerElement = exports.CODE_COUNT_BY_LAYOUT = exports.BODY_LAYOUT_REFS = exports.BODY_LAYOUT_4 = exports.BODY_LAYOUT_2V = exports.BODY_LAYOUT_2H = exports.BODY_LAYOUT_1 = exports.QUIZ_MODE_R = exports.QUIZ_MODE_A = exports.QUIZ_MODE_Q = exports.FOOTER_MODE_NONE = exports.FOOTER_MODE_QUIZ = exports.FOOTER_MODE_STEP = void 0;
const lit_element_1 = __webpack_require__(/*! lit-element */ "./node_modules/lit-element/lit-element.js");
const class_map_1 = __webpack_require__(/*! lit-html/directives/class-map */ "./node_modules/lit-html/directives/class-map.js");
const unsafe_html_1 = __webpack_require__(/*! lit-html/directives/unsafe-html */ "./node_modules/lit-html/directives/unsafe-html.js");
const AmbleArt_1 = __webpack_require__(/*! ./AmbleArt */ "./src/AmbleArt.ts");
const AmbleCodeElement_1 = __webpack_require__(/*! ./AmbleCodeElement */ "./src/AmbleCodeElement.ts");
const AmbleElement_1 = __webpack_require__(/*! ./AmbleElement */ "./src/AmbleElement.ts");
const AmbleQuestionElement_1 = __webpack_require__(/*! ./AmbleQuestionElement */ "./src/AmbleQuestionElement.ts");
// TODO: Migrate much of this to observables
exports.FOOTER_MODE_STEP = 'step';
exports.FOOTER_MODE_QUIZ = 'quiz';
exports.FOOTER_MODE_NONE = 'none';
exports.QUIZ_MODE_Q = 'question';
exports.QUIZ_MODE_A = 'answer';
exports.QUIZ_MODE_R = 'rationale';
exports.BODY_LAYOUT_1 = '1';
exports.BODY_LAYOUT_2H = '2H';
exports.BODY_LAYOUT_2V = '2V';
exports.BODY_LAYOUT_4 = '4';
exports.BODY_LAYOUT_REFS = 'R';
exports.CODE_COUNT_BY_LAYOUT = {
    [exports.BODY_LAYOUT_1]: 1,
    [exports.BODY_LAYOUT_2H]: 2,
    [exports.BODY_LAYOUT_2V]: 2,
    [exports.BODY_LAYOUT_4]: 4,
    [exports.BODY_LAYOUT_REFS]: 1,
};
const QUESTION_CURRENT = 'amble-quiz-qar-current';
const STEP_EXTRA_MODE_EXTRA = 'extra';
const STEP_EXTRA_MODE_STEP = 'step';
// noinspection CssInvalidHtmlTagReference
let AmbleViewerElement = class AmbleViewerElement extends AmbleElement_1.AmbleElement {
    constructor() {
        super();
        Object.defineProperty(this, "_codeChildren", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_renderedQuestions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_visibleCode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "bodyLayout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: exports.BODY_LAYOUT_2H
        });
        Object.defineProperty(this, "currentQuestion", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "currentQuestionNum", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: -1
        });
        Object.defineProperty(this, "currentRenderedQuestion", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "currentStep", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "currentStepNum", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: -1
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ''
        });
        Object.defineProperty(this, "footerMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: exports.FOOTER_MODE_NONE
        });
        Object.defineProperty(this, "isFullScreen", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "questionChildren", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "quizMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: exports.QUIZ_MODE_Q
        });
        Object.defineProperty(this, "sources", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "stepChildren", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "stepExtraMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'step'
        });
        Object.defineProperty(this, "title", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ''
        });
        Object.defineProperty(this, "trackProgress", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "visibleCodeCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.querySelectorAll('amble-source, [is="amble-source"]').forEach((s) => this.sources.push(s));
        this.querySelectorAll('amble-question, [is="amble-question"]').forEach((s) => this.questionChildren.push(s));
        this.querySelectorAll('amble-step, [is="amble-step"]').forEach((s) => this.stepChildren.push(s));
        this.addEventListener(AmbleCodeElement_1.CodeChangeRequestEventType, (ev) => {
            if (ev instanceof AmbleCodeElement_1.CodeChangeRequestEvent) {
                this.onCodeChangeRequest(ev);
            }
        });
    }
    get codeChildren() {
        var _a;
        if (this._codeChildren == null) {
            this._codeChildren = Array.prototype.slice.apply((_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll('amble-code, [is="amble-code"]'));
        }
        return this._codeChildren;
    }
    get currentHasLinks() {
        switch (this.footerMode) {
            case exports.FOOTER_MODE_NONE:
                return undefined;
            case exports.FOOTER_MODE_QUIZ:
                return this.currentQuestion;
            case exports.FOOTER_MODE_STEP:
                return this.currentStep;
        }
    }
    get renderedQuestions() {
        var _a;
        if (this._renderedQuestions.length === 0) {
            const items = Array.prototype.slice.apply((_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.amble-quiz-qar'));
            this._renderedQuestions.push(...items);
        }
        return this._renderedQuestions;
    }
    get visibleCode() {
        if (this._visibleCode.length === 0) {
            this._visibleCode.push(...this.codeChildren.slice(0, this.visibleCodeCount));
        }
        return this._visibleCode;
    }
    backQuestion() {
        this.changeQuestion(-1);
    }
    backStep() {
        this.changeStep(-1);
    }
    changeQuestion(step) {
        const previousIndex = this.currentQuestionNum;
        const index = (previousIndex + this.questionChildren.length + step) % this.questionChildren.length;
        this.setCurrentQuestion(index);
    }
    changeStep(delta) {
        const wasStepNum = this.currentStepNum;
        const nowStepNum = (wasStepNum + this.stepChildren.length + delta) % this.stepChildren.length;
        this.setCurrentStep(nowStepNum);
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        if (this.sources.length < 2) {
            this.setLayout(exports.BODY_LAYOUT_1);
        }
        else {
            this.setLayout(exports.BODY_LAYOUT_2H);
        }
        if (this.stepChildren.length > 0) {
            this.footerMode = exports.FOOTER_MODE_STEP;
            this.setCurrentStep(0);
        }
        else if (this.questionChildren.length > 0) {
            this.footerMode = exports.FOOTER_MODE_QUIZ;
            this.setCurrentQuestion(0);
        }
        else {
            this.footerMode = exports.FOOTER_MODE_NONE;
        }
    }
    forwardQuestion() {
        this.changeQuestion(1);
    }
    forwardStep() {
        this.changeStep(1);
    }
    goFullscreen() {
        const onFullScreenChange = () => {
            const el = document.fullscreenElement;
            const previous = this.isFullScreen;
            const now = el === this;
            if (previous !== now) {
                this.isFullScreen = now;
                this.changed('isFullScreen', previous);
            }
            if (!now) {
                this.removeEventListener('fullscreenchange', onFullScreenChange);
                this.removeEventListener('fullscreenerror', onFullScreenChange);
            }
        };
        if (document.fullscreenElement === this) {
            document.exitFullscreen().finally(() => {
                this.removeEventListener('fullscreenchange', onFullScreenChange);
                this.removeEventListener('fullscreenerror', onFullScreenChange);
                this.isFullScreen = false;
                return this.changed('isFullScreen', true);
            });
        }
        else {
            this.requestFullscreen().then(() => {
                this.isFullScreen = true;
                return this.changed('isFullScreen', false);
            });
            this.addEventListener('fullscreenchange', onFullScreenChange);
            this.addEventListener('fullscreenerror', onFullScreenChange);
        }
    }
    goQuizMode() {
        this.setFooterMode(exports.FOOTER_MODE_QUIZ);
        this.setQuizMode(exports.QUIZ_MODE_Q);
        this.setCurrentQuestion(0);
        this.rehighlight();
    }
    goStepMode() {
        this.setFooterMode(exports.FOOTER_MODE_STEP);
        this.setCurrentStep(0);
        this.rehighlight();
    }
    hideFooter() {
        this.setFooterMode(exports.FOOTER_MODE_NONE);
        if (this.bodyLayout === exports.BODY_LAYOUT_REFS) {
            this.setLayout(exports.BODY_LAYOUT_2H);
        }
        this.rehighlight();
    }
    onCodeChangeRequest(ev) {
        var _a;
        const step = ev.step;
        const el = ev.codeElement;
        const previousIndex = this.codeChildren.indexOf(el);
        const previousVisibleIndex = this.visibleCode.indexOf(el);
        const previousVisibleOffset = previousVisibleIndex + 1;
        const visibleCount = this.visibleCodeCount;
        const allCount = this.codeChildren.length;
        if (allCount <= visibleCount) {
            return;
        }
        for (let i = 1; i < allCount; i++) {
            const targetIndex = (previousIndex + allCount + i * step) % allCount;
            const targetEl = this.codeChildren[targetIndex];
            const targetVisibleIndex = this.visibleCode.indexOf(targetEl);
            if (targetVisibleIndex < 0) {
                this.visibleCode[previousVisibleIndex] = targetEl;
                el.classList.remove(`amble-code-pos-${previousVisibleOffset}`);
                el.navControls = false;
                el.clearHighlighted();
                targetEl.classList.add(`amble-code-pos-${previousVisibleOffset}`);
                targetEl.navControls = visibleCount < allCount;
                if (this.currentStep != null) {
                    targetEl.setHighlightedSourceRefs((_a = this.currentHasLinks) === null || _a === void 0 ? void 0 : _a.sourceRefs);
                }
                break;
            }
        }
    }
    rehighlight() {
        if (this.footerMode === exports.FOOTER_MODE_STEP) {
            this.visibleCode.forEach((c) => { var _a; return c.setHighlightedSourceRefs((_a = this.currentHasLinks) === null || _a === void 0 ? void 0 : _a.sourceRefs); });
        }
        else if (this.footerMode === exports.FOOTER_MODE_QUIZ && this.currentQuestion != null) {
            const doHighlight = this.currentQuestion.highlightWhen === AmbleQuestionElement_1.HIGHLIGHT_WHEN_Q || (this.quizMode === exports.QUIZ_MODE_A && this.currentQuestion.highlightWhen !== AmbleQuestionElement_1.HIGHLIGHT_WHEN_R) || this.quizMode === exports.QUIZ_MODE_R;
            const refs = doHighlight ? this.currentQuestion.sourceRefs : [];
            this.visibleCode.forEach((c) => c.setHighlightedSourceRefs(refs));
        }
        else {
            this.visibleCode.forEach((c) => c.clearHighlighted());
        }
    }
    render() {
        var _a;
        return lit_element_1.html `
			<link rel="stylesheet" href="src/AmbleViewerElement.css" />
			<div
				class=${class_map_1.classMap({
            amble: true,
            'amble-body-can-2': this.sources.length >= 2,
            'amble-body-can-4': this.sources.length >= 3,
            'amble-body-layout-1': this.bodyLayout === exports.BODY_LAYOUT_1,
            'amble-body-layout-2h': this.bodyLayout === exports.BODY_LAYOUT_2H,
            'amble-body-layout-2v': this.bodyLayout === exports.BODY_LAYOUT_2V,
            'amble-body-layout-4': this.bodyLayout === exports.BODY_LAYOUT_4,
            'amble-body-layout-refs': this.bodyLayout === exports.BODY_LAYOUT_REFS,
            'amble-can-track-progress': this.trackProgress,
            'amble-footer-mode-none': this.footerMode === 'none',
            'amble-footer-mode-quiz': this.footerMode === 'quiz',
            'amble-footer-mode-step': this.footerMode === 'step',
            'amble-has-quiz': this.questionChildren.length > 0,
            'amble-has-step': this.stepChildren.length > 0,
            'amble-has-steps': this.stepChildren.length > 1,
            'amble-is-full-screen': this.isFullScreen,
            'amble-multi-quiz': this.questionChildren.length > 1,
            'amble-no-quiz': this.questionChildren.length === 0,
            'amble-no-steps': this.stepChildren.length === 0,
            'amble-one-step': this.stepChildren.length === 1,
            'amble-question-has-current': this.currentQuestion != null,
            'amble-question-no-current': this.currentQuestion == null,
            'amble-quiz-mode-a': this.quizMode === exports.QUIZ_MODE_A,
            'amble-quiz-mode-q': this.quizMode === exports.QUIZ_MODE_Q,
            'amble-quiz-mode-r': this.quizMode === exports.QUIZ_MODE_R,
            'amble-step-has-current': this.currentStep != null,
            'amble-step-mode-extra': this.stepExtraMode === STEP_EXTRA_MODE_EXTRA,
            'amble-step-mode-step': this.stepExtraMode === STEP_EXTRA_MODE_STEP,
            'amble-step-no-current': this.currentStep == null,
            'can-full-screen': document.fullscreenEnabled,
        })}
			>
				<header class="amble-header">
					<div class="amble-header-top">
						<h1 class="amble-title">
							<slot name="title"></slot>
						</h1>
						<nav class="amble-nav">
							<amble-button
								label="Show walk-through"
								title="Walk-Through"
								value="step"
								class=${class_map_1.classMap({
            active: this.footerMode === exports.FOOTER_MODE_STEP,
            'step-mode-button': true,
        })}
								@click=${this.goStepMode}
								?disabled=${this.footerMode === exports.FOOTER_MODE_STEP}
							>
								${AmbleArt_1.WALK_THROUGH_SVG}
							</amble-button>
							<amble-button
								label="Show self-assessment"
								title="Self-Assessment"
								value="quiz"
								@click=${this.goQuizMode}
								class=${class_map_1.classMap({
            active: this.footerMode === exports.FOOTER_MODE_QUIZ,
            'quiz-mode-button': true,
        })}
								?disabled=${this.footerMode === exports.FOOTER_MODE_QUIZ}
							>
								${AmbleArt_1.SELF_ASSESSMENT_SVG}
							</amble-button>
							<amble-button
								label="Hide footer"
								title="Show less"
								value="hidden"
								@click=${this.hideFooter}
								class=${class_map_1.classMap({
            active: this.footerMode === exports.FOOTER_MODE_NONE,
            'no-footer-button': true,
        })}
								?disabled=${this.footerMode === exports.FOOTER_MODE_NONE}
							>
								${AmbleArt_1.SHOW_LESS_SVG}
							</amble-button>
							<amble-button class="amble-track-toggle" icon="check" label="Toggle progress tracking overlay" title="Track Progress" disabled="disabled">${AmbleArt_1.CHECKED_BOX_SVG}</amble-button>
							<amble-button class="amble-layout" label="Toggle code layout overlay" title="Code Layout" @click=${this.toggleLayout}>${AmbleArt_1.LAYOUT_SVG}</amble-button>
							<amble-button @click="${this.goFullscreen}" class="amble-big-toggle" label="Toggle fullscreen display for this code walkthrough" bindableTitle="${this.isFullScreen ? 'Leave Full Screen' : 'Go Full Screen'}">${this.isFullScreen ? AmbleArt_1.EXIT_FULL_SCREEN_SVG : AmbleArt_1.FULL_SCREEN_SVG}</amble-button>
						</nav>
					</div>
					<h2 class="amble-description">
						<slot name="description"></slot>
					</h2>
				</header>
				<main class="amble-body">
					${this.sources.map((source, index) => lit_element_1.html ` <amble-code source=${source.unindentedSource} index=${index} syntax=${source.syntax} label=${source.label} navControls="true"></amble-code> `)}
					<div class="amble-refs">
						<header class="amble-refs-header">
							<label>References</label>
						</header>
						<nav class="amble-refs-links"> ${(((_a = this.currentHasLinks) === null || _a === void 0 ? void 0 : _a.links) || []).map((link) => lit_element_1.html ` <span class="amble-ref-link">${AmbleArt_1.LINK_SVG} ${link}</span> `)} </nav>
					</div>
				</main>
				<footer class="amble-footer">
					<div class="amble-walk">
						${this.stepChildren.map((step, index) => lit_element_1.html `
								<div
									class=${class_map_1.classMap({
            'amble-step-has-extra': step.extra != null,
            'amble-step-no-extra': step.extra == null,
            'amble-walk-step': true,
            'amble-walk-step-current': index === this.currentStepNum,
        })}
								>
									<div class="amble-walk-step-header">
										<div class="amble-walk-description">
											<span class="text-with-code">${unsafe_html_1.unsafeHTML(step.description)}</span>
										</div>
										<amble-button @click=${this.toggleReferences} class="amble-walk-refs-toggle" label="Toggle additional references" title="References">${AmbleArt_1.INFO_SVG}</amble-button>
										<amble-button @click=${this.toggleStepExtra} class="amble-walk-extra-toggle" label="Toggle extra details" title="Extras">${AmbleArt_1.SHOW_MORE_SVG}</amble-button>
										<amble-button @click=${this.backStep} class="amble-walk-prev" label="Previous walk-through item" title="Previous">${AmbleArt_1.ARROW_LEFT_SVG}</amble-button>
										<div class="amble-walk-progress amble-progress">
											<span>${index + 1 + '/' + this.stepChildren.length}</span>
										</div>
										<amble-button @click=${this.forwardStep} class="amble-walk-next" label="Next walk-through item" title="Next">${AmbleArt_1.ARROW_RIGHT_SVG}</amble-button>
									</div>
									<div class="amble-walk-extra">
										<span class="text-with-code">${unsafe_html_1.unsafeHTML(step.extra)}</span>
									</div>
								</div>
							`)}
					</div>
					<div class="amble-quiz">
						${this.questionChildren.map((q, index) => {
            var _a, _b, _c;
            return lit_element_1.html `
								<div
									class=${class_map_1.classMap({
                'amble-question-has-rationale': q.rationaleEl != null,
                'amble-question-no-rationale': q.rationaleEl == null,
                'amble-quiz-current-item': index === this.currentQuestionNum,
                'amble-quiz-qar': true,
            })}
								>
									<div class="amble-quiz-q">
										<span class="amble-qa-label">Q:</span>
										<div class="amble-quiz-question">
											<span class="text-with-code">${unsafe_html_1.unsafeHTML((_a = q.questionEl) === null || _a === void 0 ? void 0 : _a.innerHTML)}</span>
										</div>
										<amble-button @click=${this.toggleReferences} class="amble-walk-refs-toggle" label="Toggle additional references" title="References">${AmbleArt_1.INFO_SVG}</amble-button>
										<amble-button @click=${this.toggleAnswer} class="amble-quiz-answer-toggle" label="Toggle the answer" title="Answer">${AmbleArt_1.SHOW_MORE_SVG}</amble-button>
										<amble-button @click=${this.backQuestion} class="amble-quiz-prev" label="Previous self-assessment item" title="Previous">${AmbleArt_1.ARROW_LEFT_SVG}</amble-button>
										<div class="amble-quiz-progress amble-progress">
											<nobr>${index + 1 + '/' + this.questionChildren.length}</nobr>
										</div>
										<amble-button @click=${this.forwardQuestion} class="amble-quiz-next" label="Next self-assessment item" title="Next">${AmbleArt_1.ARROW_RIGHT_SVG}</amble-button>
									</div>
									<div class="amble-quiz-answer">
										<span class="amble-qa-label">A:</span>
										<span class="text-with-code">${unsafe_html_1.unsafeHTML((_b = q.answerEl) === null || _b === void 0 ? void 0 : _b.innerHTML)}</span>
										<amble-button @click=${this.toggleRationale} class="amble-quiz-rationale-toggle" label="Toggle the rationale" title="Rationale">${AmbleArt_1.SHOW_MORE_SVG}</amble-button>
									</div>
									<div class="amble-quiz-rationale">
										<span class="amble-qa-label">Rationale:</span>
										<span class="text-with-code">${unsafe_html_1.unsafeHTML((_c = q.rationaleEl) === null || _c === void 0 ? void 0 : _c.innerHTML)}</span>
									</div>
								</div>
							`;
        })}
					</div>
				</footer>
			</div>
		`;
    }
    setCurrentQuestion(index) {
        const previousIndex = this.currentQuestionNum;
        const previousIn = this.currentQuestion;
        const previousOut = this.currentRenderedQuestion;
        const questionIn = index < 0 ? undefined : this.questionChildren[index];
        const questionOut = index < 0 ? undefined : this.renderedQuestions[index];
        if (previousIn !== questionIn) {
            if (questionOut != null) {
                questionOut.classList.add(QUESTION_CURRENT);
            }
            if (previousOut != null) {
                previousOut.classList.remove(QUESTION_CURRENT);
            }
            this.currentQuestionNum = index;
            this.changed('currentQuestionNum', previousIndex);
            this.currentQuestion = questionIn;
            this.changed('currentQuestion', previousIn);
            this.currentRenderedQuestion = questionOut;
            this.changed('currentRenderedQuestion', previousOut);
            const previousQuizMode = this.quizMode;
            if (previousQuizMode !== exports.QUIZ_MODE_Q) {
                this.quizMode = exports.QUIZ_MODE_Q;
                this.changed('quizMode', previousQuizMode);
            }
        }
        this.changed('currentHasLinks', previousIn);
        this.rehighlight();
    }
    setCurrentStep(index) {
        const previousIndex = this.currentStepNum;
        const previousStep = this.currentStep;
        const nowStep = index < 0 ? undefined : this.stepChildren[index];
        if (nowStep != null && nowStep.extra == null) {
            const wasStepExtraMode = this.stepExtraMode;
            this.stepExtraMode = STEP_EXTRA_MODE_STEP;
            this.changed('stepExtraMode', wasStepExtraMode);
        }
        this.currentStepNum = index;
        this.changed('currentStepNum', previousIndex);
        this.currentStep = nowStep;
        this.changed('currentStep', previousStep);
        this.changed('currentHasLinks', previousStep);
        this.rehighlight();
    }
    setFooterMode(mode) {
        const oldMode = this.footerMode;
        if (oldMode !== mode) {
            this.footerMode = mode;
            this.changed('footerMode', oldMode);
        }
    }
    setLayout(layout) {
        const previousLayout = this.bodyLayout;
        const previousVisibleCount = exports.CODE_COUNT_BY_LAYOUT[previousLayout];
        this.bodyLayout = layout;
        this.visibleCodeCount = exports.CODE_COUNT_BY_LAYOUT[layout];
        this.changed('bodyLayout', previousLayout);
        if (this.visibleCodeCount < previousVisibleCount) {
            for (let i = this.visibleCodeCount; i < previousVisibleCount; i++) {
                const el = this.visibleCode[i];
                el.classList.remove(`amble-code-pos-${i + 1}`);
                el.clearHighlighted();
            }
            this.visibleCode.splice(this.visibleCodeCount, previousVisibleCount - this.visibleCodeCount);
        }
        else if (this.visibleCodeCount > previousVisibleCount) {
            this.codeChildren
                .filter((c) => !this.visibleCode.includes(c))
                .slice(0, this.visibleCodeCount - previousVisibleCount)
                .forEach((c) => {
                this.visibleCode.push(c);
            });
        }
        const allowNav = this.visibleCodeCount < this.codeChildren.length;
        this.visibleCode.forEach((c, i) => {
            for (let j = 1; j <= 4; j++) {
                const pos = `amble-code-pos-${j}`;
                if (i === j - 1) {
                    c.classList.add(pos);
                }
                else {
                    c.classList.remove(pos);
                }
            }
            c.navControls = allowNav;
        });
        this.rehighlight();
    }
    setQuizMode(mode) {
        const previous = this.quizMode;
        if (previous !== mode) {
            this.quizMode = mode;
            this.changed('quizMode', previous);
        }
    }
    toggleAnswer() {
        const previous = this.quizMode;
        this.quizMode = previous === exports.QUIZ_MODE_Q ? exports.QUIZ_MODE_A : exports.QUIZ_MODE_Q;
        this.changed('quizMode', previous);
        this.rehighlight();
    }
    toggleLayout() {
        let newLayout;
        switch (this.bodyLayout) {
            case exports.BODY_LAYOUT_1:
                newLayout = exports.BODY_LAYOUT_2H;
                break;
            case exports.BODY_LAYOUT_2H:
                newLayout = exports.BODY_LAYOUT_2V;
                break;
            case exports.BODY_LAYOUT_2V:
                newLayout = this.sources.length > 2 ? exports.BODY_LAYOUT_4 : exports.BODY_LAYOUT_1;
                break;
            case exports.BODY_LAYOUT_4:
                newLayout = exports.BODY_LAYOUT_1;
                break;
            case exports.BODY_LAYOUT_REFS:
                newLayout = exports.BODY_LAYOUT_2H;
        }
        this.setLayout(newLayout);
    }
    toggleRationale() {
        const previous = this.quizMode;
        this.quizMode = previous === exports.QUIZ_MODE_R ? exports.QUIZ_MODE_A : exports.QUIZ_MODE_R;
        this.changed('quizMode', previous);
        this.rehighlight();
    }
    toggleReferences() {
        this.setLayout(this.bodyLayout === exports.BODY_LAYOUT_REFS ? exports.BODY_LAYOUT_2H : exports.BODY_LAYOUT_REFS);
    }
    toggleStepExtra() {
        const oldValue = this.stepExtraMode;
        if (this.stepExtraMode === STEP_EXTRA_MODE_EXTRA) {
            this.stepExtraMode = STEP_EXTRA_MODE_STEP;
        }
        else {
            this.stepExtraMode = STEP_EXTRA_MODE_EXTRA;
        }
        this.changed('stepExtraMode', oldValue);
    }
};
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", String)
], AmbleViewerElement.prototype, "bodyLayout", void 0);
__decorate([
    lit_element_1.property({ type: Number }),
    __metadata("design:type", Object)
], AmbleViewerElement.prototype, "currentQuestionNum", void 0);
__decorate([
    lit_element_1.property(),
    __metadata("design:type", Object)
], AmbleViewerElement.prototype, "currentRenderedQuestion", void 0);
__decorate([
    lit_element_1.property({ type: Number }),
    __metadata("design:type", Object)
], AmbleViewerElement.prototype, "currentStepNum", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", Object)
], AmbleViewerElement.prototype, "description", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", String)
], AmbleViewerElement.prototype, "footerMode", void 0);
__decorate([
    lit_element_1.property({ type: Boolean }),
    __metadata("design:type", Object)
], AmbleViewerElement.prototype, "isFullScreen", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", String)
], AmbleViewerElement.prototype, "quizMode", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", Object)
], AmbleViewerElement.prototype, "stepExtraMode", void 0);
__decorate([
    lit_element_1.property({ type: String }),
    __metadata("design:type", Object)
], AmbleViewerElement.prototype, "title", void 0);
__decorate([
    lit_element_1.property({ type: Boolean }),
    __metadata("design:type", Object)
], AmbleViewerElement.prototype, "trackProgress", void 0);
__decorate([
    lit_element_1.property(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], AmbleViewerElement.prototype, "currentHasLinks", null);
AmbleViewerElement = __decorate([
    lit_element_1.customElement('amble-viewer'),
    __metadata("design:paramtypes", [])
], AmbleViewerElement);
exports.AmbleViewerElement = AmbleViewerElement;


/***/ }),

/***/ "./src/ResolvablePromise.ts":
/*!**********************************!*\
  !*** ./src/ResolvablePromise.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolvablePromise = void 0;
class ResolvablePromiseImpl {
    constructor() {
        Object.defineProperty(this, "_didReject", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_didResolve", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        // noinspection SpellCheckingInspection
        Object.defineProperty(this, "_rejecter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_rejection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_resolution", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_resolver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_promise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Promise((resolve, reject) => {
                this._resolver = resolve;
                this._rejecter = reject;
                if (!this.hasCompleted) {
                    if (this._rejection.length) {
                        this._didReject = true;
                        reject(this._rejection[0]);
                    }
                    else if (this._resolution.length) {
                        this._didResolve = true;
                        resolve(this._resolution[0]);
                    }
                }
            })
        });
    }
    get [Symbol.toStringTag]() {
        return this._promise[Symbol.toStringTag];
    }
    get didReject() {
        return this._didReject;
    }
    get didResolve() {
        return this._didResolve;
    }
    get hasCompleted() {
        return this._didResolve || this._didReject;
    }
    catch(onRejected) {
        return this._promise.catch(onRejected);
    }
    finally(onFinally) {
        return this._promise.finally(onFinally);
    }
    reject(reason) {
        if (!this.hasCompleted) {
            if (this._rejecter == null) {
                this._rejection.push(reason);
            }
            else {
                this._didReject = true;
                this._rejecter(reason);
            }
        }
    }
    resolve(value) {
        if (!this.hasCompleted) {
            if (this._resolver == null) {
                this._resolution.push(value);
            }
            else {
                this._didResolve = true;
                this._resolver(value);
            }
        }
    }
    then(onFulfilled, onRejected) {
        return this._promise.then(onFulfilled, onRejected);
    }
}
function resolvablePromise() {
    return new ResolvablePromiseImpl();
}
exports.resolvablePromise = resolvablePromise;


/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.catchAndLog = exports.undefIfEmpty = exports.unindent = exports.detectEOL = exports.spinal = void 0;
function spinal(s) {
    return (s == null ? '' : s)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
}
exports.spinal = spinal;
function detectEOL(s) {
    for (const eol of ['\r\n', '\r', '\n']) {
        if (s.includes(eol)) {
            return eol;
        }
    }
    return '';
}
exports.detectEOL = detectEOL;
function unindent(source) {
    const delimiter = detectEOL(source);
    if (delimiter === '') {
        // single line
        return source.replace(/^\s+|\s+$/g, '');
    }
    const lines = source.split(delimiter);
    while (lines.length > 0 && lines[0].match(/^\s*$/)) {
        lines.shift();
    }
    while (lines.length > 0 && lines[lines.length - 1].match(/^\s*$/)) {
        lines.pop();
    }
    if (lines.length === 0) {
        return '';
    }
    const first = lines[0];
    const initialMatch = first.match(/^(\s+)/);
    if (initialMatch == null) {
        return lines.join(delimiter);
    }
    const leading = initialMatch[0];
    return lines
        .map((line) => {
        if (line.startsWith(leading)) {
            return line.substr(leading.length);
        }
        return line;
    })
        .join(delimiter);
}
exports.unindent = unindent;
function undefIfEmpty(value) {
    return value == null || value === '' ? undefined : value;
}
exports.undefIfEmpty = undefIfEmpty;
function catchAndLog(promise, message) {
    if (promise != null) {
        promise.catch((err) => console.error(message, err));
    }
}
exports.catchAndLog = catchAndLog;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./index.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=allcode-amble.js.map