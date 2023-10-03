import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ProductType, ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-shop-products',
  templateUrl: './shop-products.component.html',
  styleUrls: ['./shop-products.component.scss'],
})
export class ShopProductsComponent implements OnInit {
  @ViewChild('productPanel') productPanel!: MatExpansionPanel;

  products: ProductType[] = [];
  panelOpen = false;
  productForm!: FormGroup;
  allTags: string[] = ['Bestseller', 'Easy Refund'];
  allOffers: string[] = [
    'Exclusive Combo',
    'Best Price Guarantee',
    '9th Birthday',
    'Save 22%',
    'PTS Exclusive',
  ];

  constructor(
    private shopService: ShopService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      destination: ['', Validators.required],
      price: ['', Validators.required],
      tags: [''],
      offers: [''],
      image: [-1],
    });

    this.shopService.getAllProducts().subscribe((products) => {
      console.log(products);

      this.products = products;
    });
  }

  onSubmit() {
    const form = this.productForm.value;
    // console.log(form);
    this.shopService.addProduct(form).then((result) => {
      console.log('result', result);
      this.productPanel.close()
    });
  }
}
