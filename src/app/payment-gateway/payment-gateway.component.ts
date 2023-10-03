import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.scss'],
})
export class PaymentGatewayComponent {
  paymentForm: FormGroup;
  public months = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];
  public years = ['2023', '2024', '2025', '2026', '2027'];
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
