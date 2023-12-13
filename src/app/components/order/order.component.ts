import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orders: any[];
  ordersitem: any[];
  email1: string;
  canEdit: boolean = false;
  constructor(private http: HttpClient,private authService: AuthService ) { }

  ngOnInit(): void {
    this.email1 = this.authService.getEmail();
    if (this.canEdit = this.authService.isManager) {
      this.canEdit = this.authService.isManager;
      this.getallOrders().subscribe(
        orders => {
          this.orders = orders;
        },
        error => {
          console.error('Failed to load orders:', error);
          
        }
      );
    
    } 
    
  else{
    this.getOrders().subscribe(
      orders => {
        this.orders = orders;
      },
      error => {
        console.error('Failed to load orders:', error);
      
      }
    );
  }}
  getallOrders(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:4030/allorders');
  }
 getOrders(): Observable<any[]> {
  const email = this.email1; 
  return this.http.get<any[]>(`http://localhost:4030/orders?email=${email}`);
}
  cancelOrder(orderId: number): void {
    this.http.post(`http://localhost:4030/orders/${orderId}/cancel`, {}).subscribe(
      () => {
         },
      error => {
        console.error('Failed to cancel order:', error);
      
      }
    );
  }

  statusPut(orderId: number): void {
    this.http.post(`http://localhost:4030/orders/${orderId}/put`, {}).subscribe(
      () => {
      },
      error => {
        console.error('Failed to cancel order:', error);
      
      }
    );
  }

  statuspoluch(orderId: number): void {
    this.http.post(`http://localhost:4030/orders/${orderId}/poluch`, {}).subscribe(
      () => {
      },
      error => {
        console.error('Failed to cancel order:', error);
      
      }
    );
  }

  statusDostavlen(orderId: number): void {
    this.http.post(`http://localhost:4030/orders/${orderId}/dost`, {}).subscribe(
      () => {
      
      },
      error => {
        console.error('Failed to cancel order:', error);
      
      }
    );
  }



  
  deleteOrder1(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      
  
      this.deleteOrderItems(orderId).subscribe(
        () => {
          this.deleteOrder(orderId).subscribe(
            () => {
             
            },
            error => {
              console.error('Failed to delete order:', error);
             
            }
          );
        },
        error => {
          console.error('Failed to delete order items:', error);
          // Обработка ошибки удаления элементов заказа
        }
      );
    }
  }
  
  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`http://localhost:4030/orders/${orderId}`);
  }
  
  deleteOrderItems(orderId: number): Observable<any> {
    return this.http.delete(`http://localhost:4030/order_items?order_id=${orderId}`);
  }
}