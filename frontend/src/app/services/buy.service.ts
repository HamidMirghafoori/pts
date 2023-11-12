import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ReportType } from '../components/admin-report/admin-report.component';
import { purchase, purchasesList, rateItem, shopReport } from './api';
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
  }

  rateBoughtItem(
    user: UserType | null,
    productId: string,
    purchaseId: string,
    rate: number
  ): string {
    const body = {
      userId: user?._id,
      purchaseId,
      productId,
      rate,
      token: user?.token,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log('calling.... ', this.rootUrl + rateItem);

    this.http
      .post<any>(this.rootUrl + rateItem, body, { headers: headers })
      .subscribe((res) => {
        console.log(res);
        return JSON.stringify(res);
      });

    return '';
  }


  getShopReport(
    user: UserType | null,
    fetchAll: boolean = false
  ): Observable<ReportType> {
    const body = {
      shopId: fetchAll ? undefined : user?._id,
      token: user?.token,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    // console.log('calling.... ', this.rootUrl + shopReport);

    return this.http
      .post<any>(this.rootUrl + shopReport, body, { headers: headers })
      .pipe(map((response) => response.shopReport as ReportType));
  }
}
