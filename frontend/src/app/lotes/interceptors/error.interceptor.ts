import { Injectable, NgZone } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpStateService } from '../store/http-state.service';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly httpState: HttpStateService,
    private readonly ngZone: NgZone
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.ngZone.run(() => this.httpState.clearError());

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.ngZone.run(() => this.httpState.reportError());
        return throwError(() => error);
      })
    );
  }
}
