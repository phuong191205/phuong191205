import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  private router = inject(Router);
  email = '';

  navigateToSignup() {
    this.router.navigate(['/signup'], {
      queryParams: this.email ? { email: this.email } : {}
    });
  }
}
