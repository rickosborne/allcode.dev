import {customElement, html, property, PropertyValues} from 'lit-element';
import {Part, TemplateResult} from 'lit-html';
import {classMap} from 'lit-html/directives/class-map';
import {unsafeHTML} from 'lit-html/directives/unsafe-html';
import {until} from 'lit-html/directives/until';
import {ARROW_LEFT_SVG, ARROW_RIGHT_SVG} from './AmbleArt';
import {AmbleElement} from './AmbleElement';
import {CachingHighlighter, cachingHighlighter} from './AmbleSourceFormatter';
import {AmbleSourceRefElement} from './AmbleSourceRefElement';
import {resolvablePromise} from './ResolvablePromise';

export type UnsafeHtmlLike = (part: Part) => void;
export const CodeChangeRequestEventType = 'codechangerequest';

export class CodeChangeRequestEvent extends Event {
	constructor(public readonly step: number, public readonly codeElement: AmbleCodeElement) {
		super(CodeChangeRequestEventType, {
			bubbles: true,
			cancelable: true,
			composed: true,
		});
	}
}

@customElement('amble-code')
export class AmbleCodeElement extends AmbleElement {
	private _codeEl: HTMLElement | undefined;
	public _navControls = false;
	@property({type: String})
	public highlightClass = 'highlight';
	public readonly highlighted = resolvablePromise<UnsafeHtmlLike>();
	public highlighter: CachingHighlighter = cachingHighlighter();
	@property({type: Number})
	public index!: number;
	private previousHighlightSelector: string | undefined;
	private readonly previousHighlights: Element[] = [];
	@property({type: String})
	public source!: string;
	@property({type: String})
	public syntax!: string;

	public get codeEl(): HTMLElement | undefined {
		if (this._codeEl == null) {
			const el: HTMLElement | null | undefined = this.shadowRoot?.querySelector('.amble-syntax-highlighted');
			if (el != null) {
				this._codeEl = el;
			}
		}
		return this._codeEl;
	}

	@property({type: Boolean})
	public set navControls(show: boolean) {
		const previous = this._navControls;
		if (previous !== show) {
			this._navControls = show;
			this.requestUpdate('navControls', show);
		}
	}

	public clearHighlighted(): void {
		this.previousHighlightSelector = undefined;
		this.previousHighlights.forEach((el) => el.classList.remove(this.highlightClass));
		this.previousHighlights.splice(0, this.previousHighlights.length);
	}

	private emitChangeRequest(step: number): void {
		this.dispatchEvent(new CodeChangeRequestEvent(step, this));
	}

	protected firstUpdated(_changedProperties: PropertyValues): void {
		super.firstUpdated(_changedProperties);
		this.highlighter(this.source, this.syntax.split(',')[0])
			.then((html) => this.highlighted.resolve(unsafeHTML(html)))
			.catch((reason) => this.highlighted.reject(reason));
	}

	public onNextLanguage(): void {
		this.emitChangeRequest(1);
	}

	public onPrevLanguage(): void {
		this.emitChangeRequest(-1);
	}

	public render(): TemplateResult {
		return html`
			<link rel="stylesheet" href="src/AmbleCodeElement.css" />
			<div
				class=${classMap({
					'amble-code-nav': this._navControls,
					'amble-code-no-nav': !this._navControls,
					'amble-code-window': true,
				})}
			>
				<pre><code class="amble-syntax-highlighted">${until(this.highlighted, this.source)}</code></pre>
				<div class="amble-code-language">
					<label>${this.label}</label>
					<amble-button @click="${this.onPrevLanguage}" class="amble-code-language-prev" label="Previous Language" title="Previous Language">${ARROW_LEFT_SVG}</amble-button>
					<amble-button @click="${this.onNextLanguage}" class="amble-code-language-next" label="Next Language" title="Next Language">${ARROW_RIGHT_SVG}</amble-button>
				</div>
			</div>
		`;
	}

	public setHighlightedSourceRefs(refs: AmbleSourceRefElement[] | undefined): void {
		if (refs != null) {
			const codeEl = this.codeEl;
			if (codeEl == null) {
				setTimeout(() => this.setHighlightedSourceRefs(refs), 100);
			} else {
				const langIds = this.syntax.split(',');
				const ref = refs.filter((r) => r.languageId == null || langIds.includes(r.languageId))[0];
				if (ref == null) {
					this.clearHighlighted();
				} else if (ref.selector !== this.previousHighlightSelector) {
					this.clearHighlighted();
					this.previousHighlightSelector = ref.selector;
					const selected: Element[] = Array.prototype.slice.apply(codeEl.querySelectorAll(ref.selector));
					this.previousHighlights.push(...selected);
					selected.forEach((el) => el.classList.add(this.highlightClass));
				}
			}
		} else {
			this.clearHighlighted();
		}
	}
}
