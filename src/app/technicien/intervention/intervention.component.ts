import { Component, OnInit } from '@angular/core';
import { Intervention, User } from '../../models';
import { ActivatedRoute } from '@angular/router';
import { InterventionService } from '../../services/intervention.service';
import { DatePipe, NgIf } from '@angular/common';
import { error } from 'jquery';
import { Technicien4User_id } from '../../utils';
import { getCurrentUser } from '../../localStorage';

@Component({
  selector: 'app-intervention',
  standalone: true,
  imports: [DatePipe,NgIf],
  templateUrl: './intervention.component.html',
  styleUrl: './intervention.component.css'
})
export class InterventionComponent implements OnInit {

  intervention: Intervention = new Intervention();
  currentUser: User | null = null;


  constructor(
    private interventionService : InterventionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUser = getCurrentUser();
    if (this.currentUser) {

      // Vérifier si l'intervention est dans le localStorage
      const storedIntervention = localStorage.getItem('currentIntervention');
      if (storedIntervention) {
        this.intervention = JSON.parse(storedIntervention);

      } else {
        console.error('intervention: ',error);
      }
      console.log('Current User:', this.currentUser);

    } else {
      console.log('No user is currently logged in.');
    }
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
        this.intervention = response;
        console.log('Reclamation updated', response);
      });
  }

  openGoogleMaps(): void {
    const address = `${this.intervention.reclamation.ville}, ${this.intervention.reclamation.quartier}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(googleMapsUrl, '_blank');
  }

}
