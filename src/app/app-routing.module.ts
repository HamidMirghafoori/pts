import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ApplicationsComponent } from './components/applications/applications.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ShopProductsComponent } from './components/shop-products/shop-products.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { PurchasingFormComponent } from './purchasing-form/purchasing-form.component';
import { PaymentGatewayComponent } from './payment-gateway/payment-gateway.component';
import { ReviewFormComponent } from './review-form/review-form.component';
import { AdminReportComponent } from './admin-report/admin-report.component';

const routes: Routes = [
  { path: '', component: ProductsListComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'purchasing form', component: PurchasingFormComponent },
  { path: 'admin review', component: AdminReportComponent },
  { path: 'payment gateway', component: PaymentGatewayComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'Review', component: ReviewFormComponent },
  { path: 'dev', component: ShopProductsComponent },
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
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
