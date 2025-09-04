import { InterventionDto, UserDto } from '../../models';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { InterventionService } from '../../services/intervention.service';
import jsPDF from 'jspdf';
import { DepartementService } from '../../services/departement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [NgFor,NgIf,DatePipe,NgClass],
  templateUrl: '../../share/services/services.component.html',
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

  searchTechnicienId:number = 0;
  showDetails: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  Math: any = Math;

  currentUser: UserDto | null = null;

  constructor(private interventionService: InterventionService,
              private departementService: DepartementService,
              private router: Router,
              private authService: AuthService,
              private route: ActivatedRoute,

            ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser) {
      this.route.queryParams.subscribe(params => {
        if (params['technicienId']) {
          this.searchTechnicienId = Number(params['technicienId']); // Conversion en nombre
        }

      });
      this.getInterventions(this.currentUser!.id);
      console.log('Current user:', this.currentUser);
    } else {
      console.log('No user is currently logged in.');
    }
  }


  getInterventions(user_id: number): void {
    this.departementService.getByChefDepartement(user_id).subscribe(departement => {
      this.interventionService.getInterventionsByDepartementId(departement.id).subscribe(data => {
        this.interventions = data;
        this.filteredInterventions = data;

        if (this.searchTechnicienId) {
          this.filterInterventions();
        }else{
          this.searchTechnicienId = 0;

        }
        console.log(this.searchTechnicienId)

        this.setPage(this.currentPage);
      });
    });
  }



  AnnulerIntervention(intervention: InterventionDto, user_id:number): void {
    intervention.status = 'Annulee'
    this.interventionService.updateIntervention(intervention,user_id).subscribe(
      response => {
        if(response)
        console.log('intervention Annulee', response);
      });
    this.filterInterventions();
  }

  filterInterventions(): void {
    this.filteredInterventions = this.interventions.filter(intervention => {
      return (!this.searchDate || intervention.createdAt?.startsWith(this.searchDate)) &&
             (!this.searchStatus || intervention.status === this.searchStatus) &&
             (!this.searchText || intervention.titre?.toLowerCase().includes(this.searchText.toLowerCase()) ||
              intervention.reclamation.idFonctionnel?.toLowerCase().includes(this.searchText.toLowerCase())) &&
             (!this.filterByUserId || intervention.createur.id === this.currentUser!.id) &&
             (!this.searchTechnicienId || intervention.technicien?.id === this.searchTechnicienId ||  intervention.equipe?.chefEquipe.id === this.searchTechnicienId
              || intervention.equipe?.techniciens?.find(t => t.id === this.searchTechnicienId));
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

  onUserCheckChange(event: any): void {
    this.filterByUserId = event.target.checked;
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

  goToIntervention(idFonctionnel: string | null): void {
    if (idFonctionnel) {
      const editMode = true; // Ajout de la variable d'état pour le mode édition
      this.router.navigate(['chefDepartement/intervention'], { queryParams: { idFonctionnel,editMode} });
    } else {
      console.error('idFonctionnel is null');
    }
  }


  toggleDetails(intervention: InterventionDto): void {
    this.DetailIntervention = intervention;
    this.showDetails = !this.showDetails;
  }

  goToInterventionHistorique(interventionId: number | null): void {
    if (interventionId) {
      this.router.navigate(['chefDepartement/intervention-historique'], { queryParams: { interventionId} });
    } else {
      console.error('interventionId is null');
    }
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
