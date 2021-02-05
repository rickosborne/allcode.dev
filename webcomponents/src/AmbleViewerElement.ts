import {customElement, html, property, PropertyValues} from 'lit-element';
import {TemplateResult} from 'lit-html';
import {classMap} from 'lit-html/directives/class-map';
import {unsafeHTML} from 'lit-html/directives/unsafe-html';
import {ARROW_LEFT_SVG, ARROW_RIGHT_SVG, CHECKED_BOX_SVG, EXIT_FULL_SCREEN_SVG, FULL_SCREEN_SVG, INFO_SVG, LAYOUT_SVG, LINK_SVG, SELF_ASSESSMENT_SVG, SHOW_LESS_SVG, SHOW_MORE_SVG, WALK_THROUGH_SVG} from './AmbleArt';
import {AmbleCodeElement, CodeChangeRequestEvent, CodeChangeRequestEventType} from './AmbleCodeElement';
import {AmbleElement} from './AmbleElement';
import {AmbleHasLinks, AmbleHasSourceRefs} from './AmbleInterfaces';
import {AmbleQuestionElement, HIGHLIGHT_WHEN_Q, HIGHLIGHT_WHEN_R} from './AmbleQuestionElement';
import {AmbleSourceElement} from './AmbleSourceElement';
import {AmbleSourceRefElement} from './AmbleSourceRefElement';
import {AmbleStepElement} from './AmbleStepElement';

// TODO: Migrate much of this to observables

export const FOOTER_MODE_STEP = 'step';
export const FOOTER_MODE_QUIZ = 'quiz';
export const FOOTER_MODE_NONE = 'none';
export const QUIZ_MODE_Q = 'question';
export const QUIZ_MODE_A = 'answer';
export const QUIZ_MODE_R = 'rationale';
export const BODY_LAYOUT_1 = '1';
export const BODY_LAYOUT_2H = '2H';
export const BODY_LAYOUT_2V = '2V';
export const BODY_LAYOUT_4 = '4';
export const BODY_LAYOUT_REFS = 'R';
export type BodyLayout = typeof BODY_LAYOUT_1 | typeof BODY_LAYOUT_2H | typeof BODY_LAYOUT_2V | typeof BODY_LAYOUT_4 | typeof BODY_LAYOUT_REFS;
export const CODE_COUNT_BY_LAYOUT: Record<BodyLayout, number> = {
	[BODY_LAYOUT_1]: 1,
	[BODY_LAYOUT_2H]: 2,
	[BODY_LAYOUT_2V]: 2,
	[BODY_LAYOUT_4]: 4,
	[BODY_LAYOUT_REFS]: 1,
};
const QUESTION_CURRENT = 'amble-quiz-qar-current';

const STEP_EXTRA_MODE_EXTRA = 'extra';
const STEP_EXTRA_MODE_STEP = 'step';

export type QuizMode = typeof QUIZ_MODE_Q | typeof QUIZ_MODE_A | typeof QUIZ_MODE_R;
export type FooterMode = typeof FOOTER_MODE_STEP | typeof FOOTER_MODE_QUIZ | typeof FOOTER_MODE_NONE;

// noinspection CssInvalidHtmlTagReference
@customElement('amble-viewer')
export class AmbleViewerElement extends AmbleElement {
	private _codeChildren!: AmbleCodeElement[];
	private readonly _renderedQuestions: Element[] = [];
	private readonly _visibleCode: AmbleCodeElement[] = [];
	@property({type: String})
	public bodyLayout: BodyLayout = BODY_LAYOUT_2H;
	public currentQuestion: AmbleQuestionElement | undefined;
	@property({type: Number})
	public currentQuestionNum = -1;
	@property()
	public currentRenderedQuestion: Element | undefined;
	private currentStep: AmbleStepElement | undefined;
	@property({type: Number})
	public currentStepNum = -1;
	@property({type: String})
	public description = '';
	@property({type: String})
	public footerMode: FooterMode = FOOTER_MODE_NONE;
	@property({type: Boolean})
	private isFullScreen = false;
	private readonly questionChildren: AmbleQuestionElement[] = [];
	@property({type: String})
	public quizMode: QuizMode = QUIZ_MODE_Q;
	private readonly sources: AmbleSourceElement[] = [];
	private readonly stepChildren: AmbleStepElement[] = [];
	@property({type: String})
	public stepExtraMode = 'step';
	@property({type: String})
	public title = '';
	@property({type: Boolean})
	public trackProgress = false;
	private visibleCodeCount = 0;

