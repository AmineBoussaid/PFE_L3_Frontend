import { UserDto, UserHistoriqueDto } from './../../models';
import { UserHistService } from './../../services/user-hist.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe, formatDate, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [NgFor,DatePipe,NgIf],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})
export class HistoriqueComponent  implements OnInit{

  historiques : UserHistoriqueDto[] = [];
  currentUser: UserDto | null = null;


  constructor(
    private userHistService: UserHistService,
    private authService: AuthService){}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.getByUserId(this.currentUser?.id);
      console.log('Current user:', this.currentUser);
    } else {
      console.log('No user is currently logged in.');
    }
  }



  getByUserId(user_id: number): void {
    this.userHistService.getByUserHistId(user_id).subscribe(
      data => {
        this.historiques = data.sort((a, b) => {
          const dateA = new Date(a.createdAt!).getTime();
          const dateB = new Date(b.createdAt!).getTime();
          return dateB - dateA; // Trie par ordre décroissant
        });
      },
      error => {
        console.error('Erreur lors de la récupération des historiques', error);
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
