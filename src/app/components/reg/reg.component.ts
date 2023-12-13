import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.scss']
})
export class RegComponent implements OnInit {
  registerForm: FormGroup;
  isFormValid = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    // подписаться на изменения в форме, чтобы обновлять свойство isFormValid
    this.registerForm.valueChanges.subscribe(() => {
      this.isFormValid = this.registerForm.valid;
    });
  }

  submitRegistration(): void {
    const { name, email, password } = this.registerForm.value;
    this.http.post<any>('http://localhost:4030/reg', { name, email, password }).subscribe({
      next: () => {
        alert('Пользователь успешно зарегистрирован');
        this.router.navigate(['login']);
      },
      error: (err) => {
        if (err.status === 409) {
          alert('Пользователь уже существует');
        } else {
          alert(err.message);
        }
      }
    });
  }
}