	constructor() {
		super();
		this.querySelectorAll('amble-source, [is="amble-source"]').forEach((s) => this.sources.push(s as AmbleSourceElement));
		this.querySelectorAll('amble-question, [is="amble-question"]').forEach((s) => this.questionChildren.push(s as AmbleQuestionElement));
		this.querySelectorAll('amble-step, [is="amble-step"]').forEach((s) => this.stepChildren.push(s as AmbleStepElement));
		this.addEventListener(CodeChangeRequestEventType, (ev: Event): void => {
			if (ev instanceof CodeChangeRequestEvent) {
				this.onCodeChangeRequest(ev);
			}
		});
	}

	public get codeChildren(): AmbleCodeElement[] {
		if (this._codeChildren == null) {
			this._codeChildren = Array.prototype.slice.apply(this.shadowRoot?.querySelectorAll('amble-code, [is="amble-code"]'));
		}
		return this._codeChildren;
	}

	@property()
	public get currentHasLinks(): (AmbleHasLinks & AmbleHasSourceRefs) | undefined {
		switch (this.footerMode) {
			case FOOTER_MODE_NONE:
				return undefined;
			case FOOTER_MODE_QUIZ:
				return this.currentQuestion;
			case FOOTER_MODE_STEP:
				return this.currentStep;
		}
	}

	public get renderedQuestions(): Element[] {
		if (this._renderedQuestions.length === 0) {
			const items = Array.prototype.slice.apply(this.shadowRoot?.querySelectorAll('.amble-quiz-qar'));
			this._renderedQuestions.push(...items);
		}
		return this._renderedQuestions;
	}

	public get visibleCode(): AmbleCodeElement[] {
		if (this._visibleCode.length === 0) {
			this._visibleCode.push(...this.codeChildren.slice(0, this.visibleCodeCount));
		}
		return this._visibleCode;
	}

	public backQuestion(): void {
		this.changeQuestion(-1);
	}

	public backStep(): void {
		this.changeStep(-1);
	}

	public changeQuestion(step: number): void {
		const previousIndex = this.currentQuestionNum;
		const index = (previousIndex + this.questionChildren.length + step) % this.questionChildren.length;
		this.setCurrentQuestion(index);
	}

	public changeStep(delta: number): void {
		const wasStepNum = this.currentStepNum;
		const nowStepNum = (wasStepNum + this.stepChildren.length + delta) % this.stepChildren.length;
		this.setCurrentStep(nowStepNum);
	}

	protected firstUpdated(_changedProperties: PropertyValues): void {
		super.firstUpdated(_changedProperties);
		if (this.sources.length < 2) {
			this.setLayout(BODY_LAYOUT_1);
		} else {
			this.setLayout(BODY_LAYOUT_2H);
		}
		if (this.stepChildren.length > 0) {
			this.footerMode = FOOTER_MODE_STEP;
			this.setCurrentStep(0);
		} else if (this.questionChildren.length > 0) {
			this.footerMode = FOOTER_MODE_QUIZ;
			this.setCurrentQuestion(0);
		} else {
			this.footerMode = FOOTER_MODE_NONE;
		}
	}

	public forwardQuestion(): void {
		this.changeQuestion(1);
	}

	public forwardStep(): void {
		this.changeStep(1);
	}

	public goFullscreen(): void {
		const onFullScreenChange = (): void => {
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
		} else {
			this.requestFullscreen().then(() => {
				this.isFullScreen = true;
				return this.changed('isFullScreen', false);
			});
			this.addEventListener('fullscreenchange', onFullScreenChange);
			this.addEventListener('fullscreenerror', onFullScreenChange);
		}
	}

	public goQuizMode(): void {
		this.setFooterMode(FOOTER_MODE_QUIZ);
		this.setQuizMode(QUIZ_MODE_Q);
		this.setCurrentQuestion(0);
		this.rehighlight();
	}

