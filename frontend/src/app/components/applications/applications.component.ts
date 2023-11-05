import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import {
  AuthenticationService,
  UserType,
} from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit, OnDestroy {
  applicationSub!: Subscription;
  userSub!: Subscription;
  approveSub!: Subscription;
  rejectSub!: Subscription;
  user!: UserType | null;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,

  ) {}
  inactiveUsers: UserType[] = [];
  step: number = 0;

  public setStep(val: number) {
    this.step = val;
  }

  public nextStep() {
    this.step++;
    if (this.step > this.inactiveUsers.length - 1) {
      this.step = 0;
    }
  }

  public prevStep() {
    this.step--;
  }

  public approve(index: number) {
    const data = this.inactiveUsers[index];
    this.approveSub = this.userService
      .updateBusinessApplication(data._id, 'approved', this.user?.token)
      .subscribe((data) => {
        this.inactiveUsers.splice(index, 1);
        this.snackBar.open('Business approved!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });
  }

  public reject(index: number) {
    const data = this.inactiveUsers[index];
    this.rejectSub = this.userService
      .updateBusinessApplication(data._id, 'rejected', this.user?.token)
      .subscribe((data) => {
        this.inactiveUsers.splice(index, 1);
        this.snackBar.open('Business Rejected!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });

      });
  }

  ngOnInit(): void {
    this.userSub = this.authService.authenticatedUser$.subscribe((user) => {
      this.user = user;
      this.applicationSub = this.userService
        .getAllApplications(user)
        .subscribe((users) => {
          this.inactiveUsers = users;
        });
    });
  }

  ngOnDestroy(): void {
    this.applicationSub ? this.applicationSub.unsubscribe() : undefined;
    this.userSub ? this.userSub.unsubscribe() : undefined;
  }
}
