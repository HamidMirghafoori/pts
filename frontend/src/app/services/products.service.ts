import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { createProduct, getShopProducts } from './api';
import { UserType } from './authentication.service';

export interface ProductType {
  bgImg: string;
  category: string;
  createdAt: string;
  destination: string;
  offers: string[];
  ownerId: string;
  price: number;
  shopEmail: string;
  tags: string[];
  title: string;
  updatedAt: string;
  _id: string;
  rate: number;
  votes: number;
  purchaseId: string;
  bookedCount: number;
  currency: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private rootUrl = environment.SERVER_URL;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  addProduct(productData: any): Promise<string> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return new Promise((resolve, reject) => {
      this.http
        .post(this.rootUrl + createProduct, productData, { headers })
        .subscribe({
          next: (response) => {
            // console.log(response);
          },
          error: (error) => {
            this.snackBar.open(error.error.message, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar'],
            });
          },
        });
    });
  }

  getAllShopProducts(user: UserType | null): Observable<ProductType[] | []> {
    const body = { id: user?._id, token: user?.token };

    return this.http
      .post<any>(this.rootUrl + getShopProducts, body)
      .pipe(map((data) => data.products));
  }

  getAllProducts(user: UserType | null): Observable<ProductType[] | []> {
    const body = { token: user?.token };

    return this.http
      .post<any>(this.rootUrl, body)
      .pipe(map((response) => response.products));
  }
}
