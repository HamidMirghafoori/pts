import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthenticationService,
  UserType,
} from 'src/app/services/authentication.service';
import { ProductType } from 'src/app/services/products.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  preserveWhitespaces: true,
})
export class CardComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private readonly location: Location
  ) {}
  serverUrl = environment.SERVER_BASE;
  isLoggedIn = false;
  user!: UserType | null;
  showForm = false;
  isBusiness: boolean = false;
  canReview: boolean = false;

  @Input() onEdit!: (index: number) => void;
  @Input() onDelete!: (index: number) => void;
  @Input() index!: number;
  @Input() showReview: boolean = false;

  @Input() data: ProductType = {
    _id: '',
    ownerId: '',
    bgImg: '',
    category: '',
    destination: '-',
    title: 'unset',
    rate: 0,
    votes: 0,
    bookedCount: 0,
    tags: [''],
    price: 0,
    currency: 'US$',
    offers: [],
    shopEmail: '',
    purchaseId: '',
    createdAt: '',
    updatedAt: '',
  };

  onReviewClick() {
    console.log('card-> review:', this.data._id, this.data.purchaseId);

    this.router.navigate(['review'], {
      queryParams: {
        productId: this.data._id,
        purchaseId: this.data.purchaseId,
      },
    });
  }

  onPurchase() {
    this.user == null
      ? this.router.navigate(['signin'])
      : this.router.navigate(['purchasing-form'], {
          queryParams: {
            itemID: this.data._id,
            userId: this.user._id,
            userEmail: this.user.email,
          },
        });
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.authService.authenticatedUser$.subscribe((user) => (this.user = user));
    this.isBusiness = this.user?.role === 'business' ? true : false;
    if (this.user && this.user.role === 'customer') {
      this.canReview = true;
    } else {
      this.canReview = false;
    }
    if (this.location.path() === '/my-orders') {
      this.showReview = true;
    }

    console.log(this.serverUrl , this.data.bgImg);
  }
  
}
