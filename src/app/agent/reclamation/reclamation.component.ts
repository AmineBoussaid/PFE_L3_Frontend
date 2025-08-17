import { ClientService } from './../../services/client.service';
import { ServiceDService } from './../../services/service_d.service';
import { listPeriodes, listOccurrences, listQuartiers } from './../assets/utils/utils';
import { ReclamationService } from './../../services/reclamation.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Client, Departement, Reclamation, Service, User } from '../../models';
import { listCategories, listSituations } from '../assets/utils/utils';
import { DepartementService } from '../../services/departement.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../../menu/header/header.component';
import { SidebarComponent } from '../../menu/sidebar/sidebar.component';

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
  departements: Departement[] = [];
  services: Service[] = [];
  client: Client = new Client();

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
  codeExist: boolean = false;
  codeAbonnement: string = '';


  constructor(
    private reclamationService: ReclamationService,
    private departementService: DepartementService,
    private serviceDService: ServiceDService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private clientService: ClientService) {}


  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
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
  verifyCode(codeAbonnement: string): void {
    this.clientService.getByCodeAbonnement(codeAbonnement).subscribe(
      (response) => {
        this.client = response;
        this.codeExist = true;
        console.log(this.client);
        // Optional: Open a new window or display a modal with client details
        this.openClientDetailsWindow();
      },
      (error) => {
        console.error('Client does not exist', error);
        this.codeExist = false;
      }
    );
  }

  openClientDetailsWindow(): void {
    const clientDetails = `
      Nom: ${this.client.nomClient}\n
      Code Abonnement: ${this.client.codeAbonnement}\n
      Adresse: ${this.client.pays} ${this.client.ville} ${this.client.quartier} ${this.client.nomRue}
    `;
    window.alert(clientDetails); // Use a modal for better UI
  }


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