	public goStepMode(): void {
		this.setFooterMode(FOOTER_MODE_STEP);
		this.setCurrentStep(0);
		this.rehighlight();
	}

	public hideFooter(): void {
		this.setFooterMode(FOOTER_MODE_NONE);
		if (this.bodyLayout === BODY_LAYOUT_REFS) {
			this.setLayout(BODY_LAYOUT_2H);
		}
		this.rehighlight();
	}

	private onCodeChangeRequest(ev: CodeChangeRequestEvent) {
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
					targetEl.setHighlightedSourceRefs(this.currentHasLinks?.sourceRefs);
				}
				break;
			}
		}
	}

	private rehighlight() {
		if (this.footerMode === FOOTER_MODE_STEP) {
			this.visibleCode.forEach((c) => c.setHighlightedSourceRefs(this.currentHasLinks?.sourceRefs));
		} else if (this.footerMode === FOOTER_MODE_QUIZ && this.currentQuestion != null) {
			const doHighlight = this.currentQuestion.highlightWhen === HIGHLIGHT_WHEN_Q || (this.quizMode === QUIZ_MODE_A && this.currentQuestion.highlightWhen !== HIGHLIGHT_WHEN_R) || this.quizMode === QUIZ_MODE_R;
			const refs: AmbleSourceRefElement[] = doHighlight ? this.currentQuestion.sourceRefs : [];
			this.visibleCode.forEach((c) => c.setHighlightedSourceRefs(refs));
		} else {
			this.visibleCode.forEach((c) => c.clearHighlighted());
		}
	}

	public render(): TemplateResult {
		return html`
			<link rel="stylesheet" href="src/AmbleViewerElement.css" />
			<div
				class=${classMap({
					amble: true,
					'amble-body-can-2': this.sources.length >= 2,
					'amble-body-can-4': this.sources.length >= 3,
					'amble-body-layout-1': this.bodyLayout === BODY_LAYOUT_1,
					'amble-body-layout-2h': this.bodyLayout === BODY_LAYOUT_2H,
					'amble-body-layout-2v': this.bodyLayout === BODY_LAYOUT_2V,
					'amble-body-layout-4': this.bodyLayout === BODY_LAYOUT_4,
					'amble-body-layout-refs': this.bodyLayout === BODY_LAYOUT_REFS,
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
					'amble-quiz-mode-a': this.quizMode === QUIZ_MODE_A,
					'amble-quiz-mode-q': this.quizMode === QUIZ_MODE_Q,
					'amble-quiz-mode-r': this.quizMode === QUIZ_MODE_R,
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
								class=${classMap({
									active: this.footerMode === FOOTER_MODE_STEP,
									'step-mode-button': true,
								})}
								@click=${this.goStepMode}
								?disabled=${this.footerMode === FOOTER_MODE_STEP}
							>
								${WALK_THROUGH_SVG}
							</amble-button>
							<amble-button
								label="Show self-assessment"
								title="Self-Assessment"
								value="quiz"
								@click=${this.goQuizMode}
								class=${classMap({
									active: this.footerMode === FOOTER_MODE_QUIZ,
									'quiz-mode-button': true,
								})}
								?disabled=${this.footerMode === FOOTER_MODE_QUIZ}
							>
								${SELF_ASSESSMENT_SVG}
							</amble-button>
							<amble-button
								label="Hide footer"
								title="Show less"
								value="hidden"
								@click=${this.hideFooter}
								class=${classMap({
									active: this.footerMode === FOOTER_MODE_NONE,
									'no-footer-button': true,
								})}
								?disabled=${this.footerMode === FOOTER_MODE_NONE}
							>
								${SHOW_LESS_SVG}
							</amble-button>
							<amble-button class="amble-track-toggle" icon="check" label="Toggle progress tracking overlay" title="Track Progress" disabled="disabled">${CHECKED_BOX_SVG}</amble-button>
							<amble-button class="amble-layout" label="Toggle code layout overlay" title="Code Layout" @click=${this.toggleLayout}>${LAYOUT_SVG}</amble-button>
							<amble-button @click="${this.goFullscreen}" class="amble-big-toggle" label="Toggle fullscreen display for this code walkthrough" bindableTitle="${this.isFullScreen ? 'Leave Full Screen' : 'Go Full Screen'}">${this.isFullScreen ? EXIT_FULL_SCREEN_SVG : FULL_SCREEN_SVG}</amble-button>
						</nav>
					</div>
					<h2 class="amble-description">
						<slot name="description"></slot>
					</h2>
				</header>
				<main class="amble-body">
					${this.sources.map((source, index) => html` <amble-code source=${source.unindentedSource} index=${index} syntax=${source.syntax} label=${source.label} navControls="true"></amble-code> `)}
					<div class="amble-refs">
						<header class="amble-refs-header">
							<label>References</label>
						</header>
						<nav class="amble-refs-links"> ${(this.currentHasLinks?.links || []).map((link) => html` <span class="amble-ref-link">${LINK_SVG} ${link}</span> `)} </nav>
					</div>
				</main>
				<footer class="amble-footer">
					<div class="amble-walk">
						${this.stepChildren.map(
							(step, index) => html`
								<div
									class=${classMap({
										'amble-step-has-extra': step.extra != null,
										'amble-step-no-extra': step.extra == null,
										'amble-walk-step': true,
										'amble-walk-step-current': index === this.currentStepNum,
									})}
								>
									<div class="amble-walk-step-header">
										<div class="amble-walk-description">
											<span class="text-with-code">${unsafeHTML(step.description)}</span>
										</div>
										<amble-button @click=${this.toggleReferences} class="amble-walk-refs-toggle" label="Toggle additional references" title="References">${INFO_SVG}</amble-button>
										<amble-button @click=${this.toggleStepExtra} class="amble-walk-extra-toggle" label="Toggle extra details" title="Extras">${SHOW_MORE_SVG}</amble-button>
										<amble-button @click=${this.backStep} class="amble-walk-prev" label="Previous walk-through item" title="Previous">${ARROW_LEFT_SVG}</amble-button>
										<div class="amble-walk-progress amble-progress">
											<span>${index + 1 + '/' + this.stepChildren.length}</span>
										</div>
										<amble-button @click=${this.forwardStep} class="amble-walk-next" label="Next walk-through item" title="Next">${ARROW_RIGHT_SVG}</amble-button>
									</div>
									<div class="amble-walk-extra">
										<span class="text-with-code">${unsafeHTML(step.extra)}</span>
									</div>
								</div>
							`,
						)}
					</div>
					<div class="amble-quiz">
						${this.questionChildren.map(
							(q, index) => html`
								<div
									class=${classMap({
										'amble-question-has-rationale': q.rationaleEl != null,
										'amble-question-no-rationale': q.rationaleEl == null,
										'amble-quiz-current-item': index === this.currentQuestionNum,
										'amble-quiz-qar': true,
									})}
								>
									<div class="amble-quiz-q">
										<span class="amble-qa-label">Q:</span>
										<div class="amble-quiz-question">
											<span class="text-with-code">${unsafeHTML(q.questionEl?.innerHTML)}</span>
										</div>
										<amble-button @click=${this.toggleReferences} class="amble-walk-refs-toggle" label="Toggle additional references" title="References">${INFO_SVG}</amble-button>
										<amble-button @click=${this.toggleAnswer} class="amble-quiz-answer-toggle" label="Toggle the answer" title="Answer">${SHOW_MORE_SVG}</amble-button>
										<amble-button @click=${this.backQuestion} class="amble-quiz-prev" label="Previous self-assessment item" title="Previous">${ARROW_LEFT_SVG}</amble-button>
										<div class="amble-quiz-progress amble-progress">
											<nobr>${index + 1 + '/' + this.questionChildren.length}</nobr>
										</div>
										<amble-button @click=${this.forwardQuestion} class="amble-quiz-next" label="Next self-assessment item" title="Next">${ARROW_RIGHT_SVG}</amble-button>
									</div>
									<div class="amble-quiz-answer">
										<span class="amble-qa-label">A:</span>
										<span class="text-with-code">${unsafeHTML(q.answerEl?.innerHTML)}</span>
										<amble-button @click=${this.toggleRationale} class="amble-quiz-rationale-toggle" label="Toggle the rationale" title="Rationale">${SHOW_MORE_SVG}</amble-button>
									</div>
									<div class="amble-quiz-rationale">
										<span class="amble-qa-label">Rationale:</span>
										<span class="text-with-code">${unsafeHTML(q.rationaleEl?.innerHTML)}</span>
									</div>
								</div>
							`,
						)}
					</div>
				</footer>
			</div>
		`;
	}

	public setCurrentQuestion(index: number): void {
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
			if (previousQuizMode !== QUIZ_MODE_Q) {
				this.quizMode = QUIZ_MODE_Q;
				this.changed('quizMode', previousQuizMode);
			}
		}
		this.changed('currentHasLinks', previousIn);
		this.rehighlight();
	}

	public setCurrentStep(index: number): void {
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

	public setFooterMode(mode: typeof FOOTER_MODE_STEP | typeof FOOTER_MODE_QUIZ | typeof FOOTER_MODE_NONE): void {
		const oldMode = this.footerMode;
		if (oldMode !== mode) {
			this.footerMode = mode;
			this.changed('footerMode', oldMode);
		}
	}

	public setLayout(layout: BodyLayout): void {
		const previousLayout = this.bodyLayout;
		const previousVisibleCount = CODE_COUNT_BY_LAYOUT[previousLayout];
		this.bodyLayout = layout;
		this.visibleCodeCount = CODE_COUNT_BY_LAYOUT[layout];
		this.changed('bodyLayout', previousLayout);
		if (this.visibleCodeCount < previousVisibleCount) {
			for (let i = this.visibleCodeCount; i < previousVisibleCount; i++) {
				const el = this.visibleCode[i];
				el.classList.remove(`amble-code-pos-${i + 1}`);
				el.clearHighlighted();
			}
			this.visibleCode.splice(this.visibleCodeCount, previousVisibleCount - this.visibleCodeCount);
		} else if (this.visibleCodeCount > previousVisibleCount) {
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
				} else {
					c.classList.remove(pos);
				}
			}
			c.navControls = allowNav;
		});
		this.rehighlight();
	}

	public setQuizMode(mode: QuizMode): void {
		const previous = this.quizMode;
		if (previous !== mode) {
			this.quizMode = mode;
			this.changed('quizMode', previous);
		}
	}

	public toggleAnswer(): void {
		const previous = this.quizMode;
		this.quizMode = previous === QUIZ_MODE_Q ? QUIZ_MODE_A : QUIZ_MODE_Q;
		this.changed('quizMode', previous);
		this.rehighlight();
	}

	public toggleLayout(): void {
		let newLayout: BodyLayout;
		switch (this.bodyLayout) {
			case BODY_LAYOUT_1:
				newLayout = BODY_LAYOUT_2H;
				break;
			case BODY_LAYOUT_2H:
				newLayout = BODY_LAYOUT_2V;
				break;
			case BODY_LAYOUT_2V:
				newLayout = this.sources.length > 2 ? BODY_LAYOUT_4 : BODY_LAYOUT_1;
				break;
			case BODY_LAYOUT_4:
				newLayout = BODY_LAYOUT_1;
				break;
			case BODY_LAYOUT_REFS:
				newLayout = BODY_LAYOUT_2H;
		}
		this.setLayout(newLayout);
	}

	public toggleRationale(): void {
		const previous = this.quizMode;
		this.quizMode = previous === QUIZ_MODE_R ? QUIZ_MODE_A : QUIZ_MODE_R;
		this.changed('quizMode', previous);
		this.rehighlight();
	}

	public toggleReferences(): void {
		this.setLayout(this.bodyLayout === BODY_LAYOUT_REFS ? BODY_LAYOUT_2H : BODY_LAYOUT_REFS);
	}

	public toggleStepExtra(): void {
		const oldValue = this.stepExtraMode;
		if (this.stepExtraMode === STEP_EXTRA_MODE_EXTRA) {
			this.stepExtraMode = STEP_EXTRA_MODE_STEP;
		} else {
			this.stepExtraMode = STEP_EXTRA_MODE_EXTRA;
		}
		this.changed('stepExtraMode', oldValue);
	}
}
