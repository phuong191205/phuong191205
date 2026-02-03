
import { Component, ViewEncapsulation, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  encapsulation: ViewEncapsulation.None
})
export class Signup implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  submitted = false;
  isSubmitting = signal(false);
  showPassword = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email.setValue(params['email']);
      }
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.isSubmitting()) return;

    this.submitted = true;
    if (this.email.valid && this.password.valid) {
      this.isSubmitting.set(true);
      const userData = {
        email: this.email.value,
        password: this.password.value
      };

      this.http.post('/api/signup', userData).subscribe({
        next: (response) => {
          console.log('Signup successful', response);
          this.toastService.show('Đăng ký tài khoản thành công! Vui lòng đăng nhập.', 'success');
          this.router.navigate(['/login']);
          this.isSubmitting.set(false);
        },
        error: (error) => {
          console.error('Signup failed', error);
          const msg = error.error?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
          this.toastService.show(msg, 'error');
          this.isSubmitting.set(false);
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
