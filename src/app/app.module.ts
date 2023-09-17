import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CardComponent } from './components/card/card.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { SigninComponent } from './components/signin/signin.component';
import { MaterialModule } from './material/material.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';

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
    // AuthModule.forRoot({
    //   domain: 'pts.uk.auth0.com',
    //   clientId: '08fi20erz8VgBvW11KT0aOpZ6GO3nY4h',
    //   authorizationParams: {
    //     redirect_uri: window.location.origin,
    //   },
    // }),
    // AuthModule.forRoot({
    //   ...env.auth,
    // }),
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: tokenGetter,
    //     allowedDomains: ['localhost:3000', 'localhost:8080'],
    //   },
    // }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
