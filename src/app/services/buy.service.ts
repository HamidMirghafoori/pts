import { Injectable } from '@angular/core';
import {
  AngularFireDatabase
} from '@angular/fire/compat/database';
import { Observable, of, switchMap } from 'rxjs';
import { AuthenticationService } from './authentication.service';

export interface SoldType {
  id: string;
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

  buyItem(itemId: string, address: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.authService.authenticatedUser$.subscribe((user) => {
        if (user) {
          const uid = user.uid;
          const ref = this.db.database.ref(`sold/${uid}`).push();
          const soldData: SoldType = {
            id: itemId,
            address: address,
            rate: -1,
          };
          ref
            .set(soldData)
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

  getSoldItem(uid: string): Observable<SoldType | null> {
    return this.db.object<SoldType>(`sold/${uid}`).valueChanges();
  }

  getAllSoldItems(): Observable<SoldType[] | [] | null> {
    return this.authService.authenticatedUser$.pipe(
      switchMap((user) => {
        if (!user) {
          return of([]);
        }
        return this.db.object<SoldType[]>(`sold/${user?.uid}`).valueChanges()
      })
    );
  }
}
