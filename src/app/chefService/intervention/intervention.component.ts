import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EquipeDto, ServiceDto, TechnicienDto, UserDto, InterventionDto, ReclamationDto, DepartementDto } from '../../models';
import { InterventionService } from '../../services/intervention.service';
import { ReclamationService } from '../../services/reclamation.service';
import { ActivatedRoute } from '@angular/router';
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
  newReclamation: ReclamationDto = new ReclamationDto();
  services: ServiceDto[] = []
  techniciens : TechnicienDto[] = [];
  technicienParam: TechnicienDto = new TechnicienDto();
  selectedTechniciens: TechnicienDto[] = [];
  filteredTechniciens: TechnicienDto[] = [];
  equipe: EquipeDto = new EquipeDto();


  reclamationExist: boolean = true;
  dateFinEstimee!: Date | null;
  editMode: boolean = false; // Ajout de la variable d'état pour le mode édition
  selectedOption: string = '';
  technicien: TechnicienDto = new TechnicienDto()
  minDate: string = '';

  currentUser!: UserDto | null;

  constructor(
    private interventionService: InterventionService,
    private reclamationService : ReclamationService,
    private userService : UserService,
    private route: ActivatedRoute,
    private authService: AuthService)
    {}


  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser) {
      console.log(this.currentUser)
      this.route.queryParams.subscribe(params => {

        if (params['idFonctionnel']) {
          this.newIntervention.reclamation.idFonctionnel = params['idFonctionnel'];
        }
        if (params['editMode']) {
          this.editMode = params['editMode'] === 'true'; // Convertit la chaîne en booléen
        }
        if (params['technicien']) {
          try {
            this.technicienParam  = JSON.parse(params['technicien']);
            this.selectedOption = 'option1'
            console.log(this.technicienParam);
          } catch (log) {
            alert("Erreur lors du parsing de technicien");
          }
        }
      });
      const now = new Date();
      this.minDate = now.toISOString().slice(0, 16);
      this.verifyReclamation(this.newIntervention.reclamation.idFonctionnel)
      this.verifyIntervention(this.newIntervention.reclamation.idFonctionnel)
    } else {
      console.log('No user is currently logged in.');
    }
  }

  /****  Service Intervention  ****/

  addIntervention(): void {
    if (this.reclamationExist) {
        // Vérification et initialisation de `createur`

        if (!this.newIntervention.createur) {
            this.newIntervention.createur = new UserDto();
        }
        this.newIntervention.createur.id = this.currentUser!.id;

        // Vérification et initialisation de `departement`
        if (!this.newIntervention.departement) {
            this.newIntervention.departement = new DepartementDto();
        }
        this.newIntervention.departement.id = this.newReclamation.service.departement.id;

        // Vérification et initialisation de `service`
        if (!this.newIntervention.service) {
            this.newIntervention.service = new ServiceDto();
        }
        this.newIntervention.service.id = this.newReclamation.service.id;

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

        this.interventionService.addIntervention(this.newIntervention, this.currentUser!.id).subscribe(
            response => {
                console.log('Intervention added', response);
                // Optionally navigate away or show a success message
            },
        );
    } else {
        console.log('Cannot add intervention, reclamation does not exist');
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

    this.interventionService.updateIntervention(this.newIntervention,this.currentUser!.id).subscribe(
      response => {
        console.log('Intervention updated', response);
      },
    );
  }


  verifyReclamation(idFonctionnel: string): void {
    this.reclamationService.getReclamationByIdFonctionnel(idFonctionnel).subscribe(
      (reclamation) => {
        console.log(reclamation)
        this.newReclamation = reclamation
        this.newIntervention.reclamation = reclamation;
        this.reclamationExist = true;
        this.TechniciensByServiceId(reclamation.service.id)
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
        this.TechniciensByServiceId(intervnetion.service.id)
      },
      (error) => {
        console.log('Intervention does not exist', error);
        this.reclamationExist = false;
      }
    );
  }

  TechniciensByServiceId(serviceId: number): void {
    this.userService.getTechniciensByServiceId(serviceId).subscribe(data => {
      this.techniciens = data;
      this.filteredTechniciens = this.techniciens;
    });
  }

  enterAddMode(): void {

    this.editMode = false;
    this.newIntervention = new InterventionDto();
  }

  enterEditMode(): void {
    this.editMode = true;
    this.filteredTechniciens = this.techniciens;
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
        return !!this.newIntervention.titre && !!this.newIntervention.dateDebut && !!this.newIntervention.dateFin;
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
