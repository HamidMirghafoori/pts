import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cardsImg } from 'src/app/model/images';
import { BuyService } from 'src/app/services/buy.service';
import { ProductService, ProductType } from 'src/app/services/products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  public products: ProductType[] = [];

  constructor(
    private route: ActivatedRoute,
    private buyService: BuyService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const roles = this.route.snapshot.data['roles'];
    if (roles && roles.includes('customer')) {
      this.buyService.getAllSoldItems().subscribe((soldItems) => {
        if (!soldItems){
          return
        }
        const ids = soldItems?.map(item => item.productId)
        this.productService.getProductsByIds(ids).subscribe(products =>{
          this.products = products
        })
      });
    } else {
      this.productService.getAllProducts().subscribe((products) => {
        const updated = products.map((product, index) => {
          return {
            ...product,
            bgImg: cardsImg[index % 7],
            offers: Array.isArray(product.offers)? product.offers :[product.offers],
            tags: Array.isArray(product.tags)? product.tags :[product.tags]
          };
        });
        this.products = updated;
      });
    }
  }
}
