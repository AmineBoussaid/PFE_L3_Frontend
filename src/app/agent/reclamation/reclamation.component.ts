import { ClientService } from './../../services/client.service';
import { ServiceDService } from './../../services/service_d.service';
import { ReclamationService } from './../../services/reclamation.service';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientDto, DepartementDto, ReclamationDto, ServiceDto, UserDto } from '../../models';
import { listCategories, listOccurrences, listPeriodes, listQuartiers, listSituations } from '../assets/utils/utils';
import { DepartementService } from '../../services/departement.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reclamation',
  standalone: true,
  imports: [NgFor,FormsModule,NgIf],
  templateUrl: './reclamation.component.html',
  styleUrl: './reclamation.component.css'
})
export class ReclamationComponent implements OnInit {

  reclamations: ReclamationDto[] = [];
  newReclamation: ReclamationDto = new ReclamationDto();
  departements: DepartementDto[] = [];
  services: ServiceDto[] = [];
  service: ServiceDto = new ServiceDto();
  client: ClientDto = new ClientDto();

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
  currentUser: UserDto | null = null;
  codeExist: boolean = false;
  codeAbonnement: string = '';
  idFonctionnel: string = '';
  showDetails: boolean = false;


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

   addReclamation(): void {

    if(!this.newReclamation.agent) {
        this.newReclamation.agent = new UserDto();
    }
    this.newReclamation.agent!.id = this.currentUser!.id;

    if(!this.newReclamation.service) {
      this.newReclamation.service = new ServiceDto();
    }
    this.newReclamation.service.id = this.service.id;

    if (this.selectedOption === 'option2') {
      this.newReclamation.codeAbonnement = null;
    } else {
      this.newReclamation.codeAbonnement = this.codeAbonnement;
    }

    this.reclamationService.addReclamation(this.newReclamation).subscribe(
      (response: string) => {
        this.idFonctionnel = response;
        console.log('Réclamation ajoutée avec idFonctionnel:', this.idFonctionnel);
        this.showDetails = !this.showDetails;
      },
    );
  }


  updateReclamation(): void {

    if(!this.newReclamation.agent) {
      this.newReclamation.agent = new UserDto();
    }
    this.newReclamation.agent!.id = this.currentUser!.id;

    if(!this.newReclamation.service) {
      this.newReclamation.service = new ServiceDto();
    }
    this.newReclamation.service.id = this.service.id;

    if (this.selectedOption === 'option2') {
      this.newReclamation.codeAbonnement = null;
    } else {
      this.newReclamation.codeAbonnement = this.codeAbonnement;
    }
    this.newReclamation.description
    this.reclamationService.updateReclamation(this.newReclamation).subscribe(
      response => {
        console.log('Reclamation updated', response);
      },
    );
  }

  closeDetails() {
    this.showDetails = false;
  }



  /*******************************/
  verifyCode(codeAbonnement: string): void {
    this.clientService.getByCodeAbonnement(codeAbonnement).subscribe(
      (response) => {
        if(response.codeAbonnement != null){
          this.client = response;
          this.codeExist = true;
          console.log(this.client);
          // Optional: Open a new window or display a modal with client details
          this.openClientDetailsWindow();
        }
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
      Adresse: ${this.client.pays} ${this.client.ville} ${this.client.quartier} ${this.client.nomRue}\n
      Code Postal: ${this.client.codePostal}
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
        this.newReclamation.codeAbonnement = null;
      } else {
        this.newReclamation.pays = null;
        this.newReclamation.ville = null;
        this.newReclamation.codeAbonnement = this.codeAbonnement;
      }
    }

    verifyReclamation(idFonctionnel: string): void {
      this.reclamationService.getReclamationByIdFonctionnel(idFonctionnel).subscribe(
        (reclamation: ReclamationDto) => {
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
      this.newReclamation = new ReclamationDto();
    }

    enterEditMode(): void {
      this.editMode = true;
    }

}
