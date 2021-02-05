export declare type ResolveLike<T> = (value: T | Promise<T>) => void;
export declare type RejectLike = (reason?: unknown) => void;
export interface ResolvablePromise<T> extends Promise<T> {
    didReject: boolean;
    didResolve: boolean;
    hasCompleted: boolean;
    reject: RejectLike;
    resolve: ResolveLike<T>;
}
export declare function resolvablePromise<T>(): ResolvablePromise<T>;
