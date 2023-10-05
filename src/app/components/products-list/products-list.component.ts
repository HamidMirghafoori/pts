import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BuyService } from 'src/app/services/buy.service';
import { ProductsService } from 'src/app/services/products.service';
import { ProductType } from 'src/app/services/shop.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  public products: ProductType[] = [];

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private buyService: BuyService
  ) {}

  ngOnInit(): void {
    const roles = this.route.snapshot.data['roles'];
    console.log('Roles:', roles);

    if (roles && roles.includes('customer')) {
      // Do something for customer role
      this.buyService.getAllSoldItems().subscribe((soldItems)=>{
        console.log(soldItems);
      })
    } else {
      this.productsService
        .getProducts()
        .subscribe((products) => (this.products = products));
    }
  }
}
