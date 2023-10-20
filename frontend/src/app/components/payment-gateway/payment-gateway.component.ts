import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyService } from '../../services/buy.service';

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.scss'],
})
export class PaymentGatewayComponent implements OnInit {
  paymentForm: FormGroup;
  public months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );
  public years = Array.from({ length: 8 }, (_, i) => (i + 2023).toString());
  private itemId: string = '';
  private shopId: string = '';
  private itemName: string = '';
  private shopEmail: string = '';
  private address: string = '';
  private price: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private buyService: BuyService
  ) {
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

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.itemId = params['itemID'];
      this.shopId = params['shopId'];
      this.itemName = params['itemName'];
      this.shopEmail = params['shopEmail'];
      this.address = params['address'];
      this.price = params['price'];
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      this.buyService
        .buyItem(
          this.itemId,
          this.address,
          this.shopId,
          this.price,
          this.itemName,
          this.shopEmail
        )
        .then(() => {
          // display receipt

          // after receipt
          this.router.navigate(['']);
        });
    }
  }

  onBack() {
    this.router.navigate(['']);
  }
}
