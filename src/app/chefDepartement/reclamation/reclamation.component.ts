import { DepartementService } from './../../services/departement.service';
import { Component, OnInit } from '@angular/core';
import { ReclamationService } from '../../services/reclamation.service';
import { Reclamation } from '../../../models';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { DepartementUser_id } from '../../utils';

@Component({
  selector: 'app-reclamation',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './reclamation.component.html',
  styleUrl: './reclamation.component.css'
})
export class ReclamationComponent implements OnInit{

  reclamations: Reclamation[] = [];
  filteredReclamations: Reclamation[] = [];
  paginatedReclamations: Reclamation[] = [];

  searchDate: string = '';
  searchStatus: string = '';
  searchText: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 5;
  Math: any = Math;

  user_id: number = DepartementUser_id


  constructor(private reclamationService: ReclamationService,
              private departementService: DepartementService,
              private router: Router
            ) { }

  ngOnInit(): void {
    this.getReclamations(this.user_id);
  }

  getReclamations(user_id: number): void {
    this.departementService.getByChefDepartement(user_id).subscribe(departement_id => {
      this.reclamationService.getReclamationsByDepartementId(departement_id).subscribe(data => {
        this.reclamations = data;
        this.filteredReclamations = data;
        this.setPage(this.currentPage);
      });
    });
  }


  deleteById(id: number): void {
    this.reclamationService.deleteById(id).subscribe(() => {
      this.reclamations = this.reclamations.filter(reclamation => reclamation.id !== id);
      this.filterReclamations();
    });
  }

  filterReclamations(): void {
    this.filteredReclamations = this.reclamations.filter(reclamation => {
      return (!this.searchDate || reclamation.created_at?.startsWith(this.searchDate)) &&
             (!this.searchStatus || reclamation.status === this.searchStatus) &&
             (!this.searchText || reclamation.nomClient?.toLowerCase().includes(this.searchText.toLowerCase()) ||
              reclamation.idFonctionnel?.toLowerCase().includes(this.searchText.toLowerCase()))
    });
    this.setPage(this.currentPage);
    this.updatePagination();
  }

  onDateChange(event: any): void {
    this.searchDate = event.target.value;
    this.filterReclamations();
  }

  onStatusChange(event: any): void {
    this.searchStatus = event.target.value;
    this.filterReclamations();
  }

  onSearchChange(event: any): void {
    this.searchText = event.target.value;
    this.filterReclamations();
  }


  setPage(page: number): void {
    if (page < 1 || page > Math.ceil(this.filteredReclamations.length / this.itemsPerPage)) {
      return;
    }
    this.currentPage = page;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedReclamations = this.filteredReclamations.slice(startIndex, endIndex);
  }

  goToIntervention(idFonctionnel: string | null): void {
    if (idFonctionnel) {
      this.router.navigate(['chefDepartement/intervention'], { queryParams: { idFonctionnel } });
    } else {
      console.error('idFonctionnel is null');
    }
  }

  generatePDF(reclamation: Reclamation): void {
    const doc = new jsPDF();
    doc.text(`Date Creation ${reclamation.created_at} \t N° Reclamation: ${reclamation.idFonctionnel}\n`,10, 10);
    doc.text(`\n\n ${reclamation.description}`,10, 10);

    // Open the PDF in a new window
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
  }


}
