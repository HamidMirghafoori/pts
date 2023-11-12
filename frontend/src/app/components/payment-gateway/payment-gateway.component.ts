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
  public address: string = '';
  private userId: string = '';
  public userEmail: string = '';
  public paid: boolean  = false;
  public title: string = '';
  public price: string = '';

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
      this.address = params['address'];
      this.userId = params['userId'];
      this.userEmail = params['userEmail'];
      this.title = params['title'];
      this.price = params['price'];
    });
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      this.buyService
        .buyItem(
          this.itemId,
          this.address,
          this.userId,
          1,
          this.userEmail
        )
        .then((res) => {
          this.paid=true;
        });
    }
  }

  onBack() : void{
    this.router.navigate(['']);
  }
}
