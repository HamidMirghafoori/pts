import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Role } from '../components/signup/signup.component';
import { signin, signup } from './api';

export type ApplicationType = 'pending' | 'approved' | 'rejected' | 'NA';
export type StatusType = 'pending' | 'active';
export interface UserType {
  createdAt: string;
  email: string;
  password: string;
  role: Role;
  status: StatusType;
  updatedAt: string;
  _id: string;
  description: string;
  type: string;
  application: ApplicationType;
  token: string;
}

interface UserResponse extends UserType {
  success: boolean;
  token: string;
  user: UserType;
}
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}
  private rootUrl = environment.SERVER_URL;
  private authSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public isAuthenticated$: Observable<boolean> =
    this.authSubject.asObservable();

  private userSubject: BehaviorSubject<UserType | null> =
    new BehaviorSubject<UserType | null>(null);
  public authenticatedUser$: Observable<UserType | null> =
    this.userSubject.asObservable();

  login(email: string, password: string): void {
    this.http
      .post<UserResponse>(this.rootUrl + signin, { email, password })
      .subscribe({
        next: (response) => {
          this.authSubject.next(true);
          this.userSubject.next({ ...response.user, token: response.token });
          switch (response.user.role) {
            case 'business':
              this.router.navigate(['shop']);
              break;
            case 'admin':
              this.router.navigate(['applications']);
              break;
            case 'officer':
              this.router.navigate(['reports']);
              break;
            default:
              this.router.navigate(['']);
          }
        },
        error: (error) => {
          console.log(error.error);
          this.snackBar.open(error.error, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  signup(
    email: string,
    mobile: string,
    password: string,
    role: string,
    description: string,
    type: string,
    status: string,
    application: ApplicationType,
    isBusiness: boolean
  ): void {
    const body = {
      email,
      mobile,
      password,
      role,
      businessDescription: description,
      type,
      status,
      application,
      isBusiness
    };
    this.http.post<UserResponse>(this.rootUrl + signup, body).subscribe({
      next: (response) => {
        console.log(response);
        this.snackBar.open('User created successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.router.navigate(['signin']);
      },
      error: (error) => {
        console.log(error.error);
        this.snackBar.open(error.error, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  logout() {
    this.authSubject.next(false);
    this.userSubject.next(null);
    this.router.navigate(['']);
  }
}
