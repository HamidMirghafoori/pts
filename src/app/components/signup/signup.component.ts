import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  registrationForm!: FormGroup;
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public auth: Auth,
    private userService: UserService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.registrationForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required],
        isBusiness: [false],
        businessDescription: [''],
        businessType: [''],
        files: [[]],
      },
      { validator: this.passwordMatchValidator }
    );

    this.registrationForm
      .get('isBusiness')
      ?.valueChanges.subscribe((isBusiness) => {
        const businessDescriptionControl = this.registrationForm.get(
          'businessDescription'
        );
        const businessTypeControl = this.registrationForm.get('businessType');

        if (isBusiness) {
          businessDescriptionControl?.setValidators([Validators.required]);
          businessTypeControl?.setValidators([Validators.required]);
        } else {
          businessDescriptionControl?.clearValidators();
          businessTypeControl?.clearValidators();
        }

        businessDescriptionControl?.updateValueAndValidity();
        businessTypeControl?.updateValueAndValidity();
      });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('repeatPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit() {
    const email: string = this.registrationForm.value.email;
    const password: string = this.registrationForm.value.password;
    const role: string = this.registrationForm.value.isBusiness
      ? 'business'
      : 'buyer';
    this.authService.signup(email, password, role);
  }

  onFileSelected(event: any) {
    const files: File[] = event.target.files;
    this.registrationForm.get('files')?.setValue(files);

    // Display the selected filenames
    this.selectedFiles = Array.from(files);
  }
}
