import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { SearchService } from 'src/app/services/Serch.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cal: string = 'удочки';
  searchTerm: string;

  constructor(public authService: AuthService,private searchService: SearchService ) {}
  updatecat(cac:string){
    
    localStorage.setItem('category', cac);
  }
  

  search() {
  this.searchService.setSearchTerm(this.searchTerm);
}
}




export class InputClearableExample {
  value = 'Clear me';
}

