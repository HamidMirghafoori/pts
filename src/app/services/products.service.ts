import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { products } from '../model/products';
import { ProductType } from './shop.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private products:ProductType[] = products;

  constructor() { }

  getProducts(): Observable<ProductType[]> {
    return of(this.products);
  }
}
