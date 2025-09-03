import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TechnicienDto, UserDto } from '../../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-all-techniciens',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: '../../../share/gestion-service/all-techniciens/all-techniciens.component.html',
  styleUrl: './all-techniciens.component.css'
})
export class AllTechniciensComponent implements OnInit{

  techniciens : TechnicienDto[] = [];
  filteredTechniciens: TechnicienDto[] = [];
  paginatedTechniciens: TechnicienDto[] = [];
  dates: Date[] = [];

  service_id !: number;
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  Math: any = Math;


  currentUser: UserDto | null = null;


  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router)
    {}


    ngOnInit(): void {
      this.currentUser = this.authService.getCurrentUser();

      if (this.currentUser) {
        // Une fois le service ID récupéré, on traite les queryParams
        this.route.queryParams.subscribe(params => {
          if (params['service_id']) {
            this.service_id = +params['service_id']; // Assurez-vous de convertir en nombre si nécessaire
          }
          if (params['techniciens']) {
            try {
              this.techniciens = JSON.parse(params['techniciens']);
              this.getTechniciens();
              console.log(this.techniciens);
            } catch (error) {
              console.error("Erreur lors du parsing des techniciens", error);
            }
          } else {
            alert("Aucun technicien trouvé");
          }
        });
      }
    }


    getTechniciens():void{
      this.filteredTechniciens = this.techniciens;
      this.setPage(this.currentPage);
    }


    deleteTS(technicien_id: number, service_id: number): void {
    }


    filterTechniciens(): void {
      this.filteredTechniciens = this.techniciens.filter(technicien => {

        return (!this.searchText ||
                technicien.username?.toLowerCase().includes(this.searchText.toLowerCase()) ||
                technicien.service?.nom?.toLowerCase().includes(this.searchText.toLowerCase()));
              });
      this.setPage(this.currentPage);
      this.updatePagination();
    }

    onSearchChange(event: any): void {
      this.searchText = event.target.value;
      this.filterTechniciens();
    }

    setPage(page: number): void {
      if (page < 1 || page > Math.ceil(this.filteredTechniciens.length / this.itemsPerPage)) {
        return;
      }
      this.currentPage = page;
      this.updatePagination();
    }

    updatePagination(): void {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedTechniciens = this.filteredTechniciens.slice(startIndex, endIndex);
    }


    goToServices(technicienId: number): void {
      if (technicienId) {
        const technicienIdJson = JSON.stringify(technicienId);
        this.router.navigate(['/chefDepartement/services'], { queryParams: { technicienId: technicienIdJson } });
      } else {
        alert('technicien is null');
      }
    }

    goToCalendrier(technicienId: number): void {
      if (technicienId) {
        const technicienIdJson = JSON.stringify(technicienId);
        this.router.navigate(['/chefDepartement/calendrier'], { queryParams: { technicienId: technicienIdJson } });
      } else {
        alert('technicien is null');
      }
    }

}
