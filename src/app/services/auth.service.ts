import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private email: string;
  log: string | null;
  isAdmin: boolean = false;
  isManager: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.checkAuthentication();
  }

  private checkAuthentication() {
    const token = this.getToken();
    const email = localStorage.getItem('email');
    if (token && email) {
      this.setEmail(email);
      this.log = email;
      if (email === 'admin@admin.ru') {
        this.makeAdmin(email); // Set the admin role if the user is an admin
      }
      if (email === 'manager@mail.ru') {
        this.makeMan(email); // Set the admin role if the user is an admin
      }
      // Добавьте проверку ролей здесь, если необходимо
    }
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }
  getLog(): string | null {
    return this.log;
  }
  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  getEmail(): string {
    return this.email;
  }

  makeAdmin(email: string) {
    if (email === 'admin@admin.ru') {
      this.isAdmin = true;
    }
  }
  makeMan(email: string) {
    if (email === 'manager@mail.ru') {
      this.isManager = true;
    }
  }

  setEmail(email: string): void {
    this.email = email;
  }

  login(email: string, password: string) {
    return this.http.post<any>('http://localhost:4030/users', { email, password }).pipe(
      map(response => {
        return { token: response.token };
      }),
      catchError(error => {
        throw new Error(error.error.message);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isAdmin = false;
    this.isManager = false;
    this.router.navigate(['login']);
    localStorage.removeItem('email');
    this.email = '';
  }
}