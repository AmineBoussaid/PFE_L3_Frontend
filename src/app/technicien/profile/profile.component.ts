import { Departement } from './../../models';
import { Component, OnInit } from '@angular/core';
import { UserHistService } from '../../services/user-hist.service';
import { AuthService } from '../../services/auth.service';
import { Intervention, Service, User, UserHist } from '../../models';
import { InterventionService } from '../../services/intervention.service';
import { DatePipe, formatDate, NgFor, NgIf } from '@angular/common';
import { ServiceDService } from '../../services/service_d.service';
import { DepartementService } from '../../services/departement.service';
import { SidebarComponent } from '../../menu/sidebar/sidebar.component';
import { HeaderComponent } from '../../menu/header/header.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgFor,NgIf,DatePipe,HeaderComponent,SidebarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  intervention: Intervention[] = [];
  historiques : UserHist[] = [];
  nomService : string  | null = null;
  nomDepartement : string  | null = null;

  currentUser: User | null = null;
  interventionCount: number = 0;
  lastInterventionDate: string | null = null;



  constructor(
    private userHistService: UserHistService,
    private authService: AuthService,
    private interventionService: InterventionService,
    private serviceDService: ServiceDService,
  )
    {}

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

  logout(): void {
    this.authService.logout();
    // Optionnel : Rediriger l'utilisateur vers la page de connexion ou d'accueil
    window.location.href = '/login'; // Remplacez '/login' par le chemin vers votre page de connexion
  }

  CountReclamation(): void {
    if (this.currentUser) {
      this.serviceDService.getServiceByTechnicienId(this.currentUser.id).subscribe(
        service => {
          this.nomService = service.nom
          this.nomDepartement = service.departement.nom
        },(error) =>{
          console.error('departement does not exist');
        }
      );

      this.interventionService.getInterventionsByTechnicienId(this.currentUser.id).subscribe( intervention =>
        {
          this.interventionCount = intervention.length;
          if (intervention.length > 0) {
            // Tri des réclamations par date de création décroissante
            intervention.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
            this.lastInterventionDate = intervention[0].created_at; // Date de la dernière réclamation
          }
        });
    }
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
