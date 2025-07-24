import { DepartementUser_id } from './../../utils';
import { Intervention } from './../../../models';
import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { InterventionService } from '../../services/intervention.service';
import jsPDF from 'jspdf';
import { DepartementService } from '../../services/departement.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [NgFor,NgIf],
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

  user_id: number = DepartementUser_id

  constructor(private interventionService: InterventionService,
              private departementService: DepartementService,
            ) {}

  ngOnInit(): void {
    this.getInterventions(this.user_id);
  }

  getInterventions(user_id : number): void {
    this.departementService.getByChefDepartement(user_id).subscribe(departement_id => {
      this.interventionService.getInterventionsByDepartementId(departement_id).subscribe(data => {
        this.interventions = data;
        this.filteredInterventions = data;
        this.setPage(this.currentPage);
    })

    });
  }


  deleteById(id: number): void {
    this.interventionService.deleteById(id).subscribe(() => {
      this.interventions = this.interventions.filter(intervention => intervention.id !== id);
      this.filterInterventions();
    });
  }

  filterInterventions(): void {
    this.filteredInterventions = this.interventions.filter(intervention => {
      return (!this.searchDate || intervention.created_at?.startsWith(this.searchDate)) &&
             (!this.searchStatus || intervention.status === this.searchStatus) &&
             (!this.searchText || intervention.titre?.toLowerCase().includes(this.searchText.toLowerCase()) ||
              intervention.reclamation.idFonctionnel?.toLowerCase().includes(this.searchText.toLowerCase())) &&
              (!this.filterByUserId || intervention.departement?.id === this.user_id);

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

    // Method to generate PDF and open it in a new window
    generatePDF(intervention: Intervention): void {
      const doc = new jsPDF();
      doc.text(

    `Intervention: ${intervention.reclamation.idFonctionnel}\n
      Date Creation ${intervention.created_at}\n
      Titre: ${intervention.titre} \t N° Intervention: ${intervention.reclamation.idFonctionnel}\n
      Detailles : ${intervention.description}\n\n

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
