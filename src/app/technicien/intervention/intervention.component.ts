import { RapportService } from './../../services/rapport.service';
import { Component, OnInit } from '@angular/core';
import { InterventionDto, RapportDto, UserDto } from '../../models';
import { ActivatedRoute } from '@angular/router';
import { InterventionService } from '../../services/intervention.service';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { listSituations } from '../../agent/assets/utils/utils';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-intervention',
  standalone: true,
  imports: [DatePipe,NgIf,NgFor,NgClass,FormsModule],
  templateUrl: './intervention.component.html',
  styleUrl: './intervention.component.css'
})
export class InterventionComponent implements OnInit {

  intervention: InterventionDto = new InterventionDto();
  rapport: RapportDto = new RapportDto();
  currentUser: UserDto | null = null;
  situations = listSituations;
  showDetails: boolean = false;
  description: string = ''


  constructor(
    private interventionService : InterventionService,
    private authService: AuthService,
    private rapportService:RapportService
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

    if(!this.intervention.rapport){
      this.intervention.rapport = new RapportDto();
    }
    this.intervention.rapport.interventionId = this.intervention.id;
    this.intervention.rapport.technicien!.id = this.currentUser!.id;
    this.intervention.rapport.description = this.description;

    this.intervention.status = "Terminee";
    this.interventionService.updateIntervention(this.intervention).subscribe(
      response => {
        if(response)
        localStorage.setItem(`currentIntervention_${this.currentUser!.id}`, JSON.stringify(this.intervention));
        this.showDetails = !this.showDetails;
        console.log('intervention updated', response);
      });
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  openGoogleMaps(): void {
    const address = `${this.intervention.reclamation.ville}, ${this.intervention.reclamation.quartier}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(googleMapsUrl, '_blank');
  }


  generatePDF(intervention: InterventionDto): void {
    const doc = new jsPDF();

    // Ajouter un grand titre
    doc.setFontSize(20);
    doc.text("Rapport de l'intervention", 105, 30, { align: "center" });

    // Ajouter l'image en haut
    const imgUrl = "https://www.radeef.ma/assetsFront/images/upload/logo-dark2.jpg";
    doc.addImage(imgUrl, 'JPEG', 10, 10, 50, 20); // x, y, width, height

    // Réinitialiser la taille de la police
    doc.setFontSize(12);

    // Informations de l'intervention
    doc.text("INFORMATIONS INTERVENTION", 10, 50);
    doc.text(`N°intervention: ${intervention.reclamation.idFonctionnel}`, 10, 60);
    doc.text(`Date de création: ${intervention.createdAt}`, 120, 60);

    doc.text(`CATEGORY: ${intervention.reclamation.category}`, 10, 70);
    doc.text(`SITUATION: ${intervention.reclamation.situation}`, 10, 80);

    doc.text(`DATE DEBUT: ${intervention.dateDebut}`, 10, 90);
    doc.text(`DATE FIN: ${intervention.dateFin}`, 100, 90);

    // Informations du client
    doc.text("INFORMATIONS CLIENT", 10, 110);
    doc.text(`NOM: ${intervention.reclamation.nomClient}`, 10, 120);
    doc.text(`ADRESSE: ${intervention.reclamation.ville} ${intervention.reclamation.quartier} ${intervention.reclamation.nomRue}`, 10, 130);
    doc.text(`TELEPHONE: ${intervention.reclamation.telephone}`, 10, 140);

    // Rapport
    doc.text("RAPPORT", 10, 160);
    doc.text(`${intervention.rapport!.description}`, 10, 170);

    // Ouvrir le PDF dans une nouvelle fenêtre
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
}



}
