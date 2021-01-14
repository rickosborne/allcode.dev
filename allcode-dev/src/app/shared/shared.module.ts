import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {AmbleCodeComponent} from '../amble-code/amble-code.component';
import {AmbleQuestionComponent} from '../amble-question/amble-question.component';
import {AmbleStepComponent} from '../amble-step/amble-step.component';
import {AmbleComponent} from "../amble/amble.component";
import {IconButtonComponent} from '../icon-button/icon-button.component';
import {IconRadioComponent} from '../icon-radio/icon-radio.component';
import {LessonRefComponent} from '../lesson-ref/lesson-ref.component';
import {TextWithCodeComponent} from "../text-with-code/text-with-code.component";
import { SourceRefComponent } from '../source-ref/source-ref.component';
import { AmbleTextComponent } from '../amble-text/amble-text.component';


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
    SourceRefComponent,
    AmbleTextComponent,
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
    AmbleQuestionComponent,
    SourceRefComponent,
    AmbleTextComponent,
  ],
})
export class SharedModule {
}
