export declare type CachingHighlighter = (code: string, language: string) => Promise<string>;
export declare const OP_NAMES: Record<string, string>;
export declare const COUNTED_CLASS_NAMES: string[];
export declare function cachingHighlighter(): CachingHighlighter;
