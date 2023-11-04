import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { purchase, purchasesList } from './api';
import { AuthenticationService, UserType } from './authentication.service';
import { ProductType } from './products.service';

export interface SoldType {
  productId: string;
  address: string;
  rate?: number;
}

export interface RevenueType {
  customerId: string;
  customerEmail: string;
  itemId: string;
  itemName: string;
  shopId: string;
  shopEmail: string;
  price: string;
}
@Injectable({
  providedIn: 'root',
})
export class BuyService {
  user!: UserType | null;

  constructor(
    private authService: AuthenticationService,
    private http: HttpClient
  ) {
    this.authService.authenticatedUser$.subscribe((user) => (this.user = user));
  }

  private rootUrl = environment.SERVER_URL;

  buyItem(
    itemId: string, //productId
    address: string,
    userId: string,
    quantity: number = 1,
    userEmail: string
  ): Promise<string> {
    const body = {
      userId,
      productId: itemId,
      address,
      quantity,
      customerEmail: userEmail,
      token: this.user?.token,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http
        .post<any>(this.rootUrl + purchase, body, { headers: headers })
        .subscribe((response) => {
          console.log('SHOP....>', response);

          resolve(response.toString());
        });
    });
  }

  // getRevenueData(): Observable<RevenueType[] | []> {
  // return this.db
  //   .object<any>(`revenue`)
  //   .valueChanges()
  //   .pipe(
  //     map((data) => {
  //       if (data) {
  //         return Object.keys(data).map((key) => data[key]) as RevenueType[];
  //       } else {
  //         return [];
  //       }
  //     })
  //   );
  //}

  // getRevenueDataById(uid: string): Observable<RevenueType[] | []> {
  //   return this.db
  //     .object<any>(`revenue`)
  //     .valueChanges()
  //     .pipe(
  //       filter((data) => !!data),
  //       map((data) => {
  //         if (data) {
  //           return Object.keys(data)
  //             .filter((key) => data[key].shopId === uid)
  //             .map((key) => data[key]) as RevenueType[];
  //         } else {
  //           return [];
  //         }
  //       })
  //     );
  // }

  // getSoldItem(uid: string): Observable<SoldType | null> {
  //   return this.db.object<SoldType>(`sold/${uid}`).valueChanges();
  // }

  getCustomerBoughtItems(
    user: UserType | null
  ): Observable<ProductType[] | [] | null> {
    const body = { userId: user?._id, token: user?.token };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>(this.rootUrl + purchasesList, body, { headers: headers })
      .pipe(map((response) => response.products));

    // return this.authService.authenticatedUser$.pipe(
    //   switchMap((user) => {
    //     if (!user) {
    //       return of([]);
    //     }
    //     return this.db
    //       .object<any>(`sold/${user?.uid}`)
    //       .valueChanges()
    //       .pipe(
    //         map((data) => {
    //           if (data) {
    //             return Object.keys(data).map((key) => data[key]);
    //           } else {
    //             return [];
    //           }
    //         })
    //       );
    //   })
    // );
  }
}
