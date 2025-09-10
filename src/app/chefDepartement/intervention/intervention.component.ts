import { Component, OnInit } from '@angular/core';
import { InterventionService } from '../../services/intervention.service';
import { DepartementDto, EquipeDto, InterventionDto, ReclamationDto, ServiceDto, TechnicienDto, UserDto } from '../../models';
import { FormsModule } from '@angular/forms';
import { ServiceDService } from '../../services/service_d.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReclamationService } from '../../services/reclamation.service';
import { DepartementService } from '../../services/departement.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { EquipeService } from '../../services/equipe.service';

@Component({
  selector: 'app-intervention',
  standalone: true,
  imports: [NgFor,FormsModule,NgIf,NgClass],
  templateUrl: './intervention.component.html',
  styleUrl: './intervention.component.css'
})
export class InterventionComponent implements OnInit {

  newIntervention: InterventionDto = new InterventionDto();
  services: ServiceDto[] = []
  techniciens : TechnicienDto[] = [];
  technicienParam: TechnicienDto = new TechnicienDto();
  selectedTechniciens: TechnicienDto[] = [];
  filteredTechniciens: TechnicienDto[] = [];
  equipe: EquipeDto = new EquipeDto();

  reclamationExist: boolean = false;
  dateFinEstimee!: Date | null;
  editMode: boolean = false; // Ajout de la variable d'état pour le mode édition
  selectedOption: string = '';
  technicien: UserDto = new UserDto()
  minDate: string = '';

  departement_id!:number
  service_id!: number;
  currentUser: UserDto | null = null;


