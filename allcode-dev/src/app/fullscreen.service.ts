import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from "rxjs";
import {fromPromise} from "rxjs/internal-compatibility";
import {distinctUntilChanged, map, shareReplay, skipWhile, startWith, takeWhile} from "rxjs/operators";

export enum FullscreenState {
  normal = "normal",
  full = "full",
  working = "working",
}

@Injectable({
  providedIn: 'root'
})
export class FullscreenService {

  private currentElement: Element | undefined;
  private currentElement$ = new BehaviorSubject<Element | undefined>(undefined);
  private previousElement$ = new BehaviorSubject<Element | undefined>(undefined);
  private nextRequestId: number = 1;

  constructor() {
    document.addEventListener('fullscreenchange', () => {
      const previousElement = this.currentElement;
      this.currentElement = document.fullscreenElement == null ? undefined : document.fullscreenElement;
      // console.log('fullscreenchange', this.currentElement);
      this.previousElement$.next(previousElement);
      this.currentElement$.next(this.currentElement);
    });
  }

  public observeCurrentElement$(): Observable<Element | undefined> {
    return this.currentElement$.pipe(
      distinctUntilChanged(),
      shareReplay(1),
    );
  }

  relinquish(el: Element): Promise<FullscreenState> {
    // console.log('fullscreen relinquish');
    if (document.fullscreenElement === el) {
      return document.exitFullscreen()
        .then(() => FullscreenState.normal)
        .catch(() => FullscreenState.normal);
    } else {
      console.warn('Requesting element is not current element: ', el, document.fullscreenElement);
      return Promise.resolve(FullscreenState.normal);
    }
  }

  public request(el: Element, options?: FullscreenOptions): Observable<FullscreenState> {
    const requestId = this.nextRequestId++;
    // console.log('fullscreen request', el, options);
    return combineLatest([
      this.observeCurrentElement$().pipe(
        skipWhile(currentEl => currentEl == null || currentEl !== el),
      ),
      fromPromise(el.requestFullscreen().then(() => true).catch(err => {
        console.error('Could not go fullscreen', err, el);
        return false;
      })).pipe(startWith(undefined)),
    ]).pipe(
      map(([currentEl, requestResult]) => {
        // console.log(`request ${requestId} update`, currentEl, requestResult, el, result);
        return requestResult === undefined ? FullscreenState.working :
          currentEl === el ? FullscreenState.full :
            FullscreenState.normal;
      }),
      takeWhile(state => state !== FullscreenState.normal, true),
    );
  }
}
