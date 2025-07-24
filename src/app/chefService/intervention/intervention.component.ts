import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Intervention, Reclamation, Service, TechnicienDto, User } from '../../../models';
import { InterventionService } from '../../services/intervention.service';
import { ReclamationService } from '../../services/reclamation.service';
import { ServiceDService } from '../../services/service_d.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { DepartementUser_id, ServiceUser_id } from '../../utils';

@Component({
  selector: 'app-intervention',
  standalone: true,
  imports: [NgFor,FormsModule,NgIf],
  templateUrl: './intervention.component.html',
  styleUrl: './intervention.component.css'
})
export class InterventionComponent implements OnInit {

  newIntervention: Intervention = new Intervention();
  newReclamation: Reclamation = new Reclamation();
  services: Service[] = []
  techniciens : TechnicienDto[] = [];

  reclamationExist: boolean = true;
  dateFinEstimee!: Date | null;

  user_id : number = ServiceUser_id;

  constructor(
    private interventionService: InterventionService,
    private reclamationService : ReclamationService,
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
      this.newIntervention.departement.id = this.newReclamation.service.departement.id
      this.newIntervention.service.id = this.newReclamation.service.id

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


  verifyReclamation(idFonctionnel: string): void {
    this.reclamationService.getReclamationByIdFonctionnel(idFonctionnel).subscribe(
      (reclamation: Reclamation) => {
        this.newReclamation = reclamation;
        this.newIntervention.reclamation.id = reclamation.id;
        this.reclamationExist = true;
        this.TechniciensByServiceId(reclamation.service.id)
      },
      (error) => {
        console.error('Reclamation does not exist', error);
        this.reclamationExist = false;
      }
    );
  }


  TechniciensByServiceId(serviceId: number): void {
    this.userService.getTechniciensByServiceId(serviceId).subscribe(data => {
      this.techniciens = data;
    });
  }

}
