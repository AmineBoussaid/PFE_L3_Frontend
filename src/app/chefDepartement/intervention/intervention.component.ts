import { Component, OnInit } from '@angular/core';
import { InterventionService } from '../../services/intervention.service';
import { Departement, Intervention, Reclamation, Service, TechnicienDto } from '../../../models';
import { FormsModule } from '@angular/forms';
import { ServiceDService } from '../../services/service_d.service';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReclamationService } from '../../services/reclamation.service';
import { DepartementService } from '../../services/departement.service';
import { UserService } from '../../services/user.service';
import { DepartementUser_id } from '../../utils';

@Component({
  selector: 'app-intervention',
  standalone: true,
  imports: [NgFor,FormsModule,NgIf],
  templateUrl: './intervention.component.html',
  styleUrl: './intervention.component.css'
})
export class InterventionComponent implements OnInit {

  interventions: Intervention[] = [];
  newIntervention: Intervention = new Intervention();
  services: Service[] = []
  techniciens : TechnicienDto[] = [];


  reclamationExist: boolean = true;
  dateFinEstimee!: Date | null;


  departement_id!:number
  service_id!:number
  user_id: number = DepartementUser_id


  constructor(
    private interventionService: InterventionService,
    private reclamationService : ReclamationService,
    private departementService: DepartementService,
    private serviceDService : ServiceDService,
    private userService : UserService,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['idFonctionnel']) {
        this.newIntervention.reclamation.idFonctionnel = params['idFonctionnel'];
      }
    });
    this.verifyReclamation(this.newIntervention.reclamation.idFonctionnel);
  }


  /****  Service Intervention  ****/

  addIntervention(): void {
    if (this.reclamationExist) {

      this.newIntervention.createur.id = this.user_id;
      this.newIntervention.departement.id = this.departement_id;
      this.newIntervention.service.id = this.service_id;

      this.interventionService.addIntervention(this.newIntervention).subscribe(
        response => {
          console.log('Intervention added', response);
          // Optionally navigate away or show a success message
        },
      );
    } else {
      console.error('Cannot add intervention, reclamation does not exist');
    }
  }

  /****  Service Service  ****/
  getServicesByDepartementId(user_id: number): void{
    this.departementService.getByChefDepartement(user_id).subscribe(departementid =>{
      this.departement_id = departementid;
      this.serviceDService.getServicesByDepartementId(departementid).subscribe(
        data => {
        this.services = data;
        },
      );
   })
  }

  onServiceChange(event: any): void {
    const serviceid = event.target.value;
    if (serviceid) {
      this.TechniciensByServiceId(serviceid);
    } else {
      this.services = [];
    }
  }

  TechniciensByServiceId(service_id: number): void {
    this.userService.getTechniciensByServiceId(service_id).subscribe(data => {
      this.techniciens = data;
      console.log(this.techniciens);

    });
  }

  /****  Reclamation Service  ****/
  verifyReclamation(idFonctionnel: string): void {
    this.reclamationService.getReclamationByIdFonctionnel(idFonctionnel).subscribe(
      (reclamation: Reclamation) => {
        this.newIntervention.reclamation.id = reclamation.id;
        this.reclamationExist = true;
        this.getServicesByDepartementId(this.user_id)

      },
      (error) => {
        console.error('Reclamation does not exist');
        this.reclamationExist = false;
      }
    );
  }
}
