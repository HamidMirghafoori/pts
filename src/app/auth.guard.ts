// auth.guard.ts

import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
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
    private authService: AuthenticationService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const roles = route.data['roles'] as string[];

    switch (roles[0]) {
      case 'admin':
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
      case 'customer':
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
      case 'business':
        return this.authService.isAuthenticated$.pipe(
          switchMap(() => this.authService.authenticatedUser$),
          switchMap((user) => {
            const id = user?.uid;
            if (!id) return of(false);
            if (user.status === 'pending') {
              this.snackBar.open(
                'Error: Business is not approved yet',
                'Close',
                {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  panelClass: ['error-snackbar'],
                }
              );
              return of(false);
            }
            if (user.application === 'rejected') {
              this.snackBar.open('Error: Business is Rejected!', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['error-snackbar'],
              });
              return of(false);
            }
            return this.userService.getUser(id).pipe(
              map((userData) => userData?.role === roles[0]),
              catchError(() => of(false))
            );
          })
        );
      case 'officer':
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
    return of(false);
  }
}

export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean => {
  const permissions = inject(Permissions);
  return permissions.canActivate(next, state);
};
