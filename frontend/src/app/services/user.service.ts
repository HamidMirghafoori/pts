// user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { getApplications, updateApplication } from './api';
import { UserType } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private rootUrl = environment.SERVER_URL;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  getAllApplications(user: UserType | null): Observable<UserType[]> {
    const body = { token: user?.token };
    return this.http.post<any>(this.rootUrl + getApplications, body).pipe(
      map((users) => {
        console.log('getAllApplications ,users', users);
        return users.applications;
      }),
      catchError((error) => {
        console.log('getAllApplications error:', error.error);
        this.snackBar.open('Yor are not authenticated, login again', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.router.navigate(['']);
        return [];
      })
    );
  }

  updateBusinessApplication(
    id: string,
    applicationUpdate: string,
    token: string | undefined
  ): Observable<any> {
    const body = { id, applicationUpdate, token };
    return this.http.post<any>(this.rootUrl + updateApplication, body);
  }
}
