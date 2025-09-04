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
  DetailIntervention: InterventionDto = new InterventionDto();
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
  showDetails: boolean = false;


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

  toggleDetails(intervention: InterventionDto): void {
    this.DetailIntervention = intervention;
    this.showDetails = !this.showDetails;
  }

  generatePDF(intervention: InterventionDto): void {
    const doc = new jsPDF();

    // Ajouter un grand titre
    doc.setFontSize(20);
    doc.text("Rapport de l'intervention", 105, 30, { align: "center" });

    // Ajouter l'image en haut
    const imgUrl = "https://www.radeef.ma/assetsFront/images/upload/logo-dark2.jpg";
    doc.addImage(imgUrl, 'JPEG', 10, 10, 50, 20); // x, y, width, height

    // Réinitialiser la taille de la police
    doc.setFontSize(12);

    // Informations de l'intervention
    doc.text("INFORMATIONS INTERVENTION", 10, 50);
    doc.text(`N°intervention: ${intervention.reclamation.idFonctionnel}`, 10, 60);
    doc.text(`Date de création: ${intervention.createdAt}`, 120, 60);

    doc.text(`CATEGORY: ${intervention.reclamation.category}`, 10, 70);
    doc.text(`SITUATION: ${intervention.reclamation.situation}`, 10, 80);

    doc.text(`DATE DEBUT: ${intervention.dateDebut}`, 10, 90);
    doc.text(`DATE FIN: ${intervention.dateFin}`, 100, 90);

    // Informations du client
    doc.text("INFORMATIONS CLIENT", 10, 110);
    doc.text(`NOM: ${intervention.reclamation.nomClient}`, 10, 120);
    doc.text(`ADRESSE: ${intervention.reclamation.ville} ${intervention.reclamation.quartier} ${intervention.reclamation.nomRue}`, 10, 130);
    doc.text(`TELEPHONE: ${intervention.reclamation.telephone}`, 10, 140);

    // Rapport
    doc.text("RAPPORT", 10, 160);
    doc.text(`${intervention.rapport!.description}`, 10, 170);

    // Ouvrir le PDF dans une nouvelle fenêtre
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
}

}
