import {Component} from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {Observable} from "rxjs";
import {SessionService, Profile} from "./session.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public readonly user$: Observable<Profile | null>;

  constructor(
    private readonly session: SessionService,
    private readonly bottomSheet: MatBottomSheet,
  ) {
    this.user$ = session.getUser$();
  }

  public signInWithAnon(): void {
    this.session.signInWithAnon();
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

  public privacyPolicy(): void {
    this.bottomSheet.open(PrivacyPolicyComponent);
  }
}

@Component({
  selector: 'privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
  constructor(private readonly bottomSheetRef: MatBottomSheetRef<PrivacyPolicyComponent>) {
  }

  public openLink(event: MouseEvent) {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
