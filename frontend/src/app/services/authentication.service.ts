import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from '../components/signup/signup.component';
import { UserService } from './user.service';

export type ApplicationType = 'pending' | 'approved' | 'rejected' | 'NA';
export type StatusType = 'pending' | 'active';
export interface AppUserType {
  id: string;
  status: StatusType;
  role: Role;
  email: string;
  description: string;
  type: string;
  application: ApplicationType;
}

export type UserType = User & AppUserType;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    public auth: Auth,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

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
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.authSubject.next(true);
        this.userService
          .getUser(userCredential.user.uid)
          .subscribe((appUser) => {
            if (appUser) {
              this.userSubject.next({ ...userCredential.user, ...appUser });
              switch (appUser.role) {
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
            }
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        this.snackBar.open('Error: Username or Password mismatch', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
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
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // already signed in
        const user: User = userCredential.user;
        console.log(user);

        this.userService
          // business role by default is inactive
          .addUser(user.uid, {
            role,
            email,
            description,
            type,
            status,
            application,
          })
          .then(() => {
            this.router.navigate(['']);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        // const errorMessage = error.message;
        console.log(errorCode);
        if (errorCode === 'auth/email-already-in-use') {
          this.snackBar.open('Error: Account already exists', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        }
      });
  }

  logout() {
    this.authSubject.next(false);
    this.userSubject.next(null);
    this.router.navigate(['']);
  }

  // TODO: not working
  // resetPassword(email: string) {
  //   return sendPasswordResetEmail(this.auth, email);
  // }
}
