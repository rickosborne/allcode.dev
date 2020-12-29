import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";

const routes: Routes = [
  {
    path: 'learn',
    loadChildren: () => import('./learn/learn.module').then(m => m.LearnModule),
    data: {
      title: 'Learn',
      description: 'Table of contents for all lessons on allcode.dev.',
    }
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    data: {
      title: 'Privacy Policy',
      description: 'allcode.dev does not want your personal information.'
    }
  },
  {
    path: '',
    component: HomeComponent,
    data: {
      title: ''
    },
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: {
      title: 'Not Found',
      description: 'This page requested from allcode.dev does not exist.'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
