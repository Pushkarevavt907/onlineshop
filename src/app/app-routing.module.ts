import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './components/base/base.component';
import { BasketComponent } from './components/basket/basket.component';
import { ProductsDetailComponent } from './components/products-detail/products-detail.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductResolver } from './services/product.resolver';
import { LoginComponent } from './components/login/login.component';
import { RegComponent } from './components/reg/reg.component';
import { OrderComponent } from './components/order/order.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', component: BaseComponent},
  { path: 'products', component: ProductsComponent},
  { path: 'product/:id', component: ProductsDetailComponent, resolve: {data: ProductResolver}},
  { path: 'basket', component: BasketComponent},
  { path: 'reg', component: RegComponent},
  { path: 'order', component: OrderComponent},
  { path: "**", redirectTo: "", component: BaseComponent}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
