export type ResolveLike<T> = (value: T | Promise<T>) => void;
export type RejectLike = (reason?: unknown) => void;

export interface ResolvablePromise<T> extends Promise<T> {
	didReject: boolean;
	didResolve: boolean;
	hasCompleted: boolean;
	reject: RejectLike;
	resolve: ResolveLike<T>;
}

class ResolvablePromiseImpl<T> implements ResolvablePromise<T> {
	private _didReject = false;
	private _didResolve = false;
	// noinspection SpellCheckingInspection
	private _rejecter: RejectLike | undefined;
	private readonly _rejection: Array<unknown> = [];
	private readonly _resolution: Array<T | Promise<T>> = [];
	private _resolver: ResolveLike<T> | undefined;
	private _promise: Promise<T> = new Promise<T>((resolve, reject) => {
		this._resolver = resolve;
		this._rejecter = reject;
		if (!this.hasCompleted) {
			if (this._rejection.length) {
				this._didReject = true;
				reject(this._rejection[0]);
			} else if (this._resolution.length) {
				this._didResolve = true;
				resolve(this._resolution[0]);
			}
		}
	});

	public get [Symbol.toStringTag](): string {
		return this._promise[Symbol.toStringTag];
	}

	public get didReject(): boolean {
		return this._didReject;
	}

	public get didResolve(): boolean {
		return this._didResolve;
	}

	public get hasCompleted(): boolean {
		return this._didResolve || this._didReject;
	}

	catch<TResult = never>(onRejected?: ((reason: unknown) => PromiseLike<TResult> | TResult) | undefined | null): Promise<T | TResult> {
		return this._promise.catch(onRejected);
	}

	finally(onFinally?: (() => void) | undefined | null): Promise<T> {
		return this._promise.finally(onFinally);
	}

	public reject(reason: unknown): void {
		if (!this.hasCompleted) {
			if (this._rejecter == null) {
				this._rejection.push(reason);
			} else {
				this._didReject = true;
				this._rejecter(reason);
			}
		}
	}

	public resolve(value: Promise<T> | T): void {
		if (!this.hasCompleted) {
			if (this._resolver == null) {
				this._resolution.push(value);
			} else {
				this._didResolve = true;
				this._resolver(value);
			}
		}
	}

	then<TResult1 = T, TResult2 = never>(
		onFulfilled?: ((value: T) => PromiseLike<TResult1> | TResult1) | undefined | null,
		onRejected?: ((reason: unknown) => PromiseLike<TResult2> | TResult2) | undefined | null
	): Promise<TResult1 | TResult2> {
		return this._promise.then(onFulfilled, onRejected);
	}
}

export function resolvablePromise<T>(): ResolvablePromise<T> {
	return new ResolvablePromiseImpl();
}
