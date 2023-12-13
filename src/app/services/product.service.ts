import { Injectable } from '@angular/core';
import { IProducts, IProductsProdinfo } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable ({
    providedIn: 'root'
})

export class ProductsService {
   
    url: string = 'http://localhost:3000/products';
    urlBasket: string = 'http://localhost:3000/basket';
    baseUrl:string ='http://localhost:4030'
  ProductsService: any;
    

    constructor(private http: HttpClient,private authService: AuthService) { }

    searchProducts(searchTerm: string): Observable<IProducts[]> {
      const searchUrl = `${this.url}?search=${searchTerm}`;
      return this.http.get<IProducts[]>(searchUrl);
    }

    GetBask(): Observable<any[]>{
      return this.http.get<any[]>(`${this.baseUrl}/basket1`);
    }
    getBasketDataByEmail(email: string): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/basket?email=${email}`);
    }


    deleteItemFromBasket(idd: number): Observable<any> {
      return this.http.delete(`${this.baseUrl}/bas/${idd}`);
    }


    
    getBaseData(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/base`);
    }

    getBasketData(email: string): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/bas?email=${email}`);
    }
    
    getProductPrice(productId: number): Observable<number> {
      return this.http.get<number>(`${this.baseUrl}/products/${productId}/price1`);
    }
    
    getProductsByCategory(category: string): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/base?category=${category}`);
    }


      createOrder(orderData: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/orders`, orderData);
      }
    
      createOrderItem(orderItemData: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/order_items`, orderItemData);
      }

    
      getProducts() {
        return this.http.get<IProducts[]>(this.url);
 
     }

    getProduct(id:number){

        return this.http.get<IProducts>(`${this.url}/${id}`);
    }
    getProductFromBasket(): Observable<IProducts[]> {
      return this.http.get<IProducts[]>(this.urlBasket);
    }
 
    addToBasket(product: IProductsProdinfo): Observable<any> {
      return this.http.post(this.urlBasket, product);
    }
  
    postToBasket(product: IProducts): Observable<any> {
      return this.http.post(this.urlBasket, product);
    }
  
    updateToBasket(product: IProducts): Observable<any> {
      return this.http.put(`${this.urlBasket}/${product.id}`, product);
    }
  
    deleteProductFromBasket(id: number): Observable<any> {
      return this.http.delete(`${this.urlBasket}/${id}`);
    }

   postProduct(product: IProducts){
    return this.http.post<IProducts>(this.url, product);
   }
   deleteProduct(id: number){
    return this.http.delete<any>(`${this.url}/${id}`);
   }

  }


