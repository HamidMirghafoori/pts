import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AppUserType
} from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit {
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}
  inactiveUsers: AppUserType[] = [];
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
    this.userService.updateUser(this.inactiveUsers[index].id, data).then(() => {

      // this.authService
      //   .resetPassword(this.inactiveUsers[index].email)
      //   .then(() => {
      //   })
      //   .catch((err) => console.log(err));


      this.snackBar.open('Application approved', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });
  }

  public reject(index: number) {
    const data = this.inactiveUsers[index];
    data.status = 'active';
    data.role = 'customer';
    data.application = 'rejected';
    this.userService.updateUser(this.inactiveUsers[index].id, data).then(() => {
      this.snackBar.open('Application rejected', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });
  }

  ngOnInit(): void {
    this.userService.getAllApplications().subscribe((users) => {
      this.inactiveUsers = users;
    });
  }
}
