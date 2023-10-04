import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { AuthenticationService } from './authentication.service';

export interface PackageType {
  id: string;
  address: string;
  rate?: number;
}

@Injectable({
  providedIn: 'root',
})
export class BuyService {
  private productsRef!: AngularFireList<PackageType>;

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthenticationService
  ) {
    this.productsRef = db.list('sold');
  }

  buyPackage(itemId: string, address: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authService.authenticatedUser$.subscribe((user) => {
        if (user) {
          const uid = user.uid;
          const ref = this.db.database.ref(`sold/${uid}`).push();
          const productData: PackageType = {
            id: itemId,
            address: address,
            rate: -1,
          };
          ref
            .set(productData)
            .then(() => {
              resolve(ref.key as string);
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    });
  }

  getProduct(uid: string): Observable<PackageType | null> {
    return this.db.object<PackageType>(`sold/${uid}`).valueChanges();
  }

  getAllProducts(): Observable<PackageType[] | []> {
    return this.authService.authenticatedUser$.pipe(
      switchMap((user) => {
        return this.productsRef.snapshotChanges().pipe(
          map((products) => {
            return products
              .filter((product) => {
                return product.payload.val() // ?.buyerId === user?.id;
              })
              .map((c) => ({
                ...(c.payload.val() as PackageType),
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
