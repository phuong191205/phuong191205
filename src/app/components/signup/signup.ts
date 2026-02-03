
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
  submitted = false;

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted = true;
    if (this.email.valid) {
      console.log('Signup form submitted', this.email.value);
    }
  }
}