  constructor(
    private interventionService: InterventionService,
    private reclamationService : ReclamationService,
    private departementService: DepartementService,
    private serviceDService : ServiceDService,
    private userService : UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private equipeService: EquipeService
  ) {}


  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.route.queryParams.subscribe(params => {
        if (params['idFonctionnel']) {
          this.newIntervention.reclamation.idFonctionnel = params['idFonctionnel'];
        }
        if (params['editMode']) {
          this.editMode = params['editMode'] === 'true'; // Convertit la chaîne en booléen
        }
      });
    const now = new Date();
    this.minDate = now.toISOString().slice(0, 16);
    this.getServicesByDepartementId(this.currentUser.id);
    this.verifyReclamation(this.newIntervention.reclamation.idFonctionnel);
    this.verifyIntervention(this.newIntervention.reclamation.idFonctionnel);
    console.log('Current User:', this.currentUser);

    } else {
      console.log('No user is currently logged in.');
    }
  }


  /****  Service Intervention  ****/

  addIntervention(): void {
    if (this.reclamationExist) {

      if (!this.newIntervention.createur) {
        this.newIntervention.createur = new UserDto();
    }
      this.newIntervention.createur.id = this.currentUser!.id;

      // Vérification et initialisation de `departement`
      if (!this.newIntervention.departement) {
        this.newIntervention.departement = new DepartementDto();
    }
      this.newIntervention.departement.id = this.departement_id;

      // Vérification et initialisation de `service`
      if (!this.newIntervention.service) {
        this.newIntervention.service = new ServiceDto();
    }
      this.newIntervention.service.id = this.service_id;


      if (this.selectedOption === 'option1') {
        if (!this.newIntervention.technicien) {
            this.newIntervention.technicien = new TechnicienDto();
        }
        this.newIntervention.technicien!.id = this.technicien.id;
        this.newIntervention.equipe = null;
    } else if (this.selectedOption === 'option2') {
        this.equipe.techniciens = this.selectedTechniciens;
        this.newIntervention.equipe = this.equipe;
        this.newIntervention.technicien = null;
    }

      this.interventionService.addIntervention(this.newIntervention,this.currentUser!.id).subscribe(
        response => {
          console.log('Intervention added', response);
          // Optionally navigate away or show a success message
        },
      );
    } else {
      console.error('Cannot add intervention, reclamation does not exist');
    }
  }

  updateIntervention(): void {

    if (this.selectedOption === 'option1') {
      if (!this.newIntervention.technicien) {
        this.newIntervention.technicien = new TechnicienDto();
    }
      this.newIntervention.technicien!.id = this.technicien.id
      this.newIntervention.equipe = null;
    }

    if(this.selectedOption === 'option2'){
      this.equipe.techniciens = this.selectedTechniciens
      this.newIntervention.equipe = this.equipe;
      this.newIntervention.technicien = null;
    }

    this.interventionService.updateIntervention(this.newIntervention).subscribe(
      response => {
        console.log('Intervention updated', response);
      },
    );
  }


  /****  Service Service  ****/
  getServicesByDepartementId(user_id: number): void{
    this.departementService.getByChefDepartement(user_id).subscribe(departement =>{
      this.departement_id = departement.id;
      this.serviceDService.getServicesByDepartementId(departement.id).subscribe(
        data => {
          console.log("departement",departement)
          console.log("data",data)
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
      (reclamation) => {
        console.log(reclamation)
        this.newIntervention.reclamation = reclamation;
        this.reclamationExist = true;
      },
      (error) => {
        console.log('Reclamation does not exist', error);
        this.reclamationExist = false;
      }
    );
  }

  verifyIntervention(idFonctionnel: string): void {
    this.interventionService.getInterventionsByIdFonctionnel(idFonctionnel).subscribe(
      (intervnetion) => {
        this.newIntervention = intervnetion;

        if(intervnetion.equipe){
          this.equipe = intervnetion.equipe;
        }
        this.reclamationExist = true;
      },
      (error) => {
        console.log('Intervention does not exist', error);
        this.reclamationExist = false;
      }
    );
  }


  enterAddMode(): void {
    this.editMode = false;
    this.newIntervention = new InterventionDto();
  }

  enterEditMode(): void {
    this.editMode = true;
  }

   // Méthode pour gérer le changement de chef d'équipe
   onChefEquipeChange(event: Event): void {
    const selectedChefId = +(event.target as HTMLSelectElement).value;
    // Filtrer les techniciens disponibles en excluant le chef d'équipe sélectionné
    this.filteredTechniciens = this.techniciens.filter(t => t.id !== selectedChefId);
    }

  addTechnicien(event: Event): void {
    const selectedId = +(event.target as HTMLSelectElement).value;
    const selectedTechnicien = this.techniciens.find(t => t.id === selectedId);

    if (selectedTechnicien && !this.selectedTechniciens.includes(selectedTechnicien)) {
      this.selectedTechniciens.push(selectedTechnicien);
    }
  }

  removeTechnicien(technicien: TechnicienDto): void {
    this.selectedTechniciens = this.selectedTechniciens.filter(t => t.id !== technicien.id);
  }

  resetSelection(): void {
    this.selectedTechniciens = [];
    this.filteredTechniciens = this.techniciens;
    this.currentStep = 1;

  }

  onOptionChange(): void {
    if (this.selectedOption === 'option1') {
      this.filteredTechniciens = this.techniciens;
    }
  }


    currentStep: number = 1;

  // Méthodes pour changer d'étape
  nextStep() {
    if (this.currentStep < 4 && this.canProceedToNextStep()) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Méthode pour vérifier si on peut passer à l'étape suivante
  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!this.newIntervention.reclamation.idFonctionnel && this.reclamationExist;
      case 2:
        return  true/*!!this.newIntervention.titre && !!this.newIntervention.dateDebut && !!this.newIntervention.dateFin;*/
      case 3:
        if (this.selectedOption === 'option1') {
          return !!this.technicien.id;
        } else if (this.selectedOption === 'option2') {
          return !!this.equipe.nom && !!this.equipe.chefEquipe?.id;
        }
        return false;
      case 4:
        return !!this.newIntervention.description;
      default:
        return false;
    }
  }

}
