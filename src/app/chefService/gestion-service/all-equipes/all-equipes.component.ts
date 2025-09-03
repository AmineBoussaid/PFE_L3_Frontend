import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipeDto, TechnicienDto, UserDto } from '../../../models';
import { ServiceDService } from '../../../services/service_d.service';
import { UserService } from '../../../services/user.service';
import { InterventionService } from '../../../services/intervention.service';
import { AuthService } from '../../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-all-equipes',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: '../../../share/gestion-service//all-equipes/all-equipes.component.html',
  styleUrl: './all-equipes.component.css'
})
export class AllEquipesComponent {

  equipes : EquipeDto[] = [];
  filteredEquipes: EquipeDto[] = [];
  paginatedEquipes: EquipeDto[] = [];
  dates: Date[] = [];

  serivce_id!: number;
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
            if (params['equipes']) {
              try {
                this.equipes = JSON.parse(params['equipes']);
                this.getEquipes();
                console.log(this.equipes);
              } catch (error) {
                console.error("Erreur lors du parsing des equipes", error);
              }
            } else {
              alert("null");
            }
          });
        });
      }
    }

    getEquipes():void{
      this.filteredEquipes = this.equipes;
      this.setPage(this.currentPage);
    }


    filterEquipes(): void {
      this.filteredEquipes = this.equipes.filter(equipe => {

        return (!this.searchText ||
          equipe.nom?.toLowerCase().includes(this.searchText.toLowerCase()) ||
          equipe.chefEquipe?.username?.toLowerCase().includes(this.searchText.toLowerCase()));
              });
      this.setPage(this.currentPage);
      this.updatePagination();
    }

    onSearchChange(event: any): void {
      this.searchText = event.target.value;
      this.filterEquipes();
    }

    setPage(page: number): void {
      if (page < 1 || page > Math.ceil(this.filteredEquipes.length / this.itemsPerPage)) {
        return;
      }
      this.currentPage = page;
      this.updatePagination();
    }

    updatePagination(): void {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedEquipes = this.filteredEquipes.slice(startIndex, endIndex);
    }


}
