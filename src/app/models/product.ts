export interface IProducts {
    price1: number;
    img: string | undefined;
    id:number,
    price:number,
    name:string,
    catid:string,
    brandid:string,
    image?:string,
    title:string,
    quantity:number,
    prodInfo:IProductsProdinfo[];
    
}

export interface IProductsProdinfo{
    id:number,
    title2?: string, 
    img: string,
    price1?: number,
    color:string,
    size: string,
    brandid:string,
    maxquantity:number;
   
}
interface IBasketProduct extends IProducts {
    img: string,
    price1: number,
    color:string;
  }
