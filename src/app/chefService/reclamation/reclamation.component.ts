import { ServiceDService } from './../../services/service_d.service';
import { Component, OnInit } from '@angular/core';
import { ReclamationDto, UserDto } from '../../models';
import { ReclamationService } from '../../services/reclamation.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import jsPDF from 'jspdf';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../../menu/sidebar/sidebar.component';
import { HeaderComponent } from '../../menu/header/header.component';

@Component({
  selector: 'app-reclamation',
  standalone: true,
  imports: [NgFor,NgIf,HeaderComponent,SidebarComponent],
  templateUrl: './reclamation.component.html',
  styleUrl: './reclamation.component.css'
})
export class ReclamationComponent  implements OnInit{

  reclamations: ReclamationDto[] = [];
  filteredReclamations: ReclamationDto[] = [];
  paginatedReclamations: ReclamationDto[] = [];

  searchDate: string = '';
  searchStatus: string = '';
  searchText: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 5;
  Math: any = Math;

  currentUser: UserDto | null = null;

  constructor(private reclamationService: ReclamationService,
    private serviceDService: ServiceDService,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser) {
      this.getReclamations(this.currentUser!.id);
      console.log('Current User:', this.currentUser);

    } else {
      console.log('No user is currently logged in.');
    }
  }

  getReclamations(user_id : number): void {
    this.serviceDService.getServicesByChefService(user_id).subscribe(service => {
      this.reclamationService.getReclamationsByServiceId(service.id).subscribe(data => {
        this.reclamations = data;
        this.filteredReclamations = data;
        this.setPage(this.currentPage);
      });
    })

  }

  deleteById(id: number ,user_id : number): void {
    this.reclamationService.deleteById(id,user_id).subscribe(() => {
      this.reclamations = this.reclamations.filter(reclamation => reclamation.id !== id);
      this.filterReclamations();
    });
  }

  filterReclamations(): void {
    this.filteredReclamations = this.reclamations.filter(reclamation => {

      const address = `${reclamation.ville} ${reclamation.quartier} ${reclamation.nomRue}`.toLowerCase();

      return (!this.searchDate || reclamation.createdAt?.startsWith(this.searchDate)) &&
             (!this.searchStatus || reclamation.status === this.searchStatus) &&
             (!this.searchText ||
              address.includes(this.searchText.toLowerCase()) ||
              reclamation.nomClient?.toLowerCase().includes(this.searchText.toLowerCase()) ||
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
      this.router.navigate(['chefService/intervention'], { queryParams: { idFonctionnel } });
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
