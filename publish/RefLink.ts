import {guardAll, guardArrayOf, guardProperty, guardStringNamed, guardUndefinedOr, NoisyGuard} from "./guards";

const TITLE_KEY = "title";

export interface HasTitle {
  [TITLE_KEY]: string;
}

export const hasTitle = guardStringNamed(TITLE_KEY);
const HREF_KEY = "href";

export interface HasHref {
  [HREF_KEY]: string;
}

export const hasHref = guardStringNamed(HREF_KEY);
export type LinkRef = HasTitle & HasHref;
export const isLinkRef: NoisyGuard<LinkRef> = guardAll(
  hasTitle,
  hasHref,
);

const REFS_KEY = "refs";

export interface HasRefs {
  [REFS_KEY]: LinkRef[];
}

export const hasRefs: NoisyGuard<HasRefs> = guardProperty(REFS_KEY, guardArrayOf(isLinkRef));
export const maybeHasRefs: NoisyGuard<Partial<HasRefs>> = guardProperty(REFS_KEY, guardUndefinedOr(guardArrayOf(isLinkRef)));
