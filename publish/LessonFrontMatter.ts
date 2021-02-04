import {guardAllOf, guardArrayOf, guardUndefinedOr, isString, NoisyGuard} from "./guards";
import {isLinkRef, LinkRef} from "./RefLink";

export interface LessonFrontMatter {
  description: string;
  forward?: LinkRef[];
  slug: string;
  title: string;
}

export const isLessonFrontMatter: NoisyGuard<LessonFrontMatter> = guardAllOf({
  description: isString,
  forward: guardUndefinedOr(guardArrayOf(isLinkRef)),
  slug: isString,
  title: isString,
});
