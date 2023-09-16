import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, products } from '../model/products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private products:Product[] = products;

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }
}
