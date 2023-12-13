import { ProductsService } from './../../services/product.service';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { IProducts } from '../../models/product';
import { Subscription } from 'rxjs';






@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit {

  category: string;
   
  products: any[];
  
  
  constructor(private productsService: ProductsService) { }
  
  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  ngOnInit() {
    const localStorageCategory = localStorage.getItem('category');
    if (localStorageCategory !== null) {
      this.category = localStorageCategory;
      this.getProductsByCategory();
    } else {
      
    }
  }

  getProductsByCategory(category: string = this.category): void {
    this.productsService.getProductsByCategory(category)
      .subscribe((data) => {this.products = data;
  })
  }
}





