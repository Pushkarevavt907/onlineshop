import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/UI/footer/footer.component';
import { HeaderComponent } from './components/UI/header/header.component';
import { BasketComponent } from './components/basket/basket.component';
import { ProductsDetailComponent } from './components/products-detail/products-detail.component';
import { BaseComponent } from './components/base/base.component';
import { DialogBoxComponent } from './components/dialog-box/dialog-box.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ProductsComponent } from './components/products/products.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { LocalService } from './local.service';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { RegComponent } from './components/reg/reg.component';
import { MatDialogModule } from '@angular/material/dialog';
import { OrderComponent } from './components/order/order.component'

@NgModule({
  declarations: [
    
    AppComponent,
    FooterComponent,
    HeaderComponent,
    BasketComponent,
    ProductsDetailComponent,
    BaseComponent,
    DialogBoxComponent,
    ProductsComponent,
    LoginComponent,
    RegComponent,
    OrderComponent
  
    
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    HttpClientModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    MatGridListModule,
    MatSliderModule,
    MatTabsModule,
    CarouselModule,
    MatDialogModule,
    FormsModule

  ],
  providers: [LocalService],
  bootstrap: [AppComponent]
})
export class AppModule { 
 
}
