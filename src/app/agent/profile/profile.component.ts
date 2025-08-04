import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Agent1User_id, getUser } from '../../utils';
import { UserHistService } from '../../services/user-hist.service';
import { User, UserHist } from '../../models';
import { getCurrentUser } from '../../localStorage';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
[x: string]: any;

  historiques : UserHist[] = [];
  currentUser: User | null = null;

  constructor(
    private userHistService: UserHistService,
    private authService: AuthService){}

  ngOnInit(): void {
    this.currentUser = getCurrentUser();
    if (this.currentUser) {
      this.getUserHist(this.currentUser.id);
      console.log('Current user:', this.currentUser);

    } else {
      console.log('No user is currently logged in.');
    }
  }

  logout(): void {
    this.authService.logout();
    // Optionnel : Rediriger l'utilisateur vers la page de connexion ou d'accueil
    window.location.href = '/login'; // Remplacez '/login' par le chemin vers votre page de connexion
  }

  getUserHist(user_id: number): void {
    this.userHistService.getByUserHistId(user_id).subscribe(
      data => {
        this.historiques = data.sort((a, b) => {
          const dateA = new Date(a.created_at!).getTime();
          const dateB = new Date(b.created_at!).getTime();
          return dateB - dateA; // Trie par ordre décroissant
        });
      },
      error => {
        console.error('Erreur lorsn de la récupération des historiques', error);
      }
    );
  }
}
