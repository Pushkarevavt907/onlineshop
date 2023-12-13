import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductsService } from './../../services/product.service';
import { IProducts } from '../../models/product';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginComponent } from '../login/login.component';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { SearchService } from 'src/app/services/Serch.service';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})


export class BaseComponent implements OnInit {
 


  canEdit:boolean = false;
  products: any[];
  productsSubcription: Subscription;
  
  constructor(private searchService: SearchService, private ProductsService: ProductsService, private http: HttpClient,private dialog: MatDialog,private authService: AuthService) {}
  
  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }


  ngOnInit(): void {
    this.canEdit = this.authService.isAdmin;
  
    this.searchService.searchTerm$.subscribe((searchTerm) => {
      if (searchTerm.trim() === '') {
        this.ProductsService.getBaseData().subscribe((data) => {
          this.products = data;
        });
      } else {
        this.ProductsService.searchProducts(searchTerm).subscribe((data) => {
          this.products = data;
        });
      }
    });
  }
  sendEmail(): void {
    this.http.post('http://localhost:4030/send-email', {}).subscribe(
      () => {
        console.log('Письмо отправлено успешно');
      },
      (error) => {
        console.error('Ошибка при отправке письма:', error);
      }
    );
  }
  openDialog():void{
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width ='800px';
    dialogConfig.height ='1500px';
    dialogConfig.height ='80%';
    dialogConfig.disableClose= true;
    dialogConfig.data = {
      id: 1,
      formType: 'myForm'
    }


    const dialogRef = this.dialog.open(DialogBoxComponent,dialogConfig);
    
    dialogRef.afterClosed().subscribe((data)=> this.postData(data));
  
  
  }
  postData(data:IProducts){
    this.ProductsService.postProduct(data).subscribe ((data)=> this.products.push(data));
  }
 DeleteItem(id:number){
  this.ProductsService.deleteProduct(id).subscribe(()=> this.products.find((item)=>{
    if(id === item.id) {
      let idx = this.products.findIndex( (data)=> data.id ===id)
      this.products.splice(idx, 1);
    }
  }));
 }


 

  ngOnDestroy() {
  if (this.productsSubcription) this.productsSubcription.unsubscribe();
}

}

