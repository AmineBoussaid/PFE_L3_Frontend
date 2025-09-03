import { Component } from '@angular/core';
import { InterventionDto, UserDto } from '../../models';
import { InterventionService } from '../../services/intervention.service';
import jsPDF from 'jspdf';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [NgFor,NgIf,DatePipe,NgClass],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {

  interventions: InterventionDto[] = [];
  filteredInterventions: InterventionDto[] = [];
  paginatedInterventions: InterventionDto[] = [];

  searchDate: string = '';
  searchStatus: string = '';
  searchText: string = '';

  filterByUserId: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  Math: any = Math;

  /*******************/
  currentUser: UserDto | null = null;


  service_id!: number

  constructor(private interventionService: InterventionService,
              private router: Router,
              private authService: AuthService
            ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser) {
      this.getInterventions(this.currentUser!.id);
      console.log('Current User:', this.currentUser);

    } else {
      console.log('No user is currently logged in.');
    }
  }

  logout(): void {
    this.authService.logout();
    // Optionnel : Rediriger l'utilisateur vers la page de connexion ou d'accueil
    window.location.href = '/login'; // Remplacez '/login' par le chemin vers votre page de connexion
  }

  getInterventions(user_id : number): void {
    this.interventionService.getInterventionsByTechnicienId(user_id).subscribe(data => {
      this.interventions = data;
      this.filteredInterventions = data;
      this.setPage(this.currentPage);
    });
  }

  filterInterventions(): void {
    this.filteredInterventions = this.interventions.filter(intervention => {

      const dateDebutStr = intervention.dateDebut ? new Date(intervention.dateDebut).toISOString().split('T')[0] : '';
      const address = `${intervention.reclamation.ville} ${intervention.reclamation.quartier} ${intervention.reclamation.nomRue}`.toLowerCase();

      return (!this.searchDate || dateDebutStr === this.searchDate) &&
             (!this.searchStatus || intervention.status === this.searchStatus) &&
             (!this.searchText ||
              address.includes(this.searchText.toLowerCase()) ||
              intervention.reclamation.idFonctionnel?.toLowerCase().includes(this.searchText.toLowerCase()));
    });
    this.setPage(this.currentPage);
    this.updatePagination();
  }


  onDateChange(event: any): void {
    this.searchDate = event.target.value;
    this.filterInterventions();
  }

  onStatusChange(event: any): void {
    this.searchStatus = event.target.value;
    this.filterInterventions();
  }

  onSearchChange(event: any): void {
    this.searchText = event.target.value;
    this.filterInterventions();
  }

  setPage(page: number): void {
    if (page < 1 || page > Math.ceil(this.filteredInterventions.length / this.itemsPerPage)) {
      return;
    }
    this.currentPage = page;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedInterventions = this.filteredInterventions.slice(startIndex, endIndex);
  }

  goToIntervention(intervention: InterventionDto | null): void {
    if (intervention) {
      // Stocker l'intervention dans le localStorage

      localStorage.setItem(`currentIntervention_${this.currentUser!.id}`, JSON.stringify(intervention));

      // Naviguer vers la page souhaitée
      this.router.navigate(['technicien/intervention']);
    } else {
      console.error('intervention is null');
    }
  }

    // Method to generate PDF and open it in a new window
    generatePDF(intervention: InterventionDto): void {
      const doc = new jsPDF();
      doc.text(

    `
    \n\n
      N°intervention: ${intervention.reclamation.idFonctionnel}\t${intervention.createdAt}
    \n
        CARTEGORY: ${intervention.reclamation.category}
        SITUATION: ${intervention.reclamation.situation}
        DATE DEBUT \t\t DATE FIN
        ${intervention.dateDebut}  |  ${intervention.dateFin}
    \n

      INFORMATIONS CLIENT\n
        NOM: ${intervention.reclamation.nomClient}
        ADRESSE: ${intervention.reclamation.ville} ${intervention.reclamation.quartier} ${intervention.reclamation.nomRue}
        TELEPHONE: ${intervention.reclamation.telephone}
    \n

      DESCRIPTION\n
        ${intervention.description}
    \n\n
    `
      ,10, 10);

      // Open the PDF in a new window
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    }

}
