import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LearnHomeComponent} from "../learn-home/learn-home.component";
import {LoopBasicsComponent} from "../loop-basics/loop-basics.component";
import {WhatIsProgrammingComponent} from "../what-is-programming/what-is-programming.component";

const routes: Routes = [
  {
    path: 'what-is-programming',
    component: WhatIsProgrammingComponent,
    data: {
      title: "What is programming?"
    }
  },
  {
    path: 'loop-basics',
    component: LoopBasicsComponent,
    data: {
      title: "Loop Basics",
      description: "Learn about the fundamental building blocks of programming loops in code, by comparing loop structures in multiple languages."
    }
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
