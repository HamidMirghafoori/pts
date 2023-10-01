import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchasing-form',
  templateUrl: './purchasing-form.component.html',
  styleUrls: ['./purchasing-form.component.scss']
})
export class PurchasingFormComponent {
  purchaseForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.purchaseForm = this.fb.group({
      dateOfBirth: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.purchaseForm.valid) {
      console.log(this.purchaseForm.value);
      // Handle your form submission logic here
    }
  }

  onBack(){
    this.router.navigateByUrl("")
  }

}
