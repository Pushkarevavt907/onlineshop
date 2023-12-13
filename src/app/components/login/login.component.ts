import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check for authentication during initialization
    this.checkAuthentication();

    // Initialize the login form
    this.initLoginForm();
  }

  private checkAuthentication() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) {
      this.authService.setToken(token);
      this.authService.setEmail(email);
      this.authService.log = email;
      if (email === 'admin@admin.ru') {
        this.authService.makeAdmin(email); // Set the admin role if the user is an admin
      }
      if (email === 'manager@mail.ru') {
        this.authService.makeMan(email); // Set the admin role if the user is a manager
      }
    }
  }

  private initLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  submitLogin() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.login(email, password).subscribe(
      (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('email', email);
          this.authService.setEmail(email);
          this.authService.log=email;
          this.authService.setToken(response.token);

          if (email === 'admin@admin.ru') {
            this.authService.makeAdmin(email); // Set the admin role if the user is an admin
          }
          if (email === 'manager@mail.ru') {
            this.authService.makeMan(email); // Set the admin role if the user is an admin
          }

          this.router.navigate(['home']);
        }
      },
      (error) => {
        this.errorMessage = error.message;
        alert('Invalid username or password');
      }
    );
  }
}