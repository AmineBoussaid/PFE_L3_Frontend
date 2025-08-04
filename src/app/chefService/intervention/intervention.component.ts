import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Intervention, Reclamation, Service, TechnicienDto, User } from '../../models';
import { InterventionService } from '../../services/intervention.service';
import { ReclamationService } from '../../services/reclamation.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ServiceUser_id } from '../../utils';
import { getCurrentUser } from '../../localStorage';

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
  editMode: boolean = false; // Ajout de la variable d'état pour le mode édition


  currentUser: User | null = null;

  constructor(
    private interventionService: InterventionService,
    private reclamationService : ReclamationService,
    private userService : UserService,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    this.currentUser = getCurrentUser();
    if (this.currentUser) {

      this.route.queryParams.subscribe(params => {
        if (params['idFonctionnel']) {
          this.newIntervention.reclamation.idFonctionnel = params['idFonctionnel'];
        }
        if (params['editMode']) {
          this.editMode = params['editMode'] === 'true'; // Convertit la chaîne en booléen
        }
      });
      this.verifyReclamation(this.newIntervention.reclamation.idFonctionnel);
      this.verifyIntervention(this.newIntervention.reclamation.idFonctionnel);

      console.log('Current User:', this.currentUser);

    } else {
      console.log('No user is currently logged in.');
    }
  }


  /****  Service Intervention  ****/

  addIntervention(user_id:number): void {
    if (this.reclamationExist) {

      this.newIntervention.createur.id = this.currentUser!.id;
      this.newIntervention.departement.id = this.newReclamation.service.departement.id
      this.newIntervention.service.id = this.newReclamation.service.id

      this.interventionService.addIntervention(this.newIntervention,user_id).subscribe(
        response => {
          console.log('Intervention added', response);
          // Optionally navigate away or show a success message
        },
      );
    } else {
      console.error('Cannot add intervention, reclamation does not exist');
    }
  }


  updateIntervention(user_id:number): void {
    this.interventionService.updateIntervention(this.newIntervention,user_id).subscribe(
      response => {
        console.log('Intervention updated', response);
      },
    );
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

  verifyIntervention(idFonctionnel: string): void {
    this.interventionService.getInterventionsByIdFonctionnel(idFonctionnel).subscribe(
      (intervnetion: Intervention) => {
        this.newIntervention = intervnetion;
        this.reclamationExist = true;
        this.TechniciensByServiceId(intervnetion.service.id)
      },
      (error) => {
        console.error('Intervention does not exist', error);
        this.reclamationExist = false;
      }
    );
  }

  TechniciensByServiceId(serviceId: number): void {
    this.userService.getTechniciensByServiceId(serviceId).subscribe(data => {
      this.techniciens = data;
    });
  }

  enterAddMode(): void {
    this.editMode = false;
    this.newIntervention = new Intervention();
  }

  enterEditMode(): void {
    this.editMode = true;
  }

}
