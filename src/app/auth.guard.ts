// auth.guard.ts

import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root',
})
class Permissions {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private userService: UserService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const roles = route.data['roles'] as string[];

    return this.authService.isAuthenticated$.pipe(
      switchMap(() => this.authService.authenticatedUser$),
      switchMap((user) => {
        const id = user?.uid;
        if (!id) return of(false);

        return this.userService.getUser(id).pipe(
          map((userData) => userData?.role === roles[0]),
          catchError(() => of(false))
        );
      })
    );
  }
}

export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean => {
  const permissions = inject(Permissions);
  return permissions.canActivate(next, state);
};
