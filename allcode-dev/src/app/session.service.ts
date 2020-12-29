import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/firestore";
import firebase from 'firebase/app';
import {Observable, of} from "rxjs";
import {fromPromise} from "rxjs/internal-compatibility";
import {switchMap} from "rxjs/operators";
import AuthProvider = firebase.auth.AuthProvider;

export interface Profile {
  displayName: string;
  uid: string;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private readonly fireAuth: AngularFireAuth,
    private readonly store: AngularFirestore,
  ) {
  }

  public getUser$(): Observable<Profile | null> {
    return this.profileForUser$(this.fireAuth.user);
  }

  public profileForUser$(user$: Observable<firebase.User | null>): Observable<Profile | null> {
    return user$.pipe(
      switchMap(user => {
        if (user == null) {
          return of(null);
        }
        const profileDocPath = `/profile/${user.uid}`;
        return this.store.doc<Profile>(profileDocPath).get().pipe(
          switchMap(snap => {
            const profile: Profile = {
              uid: String(user.uid),
              displayName: String(user.displayName || 'No Name'),
            };
            if (!snap.exists || snap.data() == null) {
              return fromPromise(this.store.doc(profileDocPath).set(profile).then(() => profile));
            } else {
              profile.displayName = snap.data()?.displayName || '(no name)';
            }
            return of(profile);
          }),
        );
      }),
    );
  }

  public signInWithAnon(): Observable<Profile | null> {
    return fromPromise(this.fireAuth.signInAnonymously()
      .then(credential => {
        if (credential == null || credential.user == null) {
          return null;
        }
        return {
          uid: credential.user.uid,
          displayName: 'Anonymous',
        };
      })
    );
  }

  public signInWithEmail(): Observable<Profile | null> {
    return this.signInWithPopup(new firebase.auth.EmailAuthProvider());
  }

  public signInWithGitHub(): Observable<Profile | null> {
    return this.signInWithPopup(new firebase.auth.GithubAuthProvider());
  }

  public signInWithGoogle(): Observable<Profile | null> {
    return this.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  public signInWithPopup(provider: AuthProvider): Observable<Profile | null> {
    return this.profileForUser$(fromPromise(this.fireAuth.signInWithPopup(provider)
      .then(credential => credential.user)
      .catch(authEx => {
        if (authEx != null && authEx.code != null && authEx.code === "auth/account-exists-with-different-credential") {
          console.log("This email address is in use by another sign-in type.  Your settings may get reset or duplicated.");
        } else {
          console.error(authEx);
        }
        return null;
      })
    ));
  }

  public signOut(): Observable<void> {
    return fromPromise(this.fireAuth.signOut());
  }
}
