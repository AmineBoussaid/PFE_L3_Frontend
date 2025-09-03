import { EquipeService } from './../../services/equipe.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ServiceDService } from './../../services/service_d.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { EquipeDto, ServiceDto, TechnicienDto, UserDto } from '../../models';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-gestion-service',
  standalone: true,
  imports: [NgFor,NgIf,RouterLink],
  templateUrl: './gestion-service.component.html',
  styleUrl: './gestion-service.component.css'
})
export class GestionServiceComponent implements OnInit {

  techniciens : TechnicienDto[] = [];
  equipes : EquipeDto[] = [];

  techniciensGrouped: TechnicienDto[][] = [];
  equipesGrouped: EquipeDto[][] = [];
  service : ServiceDto = new ServiceDto();

  currentUser: UserDto | null = null;


  constructor(
    private userService : UserService,
    private serviceDService : ServiceDService,
    private authService: AuthService,
    private equipeService: EquipeService,
    private router : Router)
    {}


  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {

      this.serviceDService.getServicesByChefService(this.currentUser.id).subscribe(
        data => {
          this.service = data;
          this.TechniciensByServiceId(this.service.id);
          this.EquipesByServiceId(this.service.id)
      })

      console.log('Current User:', this.currentUser);

    } else {
      console.log('No user is currently logged in.');
    }
  }

  TechniciensByServiceId(user_id: number): void {
   this.userService.getTechniciensByServiceId(user_id).subscribe(
    technicien => {
      this.techniciens = technicien;
      this.groupTechniciens();
    }
    );
  }

  EquipesByServiceId(service_id: number): void {
    this.equipeService.getEquipeByService(service_id).subscribe(
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


  AllTechnicians(techniciens: TechnicienDto[]): void {
    const techniciensJson = JSON.stringify(techniciens);
    this.router.navigate(['/chefService/gestion-service/all-techniciens'], { queryParams: { techniciens: techniciensJson }});
  }

  AllEquipes(equipes: EquipeDto[]): void {
    const equipesJson = JSON.stringify(equipes);
    this.router.navigate(['/chefService/gestion-service/all-equipes'], { queryParams: { equipes: equipesJson }});
  }


}
