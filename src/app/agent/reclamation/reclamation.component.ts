import { ServiceDService } from './../../services/service_d.service';
import { listPeriodes, listOccurrences, listQuartiers } from './../assets/utils/utils';
import { ReclamationService } from './../../services/reclamation.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Departement, Reclamation, Service, User } from '../../models';
import { listCategories, listSituations } from '../assets/utils/utils';
import { DepartementService } from '../../services/departement.service';
import { ActivatedRoute } from '@angular/router';
import { Agent1User_id, Agent2User_id } from '../../utils';
import { getCurrentUser } from '../../localStorage';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reclamation',
  standalone: true,
  imports: [NgFor,FormsModule,NgIf],
  templateUrl: './reclamation.component.html',
  styleUrl: './reclamation.component.css'
})
export class ReclamationComponent implements OnInit {

  reclamations: Reclamation[] = [];
  newReclamation: Reclamation = new Reclamation();
  departements: Departement[] = []
  services: Service[] = []


  categories = listCategories;
  situations = listSituations;
  periodes = listPeriodes ;
  occurrences = listOccurrences;
  quartiers = listQuartiers;

  selectedDepartementId!: number;
  selectedOption: string = '';

  filteredQuartiers: string[] = this.quartiers;
  searchQuartier: string = '';

  editMode: boolean = false; // Ajout de la variable d'état pour le mode édition
  reclamationExist: boolean = true;

  currentUser: User | null = null;


  constructor(
    private reclamationService: ReclamationService,
    private departementService: DepartementService,
    private serviceDService: ServiceDService,
    private route: ActivatedRoute,
    private authService: AuthService){ }



  ngOnInit(): void {
    this.currentUser = getCurrentUser();
    console.log(this.currentUser)

    if (this.currentUser) {
      this.getDepartements();
      this.route.queryParams.subscribe(params => {

        if (params['idFonctionnel']) {
          this.newReclamation.idFonctionnel = params['idFonctionnel'];
          this.enterEditMode();
        }
      });

      this.verifyReclamation(this.newReclamation.idFonctionnel);
      console.log('Current user:', this.currentUser);

    } else {
      console.log('No user is currently logged in.');
    }

  }

  logout(): void {
    this.authService.logout();
    // Optionnel : Rediriger l'utilisateur vers la page de connexion ou d'accueil
    window.location.href = '/login'; // Remplacez '/login' par le chemin vers votre page de connexion
  }


   /****  Service Reclamation  ****/

   addReclamation(user_id:number): void {

    this.newReclamation.agent.id = user_id ;

    // Mise à jour de la description dans newReclamation
    let newDescription = `nomClient: ${this.newReclamation.nomClient},\n Email: ${this.newReclamation.email},\n Telephone: ${this.newReclamation.telephone},\n Adresse: ${this.newReclamation.pays} ${this.newReclamation.ville} ${this.newReclamation.quartier} ${this.newReclamation.nomRue},\n\n

    Category: ${this.newReclamation.category},
    Situation: ${this.newReclamation.situation},
    Periode: ${this.newReclamation.periode},
    Occurrence: ${this.newReclamation.occurrence},\n\n

    Detailles:\n${this.newReclamation.description}`;

    this.newReclamation.description = newDescription;
    this.reclamationService.addReclamation(this.newReclamation,user_id).subscribe(
      response => {
        console.log('Reclamation added', response);
      },
    );
  }


  updateReclamation(user_id:number): void {

    let newDescription = `
    nomClient: ${this.newReclamation.nomClient},\n Email: ${this.newReclamation.email},\n Telephone: ${this.newReclamation.telephone},\n Adresse: ${this.newReclamation.pays} ${this.newReclamation.ville} ${this.newReclamation.quartier} ${this.newReclamation.nomRue},\n\n

    Category: ${this.newReclamation.category},
    Situation: ${this.newReclamation.situation},
    Periode: ${this.newReclamation.periode},
    Occurrence: ${this.newReclamation.occurrence},\n\n

    Detailles:\n${this.newReclamation.description}`;

    this.newReclamation.description = newDescription;
    this.reclamationService.updateReclamation(this.newReclamation,user_id).subscribe(
      response => {
        console.log('Reclamation updated', response);
      },
    );
  }



  /*******************************/


  /****  Service Departement  ****/

  getDepartements(): void {
    this.departementService.getDepartements().subscribe(
      data => {
        this.departements = data;
        console.log(this.departements);
      },
    );
  }


    /****  Service Service  ****/

    getServicesByDepartementId(departement_id: number): void{
      this.serviceDService.getServicesByDepartementId(departement_id).subscribe(
        data => {
          this.services = data;
          console.log(this.services);
        },
      );
    }


    onDepartementChange(event: any): void {
      const departementId = event.target.value;
      if (departementId) {
        this.getServicesByDepartementId(departementId);
      } else {
        this.services = [];
      }
    }


    filterQuartiers(): void {
      this.filteredQuartiers = this.quartiers.filter(quartier =>
        quartier.toLowerCase().includes(this.searchQuartier.toLowerCase())
      );
    }

    onOptionChange(): void {
      if (this.selectedOption === 'option2') {
        this.newReclamation.pays = 'Maroc';
        this.newReclamation.ville = 'Fes';
      } else {
        this.newReclamation.pays = null;
        this.newReclamation.ville = null;
      }
    }

    verifyReclamation(idFonctionnel: string): void {
      this.reclamationService.getReclamationByIdFonctionnel(idFonctionnel).subscribe(
        (reclamation: Reclamation) => {
          this.newReclamation = reclamation;
          this.reclamationExist = true;
        },
        (error) => {
          console.error('Reclamation does not exist', error);
          this.reclamationExist = false;
        }
      );
    }

    enterAddMode(): void {
      this.editMode = false;
      this.newReclamation = new Reclamation();
    }

    enterEditMode(): void {
      this.editMode = true;
    }

}
