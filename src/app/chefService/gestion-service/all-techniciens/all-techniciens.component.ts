import { ServiceDService } from '../../../services/service_d.service';
import { UserService } from '../../../services/user.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TechnicienDto, UserDto } from '../../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { InterventionService } from '../../../services/intervention.service';
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

  serivce_id !: number;
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  Math: any = Math;


  currentUser: UserDto | null = null;


  constructor(
    private route: ActivatedRoute,
    private serviceDService: ServiceDService,
    private userService: UserService,
    private interventionService : InterventionService,
    private authService: AuthService,
    private router: Router)
    {}


    ngOnInit(): void {
      this.currentUser = this.authService.getCurrentUser();

      if (this.currentUser) {

        this.serviceDService.getServicesByChefService(this.currentUser.id).subscribe(service => {
          this.serivce_id = service.id;

          // Une fois le service ID récupéré, on traite les queryParams
          this.route.queryParams.subscribe(params => {
            if (params['techniciens']) {
              try {
                this.techniciens = JSON.parse(params['techniciens']);
                this.getTechniciens();
                console.log(this.techniciens);
              } catch (error) {
                console.error("Erreur lors du parsing des techniciens", error);
              }
            } else {
              alert("null");
            }
          });
        });
      }
    }

    getTechniciens():void{
      this.filteredTechniciens = this.techniciens;
      this.setPage(this.currentPage);
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

    goToIntervention(technicien: TechnicienDto): void {
      if (technicien) {
        const technicienJson = JSON.stringify(technicien);
        this.router.navigate(['/chefService/intervention'], { queryParams: { technicien: technicienJson } });
      } else {
        alert('technicien is null');
      }
    }

    goToCalendrier(technicienId: number): void {
      if (technicienId) {
        const technicienIdJson = JSON.stringify(technicienId);
        this.router.navigate(['/chefService/calendrier'], { queryParams: { technicienId: technicienIdJson } });
      } else {
        alert('technicien is null');
      }
    }

}
