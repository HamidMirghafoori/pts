import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { SigninComponent } from './components/signin/signin.component';

const routes: Routes = [
  {path: '', component: ProductsListComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SigninComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
