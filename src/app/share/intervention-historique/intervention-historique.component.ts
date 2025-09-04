import { InterventionService } from './../../services/intervention.service';
import { Component } from '@angular/core';
import { InterventionHistoriqueDto, UserDto } from '../../models';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-intervention-historique',
  standalone: true,
  imports: [NgIf,NgFor,NgClass,DatePipe],
  templateUrl: './intervention-historique.component.html',
  styleUrl: './intervention-historique.component.css'
})
export class InterventionHistoriqueComponent {

  interventionHistorique : InterventionHistoriqueDto[] = [];
  filteredIntervention: InterventionHistoriqueDto[] = [];
  paginatedIntervention: InterventionHistoriqueDto[] = [];
  dates: Date[] = [];
  interventionId!:number
  serivce_id !: number;
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 3;
  Math: any = Math;


  currentUser: UserDto | null = null;


  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private interventionService: InterventionService)
    {}


    ngOnInit(): void {
      this.currentUser = this.authService.getCurrentUser();
      if (this.currentUser) {
          this.route.queryParams.subscribe(params => {
            if (params['interventionId']) {
              this.interventionId = Number(params['interventionId'])
              console.log(this.interventionId)
                this.interventionService.getHistoriqueByInterventionId(this.interventionId).subscribe(data => {
                  this.interventionHistorique = data
                this.getInterventionsHistorique();
              })
            }
          });
      }
    }

    getInterventionsHistorique():void{
      this.filteredIntervention = this.interventionHistorique;
      this.setPage(this.currentPage);
    }



    filterTechniciens(): void {
      this.setPage(this.currentPage);
      this.updatePagination();
    }

    onSearchChange(event: any): void {
      this.searchText = event.target.value;
      this.filterTechniciens();
    }

    setPage(page: number): void {
      if (page < 1 || page > Math.ceil(this.filteredIntervention.length / this.itemsPerPage)) {
        return;
      }
      this.currentPage = page;
      this.updatePagination();
    }

    updatePagination(): void {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedIntervention = this.filteredIntervention.slice(startIndex, endIndex);
    }

}

