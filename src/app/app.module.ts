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
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { CardComponent } from './components/card/card.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { SigninComponent } from './components/signin/signin.component';
import { MaterialModule } from './material/material.module';

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
    provideDatabase(() => getDatabase()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
