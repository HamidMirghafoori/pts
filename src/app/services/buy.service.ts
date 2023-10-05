import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, map, of, switchMap, take } from 'rxjs';
import { AuthenticationService } from './authentication.service';

export interface SoldType {
  productId: string;
  address: string;
  rate?: number;
}

@Injectable({
  providedIn: 'root',
})
export class BuyService {
  constructor(
    private db: AngularFireDatabase,
    private authService: AuthenticationService
  ) {}
  
  buyItem(
    itemId: string,
    address: string,
    shopId: string,
    price: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authService.authenticatedUser$
      .pipe(take(1))    
      .subscribe((user) => {
        if (user) {
          const uid = user.uid;          
          const ref = this.db.database.ref(`sold/${uid}`).push();
          const soldData: SoldType = {
            productId: itemId,
            address: address,
            rate: -1,
          };
          ref
            .set(soldData)
            .then(() => {
              const data = {
                customerId: uid,
                itemId: itemId,
                price: price,
                shopId: shopId,
              };
              this.db
                .list('revenue')
                .push(data)
                .then(() => {
                  resolve(ref.key as string);
                });
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    });
  }

  getSoldItem(uid: string): Observable<SoldType | null> {
    return this.db.object<SoldType>(`sold/${uid}`).valueChanges();
  }

  getAllSoldItems(): Observable<SoldType[] | [] | null> {
    return this.authService.authenticatedUser$.pipe(
      switchMap((user) => {
        if (!user) {
          return of([]);
        }
        return this.db
          .object<any>(`sold/${user?.uid}`)
          .valueChanges()
          .pipe(
            map((data) => {
              if (data) {
                return Object.keys(data).map((key) => data[key]);
              } else {
                return [];
              }
            })
          );
      })
    );
  }
}
