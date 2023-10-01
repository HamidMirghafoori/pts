import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { Observable, map, of } from 'rxjs';
import { AuthenticationService } from './authentication.service';

export interface ProductType {
  id: string;
  ownerId: string;
}

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private productsRef!: AngularFireList<ProductType>;

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthenticationService
  ) {
    this.productsRef = db.list('products');
  }

  addProduct(uid: string, productData: any): Promise<void> {
    return this.db.object(`products/${uid}`).set(productData);
  }

  getProduct(uid: string): Observable<ProductType | null> {
    return this.db.object<ProductType>(`products/${uid}`).valueChanges();
  }

  updateProduct(uid: string, newData: ProductType): Promise<void> {
    return this.db.object(`products/${uid}`).update(newData);
  }

  deleteProduct(uid: string): Promise<void> {
    return this.db.object(`products/${uid}`).remove();
  }

  getAllProducts(): Observable<ProductType[] | []> {
    this.authService.authenticatedUser$.subscribe((user) => {
      return this.productsRef.snapshotChanges().pipe(
        map((products) => {
          return products
            .filter((product) => product.payload.val()?.ownerId === user?.id)
            .map((c) => ({
              ...(c.payload.val() as ProductType),
              id: c.key ?? '',
            }));
        })
      );
    });
    return of([]);
  }
}
