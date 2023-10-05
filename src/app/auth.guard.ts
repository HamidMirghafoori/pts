import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of, switchMap, take } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';

@Injectable({
  providedIn: 'root',
})
class Permissions {
  constructor(
    private authService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {}

  isMatchOne(role: string, roles: string[]) {
    if (role === roles[0]) return true;
    if (roles.length > 1) {
      if (role === roles[1]) return true;
    }
    return false;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const roles = route.data['roles'] as string[];

    return this.authService.authenticatedUser$.pipe(
      take(1),
      switchMap((user) => {
        const id = user?.uid;
        if (!id) return of(false);
        if (user.role === 'business') {
          if (user.status === 'pending') {
            this.snackBar.open('Error: Business is not approved yet', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar'],
            });
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
        }
        return of(this.isMatchOne(user.role, roles));
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
