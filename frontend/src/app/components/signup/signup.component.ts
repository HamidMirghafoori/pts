import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ApplicationType,
  AuthenticationService,
  StatusType,
} from 'src/app/services/authentication.service';

export type Role = 'business' | 'customer' | 'admin' | 'officer';
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
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.registrationForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', [Validators.required, Validators.minLength(7)]],
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required],
        isBusiness: false,
        businessDescription: [''],
        businessType: [''],
        files: [[]],
        fileSubmission: [['']],
      },
      { validator: this.passwordMatchValidator }
    );

    this.registrationForm
      .get('isBusiness')
      ?.valueChanges.subscribe((isBusiness) => {
        const businessDescriptionControl = this.registrationForm.get(
          'businessDescription'
        );
        const fileController = this.registrationForm.get('fileSubmission');
        const businessTypeControl = this.registrationForm.get('businessType');

        if (isBusiness) {
          businessDescriptionControl?.setValidators([Validators.required]);
          fileController?.setValidators([Validators.required]);
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
    const mobile: string = this.registrationForm.value.mobile;
    const password: string = this.registrationForm.value.password;
    const isBusiness: boolean = this.registrationForm.value.isBusiness;
    const role: Role = isBusiness ? 'business' : 'customer';
    const application: ApplicationType = isBusiness ? 'pending' : 'NA';
    const description: string =
      this.registrationForm.value.businessDescription ?? '';
    const type: string = this.registrationForm.value.businessType ?? '';
    const status: StatusType = this.registrationForm.value.isBusiness
      ? 'pending'
      : 'active';
    this.authService.signup(
      email,
      mobile,
      password,
      role,
      description,
      type,
      status,
      application,
      isBusiness
    );
  }

  onFileSelected(event: any) {
    const files: File[] = event.target.files;
    this.registrationForm.get('files')?.setValue(files);

    // Display the selected filenames
    this.selectedFiles = Array.from(files);
  }
}
