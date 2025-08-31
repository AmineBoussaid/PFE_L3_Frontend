import { Component, OnInit } from '@angular/core';
import { UserDto } from '../models';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}


  onSubmit(): void {
    this.authService.auth(this.email, this.password).subscribe(
      user  => {
        if (user) {
          // Naviguer vers le tableau de bord en fonction du rôle
          if (user.role === 'agent') {
            this.router.navigate(['/agent/dashboard']);

          } else if (user.role === 'chef service') {
            this.router.navigate(['/chefService/dashboard']);

          } else if (user.role === 'chef departement') {
            this.router.navigate(['/chefDepartement/dashboard']);

          } else if (user.role === 'technicien') {
            this.router.navigate(['/technicien/dashboard']);
          }
          // Ajoutez d'autres rôles si nécessaire
        } else {
          alert('Login failed');
        }
      },
      error => {
        console.error('Login error', error);
        alert('Login error');
      },
      () => {}
    );
  }
}
