import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../services/auth.service';
import { IProducts, IProductsProdinfo } from 'src/app/models/product';
import { Subscription } from 'rxjs';
import { ProductsService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products-detail',
  templateUrl: './products-detail.component.html',
  styleUrls: ['./products-detail.component.scss']
})
export class ProductsDetailComponent implements OnInit {
  product: IProducts;
  productSubscribtion: Subscription;
  selectedImage: string;
  basket: IProducts[];
  email1: string;
  averageRating: number;
  ssId: number = 1;
  ssimg: string = 'da';
  log: string | null;
  hasReview: boolean = false;
  newReview: {
    rating: number,
    comment: string
  } = {
    rating: 1,
    comment: ''
  };
  reviews: {
    user_name: string,
    rating: number,
    comment: string
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private productService: ProductsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.productSubscribtion = this.route.data.subscribe((data) => {
      this.product = data['data'];
      this.ssId = this.product.prodInfo[0].id;
      this.ssimg = this.product.prodInfo[0].img;
      this.email1 = this.authService.getEmail();
     
     
      if (this.product.prodInfo.length > 0) {
        this.selectedImage = this.product.prodInfo[0].img;
      }
      this.fetchReviews();
    });
  }

  calculateAverageRating(): number {
    if (this.reviews.length === 0) {
      return 0; 
    }
    
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / this.reviews.length;
  
  
    return Math.round(averageRating * 100) / 100;
  }


  SelectId(sId: number, simg: string) {
    this.ssId = sId;
    this.ssimg = simg;
  }

  addToBasket(product: IProductsProdinfo): void {
    if (this.authService.log) {
      const data = {
        id: this.ssId,
        color: product.color,
        img: this.ssimg,
        quantity: 1,
        login: this.email1
      };

      this.http.post<any>('http://localhost:4030/bas', data).subscribe({
        next: () => {
          console.log('Товар успешно добавлен');
          alert('Товар успешно добавлен');
          
        },
        error: (err: any) => {
          console.error('Товар не добавлен', err);
          alert('Войдите в аккаунт');
        }
      });
    } else {
      alert('Войдите в аккаунт');
    }
  }

  changeSelectedImage(image: string) {
    this.selectedImage = image;
  }

  fetchReviews(): void {
    const product_id = this.product.id; // Получение product_id из компонента
    this.http.get<any>('http://localhost:4030/reviews', { params: { product_id } }).subscribe({
      next: (response: any) => {
        this.reviews = response;
        this.averageRating = this.calculateAverageRating();
      },
      error: (err: any) => {
        console.error('Failed to fetch reviews:', err);
        
      }
    });
  }

  submitReview(): void {
    if (this.newReview.rating && this.newReview.comment) {
      const data = {
        product_id: this.product.id,
        email: this.email1,
        rating: this.newReview.rating,
        comment: this.newReview.comment
      };
  
      this.http.post<any>('http://localhost:4030/reviews', data).subscribe({
        next: () => {
          console.log('Review added successfully');
          this.fetchReviews();
          this.newReview = {
            rating: 1,
            comment: ''
          };
        },
        error: (err: any) => {
          console.error('Failed to add review:', err);
          
        }
      });
    } else {
      alert('Заполните все поля отзыва');
    }
  }

  setRating(rating: number): void {
    this.newReview.rating = rating;
  }



  ngOnDestroy() {
    if (this.productSubscribtion) {
      this.productSubscribtion.unsubscribe();
    }
  }
}