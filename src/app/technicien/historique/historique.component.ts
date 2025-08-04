import { Component, OnInit } from '@angular/core';
import { User, UserHist } from '../../models';
import { Technicien4User_id } from '../../utils';
import { UserHistService } from '../../services/user-hist.service';
import { formatDate, NgFor, NgIf } from '@angular/common';
import { getCurrentUser } from '../../localStorage';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})
export class HistoriqueComponent  implements OnInit{

  historiques : UserHist[] = [];
  currentUser: User | null = null;


  constructor(
    private userHistService: UserHistService,
  ) { }

  ngOnInit(): void {
    this.currentUser = getCurrentUser();
    if (this.currentUser) {

      this.getByUserId(this.currentUser!.id);
      console.log('Current User:', this.currentUser);

    } else {
      console.log('No user is currently logged in.');
    }
  }

  getByUserId(user_id: number): void {
    this.userHistService.getByUserHistId(user_id).subscribe(
      data => {
        this.historiques = data.sort((a, b) => {
          const dateA = new Date(a.created_at!).getTime();
          const dateB = new Date(b.created_at!).getTime();
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
