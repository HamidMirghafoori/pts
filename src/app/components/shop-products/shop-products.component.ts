import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductType, ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-shop-products',
  templateUrl: './shop-products.component.html',
  styleUrls: ['./shop-products.component.scss'],
})
export class ShopProductsComponent implements OnInit {
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

  constructor(private shopService: ShopService, private fb: FormBuilder) {}

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
      this.products = products;
    });
  }


  // export interface Product {
  //   title: string;
  //   category: Categories;
  //   destination: string;
  //   price: number;
  //   tags: Tags[];
  //   offers: Offers[];
  //   bgImg: string;
  //   currency: Currencies;
  //   rate: number;
  //   votes: number;
  //   bookedCount: number;
  // }
  onSubmit() {
    const form = this.productForm.value;
    console.log(form);
    
  }
}
