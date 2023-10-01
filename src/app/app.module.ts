import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { ApplicationsComponent } from './components/applications/applications.component';
import { CardComponent } from './components/card/card.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { MaterialModule } from './material/material.module';
import { ShopProductsComponent } from './components/shop-products/shop-products.component';
import { MatButtonModule } from '@angular/material/button';
import { PurchasingFormComponent } from './purchasing-form/purchasing-form.component';

import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PaymentGatewayComponent } from './payment-gateway/payment-gateway.component';


export const LOCAL_STORAGE_TOKEN_KEY = 'PTS_angular_material';

export function tokenGetter() {
  return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
}
@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    ProductsListComponent,
    CardComponent,
    SigninComponent,
    SignupComponent,
    ApplicationsComponent,
    ShopProductsComponent,
    PurchasingFormComponent,
    PaymentGatewayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
