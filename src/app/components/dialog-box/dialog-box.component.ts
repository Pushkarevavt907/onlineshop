import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent implements OnInit{
  myForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    title: new FormControl(''),
    price: new FormControl(''),
    image: new FormControl(''),
    name: new FormControl(''),
    catid: new FormControl(''),
    brandid: new FormControl(''),
    quantity: new FormControl(''),
   
  });
  myForm1: FormGroup = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    postal_code: new FormControl(''),
    address: new FormControl(''),
    phone: new FormControl('')
  });

  formType: string;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.formType = data.formType;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit(){
    this.data = {
      id:this.myForm.value.id,
      title:this.myForm.value.title,
      price:this.myForm.value.price,
      image:this.myForm.value.image,
      name:this.myForm.value.name,
      catid:this.myForm.value.catid,
      brandid:this.myForm.value.brandid,
      quantity:this.myForm.value.quantity,
     

    }
  
   this.dialogRef.close(this.data);
  }   


  onPlaceOrderClick(): void {
    const deliveryData = {
      first_name: this.myForm1.value.first_name,
      last_name: this.myForm1.value.last_name,
      address: this.myForm1.value.address,
      phone: this.myForm1.value.phone
    };
    this.dialogRef.close({ event: 'placeOrder', deliveryData: deliveryData });
  }
  onSubmit2(){
    const deliveryData = {
      first_name: this.myForm.value.first_name,
      last_name: this.myForm.value.last_name,
      postal_code: this.myForm.value.postal_code,
      address: this.myForm.value.address,
      phone: this.myForm.value.phone,
      order_id: this.data.orderId
    }
      this.dialogRef.close(deliveryData);
    }


  ngOnInit(): void {
    
  }
}

