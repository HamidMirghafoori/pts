import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BuyService } from 'src/app/services/buy.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss'],
})
export class ReviewFormComponent implements OnInit, OnDestroy {
  reviewForm: FormGroup;
  rating: number = 0; // to manage star rating
  productId: string = '';
  purchaseId: string = '';
  private authSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private buyService: BuyService,
    private authService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    this.reviewForm = this.fb.group({
      comments: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.productId = params['productId'];
      this.purchaseId = params['purchaseId'];
    });
    console.log('Review:', this.productId, this.purchaseId);
    
  }

  setRating(value: number) {
    this.rating = value;
  }

  onSubmit() {
    if (this.reviewForm.valid && this.rating > 0) {
      this.authSub= this.authService.authenticatedUser$.subscribe((user) => {
        console.log({
          rating: this.rating,
          comments: this.reviewForm.value.comments,
        });
        this.buyService.rateBoughtItem(
          user,
          this.productId,
          this.purchaseId,
          this.rating
        );
      });
      this.router.navigate(['']);
    }
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
