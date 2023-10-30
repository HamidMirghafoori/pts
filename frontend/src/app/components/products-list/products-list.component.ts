import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AuthenticationService
} from 'src/app/services/authentication.service';
import { BuyService } from 'src/app/services/buy.service';
import { ProductService, ProductType } from 'src/app/services/products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  public products: ProductType[] = [];
  userId!: string;

  constructor(
    private route: ActivatedRoute,
    private buyService: BuyService,
    private productService: ProductService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    const roles = this.route.snapshot.data['roles'];
    this.authService.authenticatedUser$.subscribe((user) => {
      this.userId = user ? user._id : '';
    });
    if (roles && roles.includes('customer')) {
      this.buyService
        .getCustomerBoughtItems(this.userId)
        .subscribe((boughtItems) => {
          if (!boughtItems) {
            return;
          }
          this.products = boughtItems;
        });
    } else {
      this.productService
        .getAllProducts()
        .subscribe((products) => (this.products = products));
    }
  }
}
