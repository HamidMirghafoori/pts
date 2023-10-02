import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.scss'],
})
export class PaymentGatewayComponent {
  paymentForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.paymentForm = this.fb.group({
      cardHolderName: ['', Validators.required],
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
        ],
      ],
      expiryMonth: ['', Validators.required],
      expiryYear: ['', Validators.required],
      cvv: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(4)],
      ],
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      console.log(this.paymentForm.value);
      // Handle your form submission logic here
      this.router.navigateByUrl('');
    }
  }

  onBack() {
    this.router.navigateByUrl('');
  }
}
