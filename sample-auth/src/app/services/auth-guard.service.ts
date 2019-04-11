import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AuthService, UserStatus } from '@cores/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private firebaseAuth: AngularFireAuth, private authService: AuthService, private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    let nav = ['login', 'm'];
    if (this.authService.authenticated()) {
      return true;
    }

    return this.firebaseAuth.authState.pipe(
      map((user: User) => {
        if (user) {
          if (user.emailVerified) {
            return true;
          } else {
            this.authService.checkUserStatus().subscribe(
              (status: UserStatus) => {
                if (status.Deleted) {
                  nav = ['deleted'];
                } else if (status.Banned) {
                  nav = ['banHammer'];
                } else if (!status.Verified) {
                  nav = ['verify'];
                }
                return false;
              }
            );
          }
        } else {
          this.authService.redirectURL = state.url;
          return false;
        }
      }),
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigate(nav);
        }
      })
    );
  }
}
