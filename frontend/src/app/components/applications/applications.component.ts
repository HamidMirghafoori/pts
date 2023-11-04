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

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar
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
    data.status = 'active';
    data.application = 'approved';
    // this.userService.updateUser(this.inactiveUsers[index].id, data).then(() => {

    // this.authService
    //   .resetPassword(this.inactiveUsers[index].email)
    //   .then(() => {
    //   })
    //   .catch((err) => console.log(err));

    //   this.snackBar.open('Application approved', 'Close', {
    //     duration: 3000,
    //     horizontalPosition: 'center',
    //     verticalPosition: 'top',
    //   });
    // });
  }

  public reject(index: number) {
    const data = this.inactiveUsers[index];
    data.status = 'active';
    data.role = 'customer';
    data.application = 'rejected';
    // this.userService.updateUser(this.inactiveUsers[index].id, data).then(() => {
    //   this.snackBar.open('Application rejected', 'Close', {
    //     duration: 3000,
    //     horizontalPosition: 'center',
    //     verticalPosition: 'top',
    //   });
    // });
  }

  ngOnInit(): void {
    this.userSub = this.authService.authenticatedUser$.subscribe((user) => {
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
