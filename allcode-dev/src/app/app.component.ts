import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {SessionService, Profile} from "./session.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'allcode-dev';
  public readonly user$: Observable<Profile | null>;

  constructor(
    private readonly session: SessionService
  ) {
    this.user$ = session.getUser$();
  }

  public signInWithAnon(): void {
    this.session.signInWithAnon();
  }

  public signInWithEmail(): void {
    this.session.signInWithEmail();
  }

  public signInWithGitHub(): void {
    this.session.signInWithGitHub();
  }

  public signInWithGoogle(): void {
    this.session.signInWithGoogle();
  }

  public signOut(): void {
    this.session.signOut();
  }
}
