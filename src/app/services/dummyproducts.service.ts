import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { products } from '../model/products';
import { ProductType } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class DummyProductsService {
  private products:ProductType[] = products;

  constructor() { }

  getProducts(): Observable<ProductType[]> {
    return of(this.products);
  }
}
