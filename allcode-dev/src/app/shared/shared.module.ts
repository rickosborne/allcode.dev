import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {AmbleCodeComponent} from '../amble-code/amble-code.component';
import {AmbleQuestionComponent} from '../amble-question/amble-question.component';
import {AmbleStepComponent} from '../amble-step/amble-step.component';
import {AmbleComponent} from "../amble/amble.component";
import {LessonRefComponent} from '../lesson-ref/lesson-ref.component';
import {TextWithCodeComponent} from "../text-with-code/text-with-code.component";
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { IconRadioComponent } from '../icon-radio/icon-radio.component';


@NgModule({
  declarations: [
    AmbleComponent,
    AmbleCodeComponent,
    TextWithCodeComponent,
    AmbleStepComponent,
    LessonRefComponent,
    AmbleQuestionComponent,
    IconButtonComponent,
    IconRadioComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    RouterModule,
  ],
  exports: [
    AmbleComponent,
    AmbleCodeComponent,
    TextWithCodeComponent,
    AmbleStepComponent,
    LessonRefComponent,
    AmbleQuestionComponent,
  ],
})
export class SharedModule {
}
