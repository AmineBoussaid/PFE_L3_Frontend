import { Component } from '@angular/core';
import { Intervention, User } from '../../models';
import { InterventionService } from '../../services/intervention.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import jsPDF from 'jspdf';
import { ServiceUser_id } from '../../utils';
import { ServiceDService } from '../../services/service_d.service';
import { Router } from '@angular/router';
import { getCurrentUser } from '../../localStorage';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [NgFor,NgIf,DatePipe],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {

  interventions: Intervention[] = [];
  filteredInterventions: Intervention[] = [];
  paginatedInterventions: Intervention[] = [];

  searchDate: string = '';
  searchStatus: string = '';
  searchText: string = '';

  filterByUserId: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  Math: any = Math;

  /*******************/
  currentUser: User | null = null;
  service_id!: number

  constructor(private interventionService: InterventionService,
              private serviceDService: ServiceDService,
              private router: Router
            ) { }

  ngOnInit(): void {
    this.currentUser = getCurrentUser();
    if (this.currentUser) {

      this.getInterventions(this.currentUser!.id);
      console.log('Current User:', this.currentUser);

    } else {
      console.log('No user is currently logged in.');
    }
  }

  getInterventions(user_id : number): void {
    this.serviceDService.getServicesByChefService(user_id).subscribe(service_id => {
      this.interventionService.getInterventionsByServiceId(service_id).subscribe(data => {
        this.interventions = data;
        this.filteredInterventions = data;
        this.setPage(this.currentPage);
      });
    });
  }


  deleteById(id: number,user_id:number): void {
    this.interventionService.deleteById(id,user_id).subscribe(() => {
      this.interventions = this.interventions.filter(intervention => intervention.id !== id);
      this.filterInterventions();
    });
  }

  filterInterventions(): void {
    this.filteredInterventions = this.interventions.filter(intervention => {

      return (!this.searchDate || intervention.created_at?.startsWith(this.searchDate)) &&
             (!this.searchStatus || intervention.status === this.searchStatus) &&
             (!this.searchText ||
              intervention.titre?.toLowerCase().includes(this.searchText.toLowerCase()) ||
              intervention.reclamation.idFonctionnel?.toLowerCase().includes(this.searchText.toLowerCase())) &&
              (!this.filterByUserId || intervention.createur?.id === this.currentUser!.id);

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
      this.router.navigate(['chefService/intervention'], { queryParams: { idFonctionnel,editMode} });
    } else {
      console.error('idFonctionnel is null');
    }
  }

    // Method to generate PDF and open it in a new window
    generatePDF(intervention: Intervention): void {
      const doc = new jsPDF();
      doc.text(

    `Intervention: ${intervention.reclamation.idFonctionnel}\n
      Date Creation ${intervention.created_at}\n
      Titre: ${intervention.titre} \t N° Intervention: ${intervention.reclamation.idFonctionnel}\n
      Detailles :${intervention.description}\n\n

    Reclamation:\n
      Date Creation ${intervention.reclamation.created_at}
      Detailles :${intervention.reclamation.description}`

      ,10, 10);


      // Open the PDF in a new window
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    }

}
