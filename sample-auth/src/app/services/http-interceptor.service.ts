import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { UserStatus, AuthService } from './auth.service';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const typeReq = req.clone({ setHeaders: { 'content-type': 'application/json' } });

    const handler = this.authService.checkUserStatus().pipe(
      mergeMap((user: UserStatus) => {
        if (user.Verified) {
          const authParams = this.authService.getParams();
          const authReq = typeReq.clone({ setHeaders: authParams });
          return next.handle(authReq);
        } else {
          return next.handle(typeReq);
        }
      })
    );

    return handler.pipe(
      catchError((error, _caught) => throwError(error))
    );
  }
}
