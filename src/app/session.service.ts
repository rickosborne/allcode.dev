import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import firebase from 'firebase/app';
import {Observable} from "rxjs";
import {fromPromise} from "rxjs/internal-compatibility";

export type SessionUser = firebase.User;

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private readonly fireAuth: AngularFireAuth
  ) {
  }

  public getUser$(): Observable<SessionUser | null> {
    return this.fireAuth.user;
  }

  public signInWithAnon(): Observable<SessionUser | null> {
    return fromPromise(this.fireAuth.signInAnonymously()
      .then(credential => credential.user)
        .then(user => {
          if (user != null) {
            user.displayName = 'Anonymous User';
          }
          return user;
        })
      );
  }

  public signInWithEmail(): Observable<SessionUser | null> {
    return fromPromise(this.fireAuth.signInWithPopup(new firebase.auth.EmailAuthProvider())
      .then(credential => credential.user));
  }

  public signInWithGitHub(): Observable<SessionUser | null> {
    return fromPromise(this.fireAuth.signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then(credential => credential.user));
  }

  public signInWithGoogle(): Observable<SessionUser | null> {
    return fromPromise(this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(credential => credential.user));
  }

  public signOut(): Observable<void> {
    return fromPromise(this.fireAuth.signOut());
  }
}
