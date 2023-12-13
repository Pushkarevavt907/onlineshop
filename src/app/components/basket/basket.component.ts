import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IProducts, IProductsProdinfo } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/product.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit, OnDestroy {
  basketData: any[];
  price1: number;
  
  basketSubscription: Subscription;
  log: string = 'ivan16072001@mail.ru';
  email1 = this.authService.getEmail();
  canEdit: boolean = false;
  emailForm: FormGroup;
  baseUrl:string ='http://localhost:4030'
  constructor(private productsService: ProductsService, private http: HttpClient, private authService: AuthService, private formBuilder: FormBuilder,private dialog: MatDialog) {
    this.emailForm = this.formBuilder.group({
      email1: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.email1 = this.authService.getEmail();
    if (this.canEdit = this.authService.isManager) {
      this.canEdit = this.authService.isManager;
      this.basketSubscription = this.productsService.GetBask().subscribe(data => {
        this.basketData = data;
       
      });
    } else {
      this.basketSubscription = this.productsService.getBasketData(this.email1).subscribe(data => {
        this.basketData = data;
       
      });
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '500px',
      height: '601px',
      panelClass: 'rounded-dialog',
      disableClose: true,
      data: {
        id: 1,
        formType: 'myForm1'
      }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'placeOrder') {
        this.placeOrder();
      }
    });
  }
  placeOrder(): void {
    
    const orderData = {
      email : this.email1, 
      total_price: this.getTotalPrice(), 
    };

    this.http.post<any>(`${this.baseUrl}/orders`, orderData).subscribe(
      (orderResponse) => {
        
        const orderId = orderResponse.id;

     
        this.basketData.forEach((item) => {
          const orderItemData = {
            order_id: orderId,
            prod_id: item.prod_id,
            quantity: item.quantity,
            color: item.color,
            image: item.image,
            price: item.price1,
          };

          this.http.post<any>(`${this.baseUrl}/order_items`, orderItemData).subscribe(
            (orderItemResponse) => {
             
              console.log('Запись успешно добавлена в таблицу order_items');
            },
            (error) => {
              console.error('Failed to add order item:', error);
             
            }
          );
        });

        
        this.basketData = [];

        this.http.delete<any>(`${this.baseUrl}/basket?email=${this.email1}`).subscribe(
          () => {
            
            console.log('Товары успешно удалены из корзины');
          },
          (error) => {
            console.error('Failed to delete basket items:', error);
           
          }
        );
  
        
        console.log('Заказ успешно размещен');
      },
      (error) => {
        console.error('Failed to place order:', error);
        
      }
    );
  }
  
  getTotalPrice(): number {
    let totalPrice = 0;

    this.basketData.forEach((item) => {
      totalPrice += item.price1 ;
    });

    return totalPrice;
  }



  ngOnDestroy(): void {
    if (this.basketSubscription) {
      this.basketSubscription.unsubscribe();
    }
  }
  GetAllusersBasket() {
    this.productsService.GetBask().subscribe(
      basketData => {
       
        console.log(basketData);
      }
  )}

  GetOneuserBasket(): void {
    const emailValue = this.emailForm.get('email1')?.value;
    this.basketSubscription = this.productsService.getBasketDataByEmail(emailValue).subscribe(
      data => {
        this.basketData = data;
      },
      error => {
        console.error('Failed to load basket data:', error);
       
      }
    );
  }


  minusItemFromBasket(idd: number): void {
    const item = this.basketData.find(item => item.id === idd);
    if (item) {
      if (!item.initialPrice) {
       
        item.initialPrice = item.price1;
      }
  
      item.quantity--;
      item.price1 -= item.initialPrice; 
    }
      if (item.quantity === 0) {
        this.http.delete<any>(`http://localhost:4030/bas/${idd}`).subscribe({
          next: () => {
            this.basketData = this.basketData.filter(item => item.id !== idd);
          },
          error: (err: any) => {
            console.error('Failed to delete item from basket:', err);
            
          }
        });
      }
    }
  

  plusItemFromBasket(idd: number): void {
    const item = this.basketData.find(item => item.id === idd);
  
    if (item) {
      if (!item.initialPrice) {
        
        item.initialPrice = item.price1;
      }
  
      item.quantity++;
      item.price1 += item.initialPrice; 
    }
  }
}
