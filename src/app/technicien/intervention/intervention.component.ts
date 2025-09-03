import { Component, OnInit } from '@angular/core';
import { InterventionDto, UserDto } from '../../models';
import { ActivatedRoute } from '@angular/router';
import { InterventionService } from '../../services/intervention.service';
import { DatePipe, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-intervention',
  standalone: true,
  imports: [DatePipe,NgIf],
  templateUrl: './intervention.component.html',
  styleUrl: './intervention.component.css'
})
export class InterventionComponent implements OnInit {

  intervention: InterventionDto = new InterventionDto();
  currentUser: UserDto | null = null;


  constructor(
    private interventionService : InterventionService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {

      const storedIntervention = localStorage.getItem(`currentIntervention_${this.currentUser!.id}`);
      if (storedIntervention) {
        this.intervention = JSON.parse(storedIntervention);

      } else {
        console.error('intervention:');
      }
      console.log('Current User:', this.currentUser);

    } else {
      console.log('No user is currently logged in.');
    }
  }

  logout(): void {
    this.authService.logout();
    // Optionnel : Rediriger l'utilisateur vers la page de connexion ou d'accueil
    window.location.href = '/login'; // Remplacez '/login' par le chemin vers votre page de connexion
  }

  loadIntervention(id: number): void {
    this.interventionService.getInterventionById(id).subscribe(intervention => {
      this.intervention = intervention;
    });
  }

  ChangeStatus(user_id:number): void{
    this.intervention.status = "Terminer";
    this.interventionService.updateIntervention(this.intervention,user_id).subscribe(
      response => {
        if(response)
        this.intervention = response;
        console.log('intervention updated', response);
      });
  }

  openGoogleMaps(): void {
    const address = `${this.intervention.reclamation.ville}, ${this.intervention.reclamation.quartier}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(googleMapsUrl, '_blank');
  }

}
