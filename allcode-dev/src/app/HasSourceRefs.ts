import {QueryList} from "@angular/core";
import {SourceRefComponent} from "./source-ref/source-ref.component";

export interface HasSourceRefs {
  sourceRefs: QueryList<SourceRefComponent>;
}
