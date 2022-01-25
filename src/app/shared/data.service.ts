import { Injectable } from '@angular/core';
import { webSocket } from "rxjs/webSocket";
import { Observable, timer, Subject, EMPTY } from 'rxjs';
import { retryWhen, tap, delayWhen, switchAll, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export const WS_ENDPOINT = environment.wsEndpoint;
export const RECONNECT_INTERVAL = environment.reconnectInterval;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private socket$;
  private messagesSubject$ = new Subject();
  public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }))

  constructor() {

  }
  public connect(cfg: { reconnect: boolean } = { reconnect: false }): void {

    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewSocket();


      const messages = this.socket$.pipe(cfg.reconnect ? this.reconnect : (o: any) => o,
        tap({
          error: error => console.log(error),
        }), catchError(_ => EMPTY))

      this.messagesSubject$.next(messages)
    }

  }

  private reconnect(observable: Observable<any>): Observable<any> {
    return observable.pipe(retryWhen(errors => errors.pipe(tap(val => console.log('[Data Service] Try to reconnect', val)),
      delayWhen(_ => timer(RECONNECT_INTERVAL)))));
  }

  close() {
    this.socket$.complete();
    this.socket$ = undefined;
  }

  sendMessage(msg: any) {
    this.socket$.next(msg)
  }

  private getNewSocket() {
    return webSocket({
      url: WS_ENDPOINT,
      openObserver: {
        next: () => {
          console.log('[DataService]: connect ok')
        }
      },
      deserializer: (e) => e,
      closeObserver: {
        next: () => {
          console.log('[DataService]: connection closed'),
            this.socket$ = undefined;
          this.connect({ reconnect: true })

        }
      }
    })
  }

}
