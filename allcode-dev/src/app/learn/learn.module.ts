import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {LearnHomeComponent} from "../learn-home/learn-home.component";
import {WhatIsProgrammingComponent} from '../what-is-programming/what-is-programming.component';
import {LearnRoutingModule} from "./learn-routing.module";

@NgModule({
  imports: [
    CommonModule,
    LearnRoutingModule,
  ],
  declarations: [
    LearnHomeComponent,
    WhatIsProgrammingComponent,
  ],
})
export class LearnModule {
}
