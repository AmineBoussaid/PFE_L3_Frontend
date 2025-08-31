import { DepartementService } from './../../services/departement.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EquipeDto, ServiceDto, TechnicienDto, UserDto } from '../../models';
import { UserService } from '../../services/user.service';
import { ServiceDService } from '../../services/service_d.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EquipeService } from '../../services/equipe.service';

@Component({
  selector: 'app-gestion-departement',
  standalone: true,
  imports: [NgFor,NgIf,NgClass],
  templateUrl: './gestion-departement.component.html',
  styleUrl: './gestion-departement.component.css'
})
export class GestionDepartementComponent implements OnInit {
  techniciens: TechnicienDto[] = [];
  equipes : EquipeDto[] = [];

  techniciensGrouped: TechnicienDto[][] = [];
  equipesGrouped: EquipeDto[][] = [];

  services: ServiceDto[] = [];

  currentUser: UserDto | null = null;
  selectedServiceId!: number ; // Variable pour stocker l'ID du service sélectionné

  constructor(
    private userService: UserService,
    private departementService: DepartementService,
    private serviceDService: ServiceDService,
    private authService: AuthService,
    private equipeService: EquipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.getServices(this.currentUser!.id);
      console.log('Current User:', this.currentUser);
    } else {
      console.log('No user is currently logged in.');
    }
  }

  getServices(user_id: number): void {
    this.departementService.getByChefDepartement(user_id).subscribe(departement => {
      this.serviceDService.getServicesByDepartementId(departement.id).subscribe(
        data => {
          this.services = data;
          if (this.services.length > 0) {
            this.selectedServiceId = this.services[0].id; // Sélectionner le premier service par défaut
            this.TechniciensByServiceId(this.selectedServiceId);
            this.EquipesByServiceId(this.selectedServiceId)
          }
        });
    });
  }

  TechniciensByServiceId(serviceId: number): void {
    this.selectedServiceId = serviceId; // Mettre à jour l'ID du service sélectionné
    this.userService.getTechniciensByServiceId(serviceId).subscribe(
      data => {
        this.techniciens = data;
        this.groupTechniciens();
      });
  }

  EquipesByServiceId(serviceId: number): void {
    this.selectedServiceId = serviceId; // Mettre à jour l'ID du service sélectionné
    this.equipeService.getEquipeByService(serviceId).subscribe(
      equipes => {
        this.equipes = equipes;
        this.groupEquipes();
      }
    );
  }

  groupTechniciens(): void {
    this.techniciensGrouped = [];
    for (let i = 0; i < this.techniciens.length; i += 2) {
      this.techniciensGrouped.push(this.techniciens.slice(i, i + 2));
    }
  }

  groupEquipes(): void {
    this.equipesGrouped = [];
    for (let i = 0; i < this.equipes.length; i += 2) {
      this.equipesGrouped.push(this.equipes.slice(i, i + 2));
    }
  }

  getSelectedService(): ServiceDto | null {
    const selectedService = this.services.find(service => service.id === this.selectedServiceId);
    return selectedService || null; // Retourne le service trouvé ou null si aucun service n'est trouvé
  }


  AllTechnicians(techniciens: TechnicienDto[], selectedServiceId: number): void {
    const techniciensJson = JSON.stringify(techniciens);
    this.router.navigate(['/chefDepartement/gestion-departement/all-techniciens'], {
      queryParams: {
        techniciens: techniciensJson,
        service_id: selectedServiceId // Ajout de l'ID du service aux paramètres de requête
      }
    });
  }

  AllEquipes(equipes: EquipeDto[], selectedServiceId:number): void {
    const equipesJson = JSON.stringify(equipes);
    this.router.navigate(['/chefDepartement/gestion-departement/all-equipes'], { queryParams: {
      equipes: equipesJson ,
      service_id: selectedServiceId // Ajout de l'ID du service aux paramètres de requête
      }
    });
  }


}



