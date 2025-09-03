import { Component, OnInit } from '@angular/core';
import { ReclamationService } from '../../services/reclamation.service';
import { ReclamationDto, UserDto } from '../../models';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-services',
  standalone: true,
  imports: [NgFor,NgIf,NgClass],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {

  reclamations: ReclamationDto[] = [];
  filteredReclamations: ReclamationDto[] = [];
  paginatedReclamations: ReclamationDto[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 5;
  Math: any = Math;

  searchDate: string = '';
  searchStatus: string = '';
  searchText: string = '';

  currentUser: UserDto | null = null;

  filterByUserId: boolean = false;

  constructor(private reclamationService: ReclamationService,
    private router: Router,
    private authService: AuthService){ }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.getReclamations();
      console.log('Current user:', this.currentUser);
    } else {
      console.log('No user is currently logged in.');
    }
    this.getReclamations();
  }



  getReclamations(): void {
    this.reclamationService.getReclamations().subscribe(data => {
      this.reclamations = data;
      this.filteredReclamations = data;
      this.setPage(this.currentPage);
    });
  }

  filterReclamations(): void {
    this.filteredReclamations = this.reclamations.filter(reclamation => {

      const address = `${reclamation.ville} ${reclamation.quartier} ${reclamation.nomRue}`.toLowerCase();

      return (!this.searchDate || reclamation.createdAt?.startsWith(this.searchDate)) &&
             (!this.searchStatus || reclamation.status === this.searchStatus) &&
             (!this.searchText || reclamation.nomClient?.toLowerCase().includes(this.searchText.toLowerCase()) ||
              address.includes(this.searchText.toLowerCase()) ||
              reclamation.idFonctionnel?.toLowerCase().includes(this.searchText.toLowerCase())) &&
             (!this.filterByUserId || reclamation.agent?.id === this.currentUser!.id);
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

  onUserCheckChange(event: any): void {
    this.filterByUserId = event.target.checked;
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

  goToReclamation(idFonctionnel: string | null): void {
    if (idFonctionnel) {
      this.router.navigate(['agent/reclamation'], { queryParams: { idFonctionnel } });
    } else {
      console.error('idFonctionnel is null');
    }
  }

  // Method to generate PDF and open it in a new window
  generatePDF(reclamation: ReclamationDto): void {
    const doc = new jsPDF();
    doc.text(`Date Creation ${reclamation.createdAt} \t N° Reclamation: ${reclamation.idFonctionnel}\n`,10, 10);
    doc.text(`\n\n ${reclamation.description}`,10, 10);

    // Open the PDF in a new window
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
  }
}
