import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ServiceDService } from './../../services/service_d.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Service, TechnicienDto, User } from '../../models';
import { NgFor } from '@angular/common';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-gestion-service',
  standalone: true,
  imports: [NgFor,RouterLink],
  templateUrl: './gestion-service.component.html',
  styleUrl: './gestion-service.component.css'
})
export class GestionServiceComponent implements OnInit {

  techniciens : TechnicienDto[] = [];
  techniciensGrouped: TechnicienDto[][] = [];
  service !: Service;

  currentUser: User | null = null;


  constructor(
    private userService : UserService,
    private serviceDService : ServiceDService,
    private authService: AuthService,
    private router : Router)
    {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.TechniciensByServiceId(this.currentUser!.id);
      console.log('Current User:', this.currentUser);

    } else {
      console.log('No user is currently logged in.');
    }  }


  TechniciensByServiceId(user_id: number): void {
      this.serviceDService.getServicesByChefService(user_id).subscribe(
        data => {
          this.service = data;
          this.userService.getTechniciensByServiceId(data.id).subscribe(
            technicien => {
              this.techniciens = technicien;
              this.groupTechniciens();
            }
          );
        }
      );
  }

  groupTechniciens(): void {
    this.techniciensGrouped = [];
    for (let i = 0; i < this.techniciens.length; i += 2) {
      this.techniciensGrouped.push(this.techniciens.slice(i, i + 2));
    }
  }

  AllTechnicians(techniciens: TechnicienDto[]): void {
    const techniciensJson = JSON.stringify(techniciens);
    this.router.navigate(['/chefService/gestion-service/all-techniciens'], { queryParams: { techniciens: techniciensJson }});
  }


}
