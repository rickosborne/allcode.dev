import {guardAllOf, guardArrayOf, guardUndefinedOr, isString, NoisyGuard} from "./guards";
import {isLinkRef, LinkRef} from "./RefLink";

export interface LessonFrontMatter {
  description: string;
  forward?: LinkRef[];
  section?: LinkRef;
  slug: string;
  title: string;
}

export const isLessonFrontMatter: NoisyGuard<LessonFrontMatter> = guardAllOf({
  description: isString,
  forward: guardUndefinedOr(guardArrayOf(isLinkRef)),
  section: guardUndefinedOr(isLinkRef),
  slug: isString,
  title: isString,
});
