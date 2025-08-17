import { AuthService } from './services/auth.service';
//app.component.ts

import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './menu/sidebar/sidebar.component';
import { HeaderComponent } from './menu/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,HeaderComponent,SidebarComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'appAngular';

  constructor(private authService: AuthService){}


  isLogged(): boolean {
    let x =  this.authService.isLogged();
    return x;
  }

}
