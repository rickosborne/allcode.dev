import {Component} from '@angular/core';
import {Meta, Title} from "@angular/platform-browser";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {distinctUntilChanged, filter, map} from "rxjs/operators";
import {Profile, SessionService} from "./session.service";

export const APP_TITLE = "allcode.dev";
export const APP_DESCRIPTION = "allcode.dev teaches programming concepts using multiple languages at once."

interface PageMeta {
  description: string;
  title: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly defaultDescription: string;
  public readonly description$ = new BehaviorSubject(APP_DESCRIPTION);
  public readonly pageTitle$ = new BehaviorSubject(APP_TITLE);
  public readonly user$: Observable<Profile | null>;

  constructor(
    private readonly session: SessionService,
    title: Title,
    activatedRoute: ActivatedRoute,
    router: Router,
    meta: Meta,
  ) {
    this.user$ = session.getUser$();
    this.pageTitle$
      .pipe(
        distinctUntilChanged(),
      )
      .subscribe(pageTitle => {
        const content = pageTitle === APP_TITLE ? APP_TITLE : (pageTitle + " | " + APP_TITLE);
        title.setTitle(content);
      });
    const descriptionTag = meta.getTag('data-metaDescription');
    if (descriptionTag == null) {
      const tag = meta.addTag({name: "description", content: APP_DESCRIPTION});
      tag?.setAttribute('data-metaDescription', 'metaDescription');
      this.defaultDescription = APP_DESCRIPTION;
    } else {
      this.defaultDescription = descriptionTag.content;
    }
    this.description$
      .pipe(
        distinctUntilChanged(),
      )
      .subscribe(description => {
        const content = description == null || description === '' ? this.defaultDescription : description;
        meta.updateTag({name: "description", content: content}, 'data-metaDescription');
      });
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        const pageMeta: PageMeta = {
          title: APP_TITLE,
          description: this.defaultDescription,
        };
        let child = activatedRoute;
        while (child.firstChild) {
          child = child.firstChild;
        }
        if (child.snapshot.data) {
          if (typeof child.snapshot.data.title === 'string') {
            pageMeta.title = child.snapshot.data.title;
            if (pageMeta.title === '') {
              pageMeta.title = APP_TITLE;
            }
          }
          if (typeof child.snapshot.data.description === 'string') {
            pageMeta.description = child.snapshot.data.description;
          }
        }
        return pageMeta;
      }),
    ).subscribe(pageMeta => {
      this.pageTitle$.next(pageMeta.title);
      this.description$.next(pageMeta.description);
    });
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
}
