import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {AmbleCodeComponent} from '../amble-code/amble-code.component';
import {AmbleStepComponent} from '../amble-step/amble-step.component';
import {AmbleComponent} from "../amble/amble.component";
import {TextWithCodeComponent} from "../text-with-code/text-with-code.component";
import { LessonRefComponent } from '../lesson-ref/lesson-ref.component';


@NgModule({
  declarations: [
    AmbleComponent,
    AmbleCodeComponent,
    TextWithCodeComponent,
    AmbleStepComponent,
    LessonRefComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  exports: [
    AmbleComponent,
    AmbleCodeComponent,
    TextWithCodeComponent,
    AmbleStepComponent,
    LessonRefComponent,
  ],
})
export class SharedModule {
}
