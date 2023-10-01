import { Component, OnInit } from '@angular/core';
import { ProductType, ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-shop-products',
  templateUrl: './shop-products.component.html',
  styleUrls: ['./shop-products.component.scss'],
})
export class ShopProductsComponent implements OnInit {
  products: ProductType[] = [];

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.shopService.getAllProducts().subscribe((products) => {
      this.products = products;
    });
  }
}
