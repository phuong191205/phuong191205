import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  encapsulation: ViewEncapsulation.None
})
export class Login {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  submitted = false;
  step: 'email' | 'password' = 'email';
  showPassword = false;

  @ViewChild('emailInput') emailInput!: ElementRef;

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted = true;

    if (this.step === 'email') {
      if (this.email.valid) {
        this.step = 'password';
        this.submitted = false;
      }
    } else {
      if (this.password.valid) {
        console.log('Login submitted', { email: this.email.value, password: this.password.value });
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
