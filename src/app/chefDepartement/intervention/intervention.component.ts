import { Component, OnInit } from '@angular/core';
import { InterventionService } from '../../services/intervention.service';
import { Intervention, Reclamation, Service, TechnicienDto, User } from '../../models';
import { FormsModule } from '@angular/forms';
import { ServiceDService } from '../../services/service_d.service';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReclamationService } from '../../services/reclamation.service';
import { DepartementService } from '../../services/departement.service';
import { UserService } from '../../services/user.service';
import { DepartementUser_id } from '../../utils';
import { getCurrentUser } from '../../localStorage';

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
  editMode: boolean = false; // Ajout de la variable d'état pour le mode édition


  departement_id!:number
  service_id!:number
  currentUser: User | null = null;


  constructor(
    private interventionService: InterventionService,
    private reclamationService : ReclamationService,
    private departementService: DepartementService,
    private serviceDService : ServiceDService,
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

      this.newIntervention.createur.id = user_id;
      this.newIntervention.departement.id = this.departement_id;
      this.newIntervention.service.id = this.service_id;

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
        this.getServicesByDepartementId(this.currentUser!.id)

      },
      (error) => {
        console.error('Reclamation does not exist');
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


  enterAddMode(): void {
    this.editMode = false;
    this.newIntervention = new Intervention();
  }

  enterEditMode(): void {
    this.editMode = true;
  }

}
