import { Component, OnInit } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private userService: UserService
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
    const email = this.registrationForm.value.email;
    const password = this.registrationForm.value.password;
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // already signed in
        const user: User = userCredential.user;
        console.log(user);

        this.userService
          .addUser(user.uid, { test: 'May I ?', compact: true })
          .then((user) => {
            console.log('User Data:', user);
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

  onFileSelected(event: any) {
    const files: File[] = event.target.files;
    this.registrationForm.get('files')?.setValue(files);

    // Display the selected filenames
    this.selectedFiles = Array.from(files);
  }
}
