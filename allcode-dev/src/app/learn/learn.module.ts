import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {LearnHomeComponent} from "../learn-home/learn-home.component";
import {LoopBasicsComponent} from '../loop-basics/loop-basics.component';
import {SharedModule} from "../shared/shared.module";
import {WhatIsProgrammingComponent} from '../what-is-programming/what-is-programming.component';
import {LearnRoutingModule} from "./learn-routing.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LearnRoutingModule,
  ],
  declarations: [
    LearnHomeComponent,
    WhatIsProgrammingComponent,
    LoopBasicsComponent,
  ],
})
export class LearnModule {
}
