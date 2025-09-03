import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserDto } from '../../../models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf,RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent  implements OnInit{
  currentUser: UserDto | null = null;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }
}
