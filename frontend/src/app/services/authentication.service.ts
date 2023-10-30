import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Role } from '../components/signup/signup.component';
import { signin } from './api';
import { UserService } from './user.service';

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
    private userService: UserService,
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
          console.log(response);
          this.authSubject.next(true);
          this.userSubject.next({ ...response.user });
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
    password: string,
    role: string,
    description: string,
    type: string,
    status: string,
    application: ApplicationType
  ) {
    // createUserWithEmailAndPassword(this.auth, email, password)
    //   .then((userCredential) => {
    //     // already signed in
    //     const user: User = userCredential.user;
    //     console.log(user);
    //     this.userService
    //       // business role by default is inactive
    //       .addUser(user.uid, {
    //         role,
    //         email,
    //         description,
    //         type,
    //         status,
    //         application,
    //       })
    //       .then(() => {
    //         this.router.navigate(['']);
    //       });
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     // const errorMessage = error.message;
    //     console.log(errorCode);
    //     if (errorCode === 'auth/email-already-in-use') {
    //       this.snackBar.open('Error: Account already exists', 'Close', {
    //         duration: 3000,
    //         horizontalPosition: 'center',
    //         verticalPosition: 'top',
    //         panelClass: ['error-snackbar'],
    //       });
    //     }
    //   });
  }

  logout() {
    this.authSubject.next(false);
    this.userSubject.next(null);
    this.router.navigate(['']);
  }
}
