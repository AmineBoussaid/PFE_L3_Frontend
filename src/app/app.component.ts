import { AuthService } from './services/auth.service';
//app.component.ts

import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HeaderComponent } from './share/menu/header/header.component';
import { SidebarComponent } from './share/menu/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,HeaderComponent,SidebarComponent,CommonModule, FullCalendarModule],
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
