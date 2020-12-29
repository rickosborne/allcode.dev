import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LearnHomeComponent} from "../learn-home/learn-home.component";
import {WhatIsProgrammingComponent} from "../what-is-programming/what-is-programming.component";

const routes: Routes = [
  {
    path: 'what-is-programming',
    component: WhatIsProgrammingComponent,
  },
  {
    path: '',
    component: LearnHomeComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LearnRoutingModule {
}
