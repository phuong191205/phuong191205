import { Component, ViewChild, ElementRef, ViewEncapsulation, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  encapsulation: ViewEncapsulation.None
})
export class Login {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(ToastService);

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  submitted = false;
  isSubmitting = signal(false);
  step: 'email' | 'password' = 'email';
  showPassword = false;

  @ViewChild('emailInput') emailInput!: ElementRef;

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.isSubmitting()) return;
    this.submitted = true;

    if (this.step === 'email') {
      if (this.email.valid) {
        this.step = 'password';
        this.submitted = false;
      }
    } else {
      if (this.password.valid) {
        this.isSubmitting.set(true);
        const credentials = {
            email: this.email.value,
            password: this.password.value
        };

        this.http.post('/api/login', credentials).subscribe({
            next: (response: any) => {
                this.toastService.show('Đăng nhập thành công!', 'success');
                // Navigate to home or dashboard
                this.router.navigate(['/']);
                this.isSubmitting.set(false);
            },
            error: (error) => {
                console.error('Login failed', error);
                const msg = error.error?.message || 'Email hoặc mật khẩu không đúng.';
                this.toastService.show(msg, 'error');
                this.isSubmitting.set(false);
            }
        });
      }
    }
  }

  editEmail() {
    this.step = 'email';
    this.password.reset();
    setTimeout(() => {
        this.emailInput.nativeElement.focus();
    }, 0);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
