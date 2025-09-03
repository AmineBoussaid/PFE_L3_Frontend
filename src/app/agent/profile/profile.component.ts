import { ReclamationService } from './../../services/reclamation.service';
import { DatePipe, NgFor, NgIf, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserHistService } from '../../services/user-hist.service';
import { ReclamationDto, UserDto, UserHistoriqueDto } from '../../models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgFor,NgIf,DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  reclamations: ReclamationDto[] = [];
  historiques : UserHistoriqueDto[] = [];

  currentUser: UserDto | null = null;
  reclamationCount: number = 0;
  lastReclamationDate: string | null = null;



  constructor(
    private userHistService: UserHistService,
    private authService: AuthService,
    private reclamationService: ReclamationService){}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.CountReclamation();
      this.getUserHist(this.currentUser.id);
      console.log('Current user:', this.currentUser);

    } else {
      console.log('No user is currently logged in.');
    }
  }



  CountReclamation(): void {
    if (this.currentUser) {
      this.reclamationService.getReclamationByAgentId(this.currentUser.id).subscribe(
        (reclamations: ReclamationDto[]) => {
          this.reclamationCount = reclamations.length;

          if (reclamations.length > 0) {
            // Tri des réclamations par date de création décroissante
            reclamations.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
            this.lastReclamationDate = reclamations[0].createdAt; // Date de la dernière réclamation
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération des réclamations', error);
        }
      );
    }
  }

  getUserHist(user_id: number): void {
    this.userHistService.getByUserHistId(user_id).subscribe(
      data => {
        this.historiques = data.sort((a, b) => {
          const dateA = new Date(a.createdAt!).getTime();
          const dateB = new Date(b.createdAt!).getTime();
          return dateB - dateA; // Trie par ordre décroissant
        });
      },
      error => {
        console.error('Erreur lorsn de la récupération des historiques', error);
      }
    );
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (this.isSameDay(date, today)) {
      return `Aujourd'hui à ${formatDate(date, 'HH:mm', 'en-US')}`;
    } else if (this.isSameDay(date, yesterday)) {
      return `Hier à ${formatDate(date, 'HH:mm', 'en-US')}`;
    } else {
      return formatDate(date, 'MM-dd HH:mm', 'en-US');
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
