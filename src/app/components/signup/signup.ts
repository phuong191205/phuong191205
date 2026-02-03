
import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  encapsulation: ViewEncapsulation.None
})
export class Signup {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  submitted = false;
  showPassword = false;

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted = true;
    if (this.email.valid && this.password.valid) {
      console.log('Signup form submitted', { email: this.email.value, password: this.password.value });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
