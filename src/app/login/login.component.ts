// src/app/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from './../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  getData: boolean = false;

  constructor(private loginservice: LoginService, private router: Router) { }

  ngOnInit() { }

  login() {
    const username = this.model.username;
    const password = this.model.password;

    this.loginservice.getLogin(username, password).subscribe((res: { success: boolean }) => {
      this.getData = res.success;

      if (this.getData) {
        this.router.navigate(['/home']);
      } else {
        alert('Invalid User');
      }
    });
  }
}
