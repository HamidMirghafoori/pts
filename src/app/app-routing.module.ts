import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AdminReportComponent } from './components/admin-report/admin-report.component';
import { ApplicationsComponent } from './components/applications/applications.component';
import { PaymentGatewayComponent } from './components/payment-gateway/payment-gateway.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { PurchasingFormComponent } from './components/purchasing-form/purchasing-form.component';
import { ReviewFormComponent } from './components/review-form/review-form.component';
import { ShopProductsComponent } from './components/shop-products/shop-products.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  { path: '', component: ProductsListComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'purchasing-form', component: PurchasingFormComponent },
  { path: 'payment-gateway', component: PaymentGatewayComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'Review', component: ReviewFormComponent },
  { path: 'dev', component: ShopProductsComponent },
  {
    path: 'my-orders',
    component: ProductsListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['customer'] },
  },
  {
    path: 'applications',
    component: ApplicationsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'shop',
    component: ShopProductsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['business'] },
  },
  {
    path: 'reports',
    component: AdminReportComponent,
    canActivate: [AuthGuard],
    data: { roles: ['officer', 'business'] },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
