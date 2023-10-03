import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { AuthenticationService } from './authentication.service';

export interface ProductType {
  id: string;
  ownerId: string;
  bgImg: string;
  category: string;
  destination: string;
  title: string;
  rate: number;
  votes: number;
  bookedCount: number;
  tags: string[];
  price: number;
  currency: string;
  offers: string[];
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

  addProduct(productData: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const ref = this.db.database.ref('products').push();
      this.authService.authenticatedUser$.subscribe((user) => {
        productData = { ...productData, ownerId: user?.id };
      });

      ref
        .set(productData)
        .then(() => {
          resolve(ref.key as string);
        })
        .catch((error) => {
          reject(error);
        });
    });
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
    return this.authService.authenticatedUser$.pipe(
      switchMap((user) => {
        return this.productsRef.snapshotChanges().pipe(
          map((products) => {
            return products
              .filter((product) => {
                return product.payload.val()?.ownerId === user?.id;
              })
              .map((c) => ({
                ...(c.payload.val() as ProductType),
                id: c.key ?? '',
              }));
          }),
          catchError((error) => {
            console.error('Error fetching data:', error);
            return of([]);
          })
        );
      })
    );
  }
}
