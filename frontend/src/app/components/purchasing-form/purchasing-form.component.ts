import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-purchasing-form',
  templateUrl: './purchasing-form.component.html',
  styleUrls: ['./purchasing-form.component.scss'],
})
export class PurchasingFormComponent implements OnInit {
  purchaseForm: FormGroup;
  private itemId: string = '';
  private userId: string = '';
  private userEmail: string = '';


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.purchaseForm = this.fb.group({
      dateOfBirth: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.itemId = params['itemID'];
      this.userId = params['userId'];
      this.userEmail = params['userEmail'];
    });
  }

  onSubmit() {
    if (this.purchaseForm.valid) {
      this.router.navigate(['payment-gateway'], {
        queryParams: {
          itemID: this.itemId,
          address: this.purchaseForm.get('address')?.value,
          userId: this.userId,
          userEmail: this.userEmail
        },
      });
    }
  }

  onBack() {
    this.router.navigate(['']);
  }
}
