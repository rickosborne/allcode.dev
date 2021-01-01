import {QueryList} from "@angular/core";
import {LessonRefComponent} from "./lesson-ref/lesson-ref.component";

export interface HasLessonRefs {
  lessonRefs: QueryList<LessonRefComponent>;
}
