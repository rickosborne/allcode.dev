import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";

const routes: Routes = [
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
    }
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
