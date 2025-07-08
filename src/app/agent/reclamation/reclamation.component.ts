import { ReclamationService } from './../../services/reclamation.service';
import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Departement, Reclamation } from '../../../models';
import { listCategories } from '../assets/utils/utils';
import { DepartementService } from '../../services/departement.service';

@Component({
  selector: 'app-reclamation',
  standalone: true,
  imports: [NgFor,FormsModule],
  templateUrl: './reclamation.component.html',
  styleUrl: './reclamation.component.css'
})
export class ReclamationComponent implements OnInit {

  reclamations: Reclamation[] | undefined;
  newReclamation: Reclamation = new Reclamation; // Initialize the new reclamation
  categories = listCategories;
  departements: Departement[] | undefined

  gravity: any ;
  days: any ;
  occurrences: any;

  constructor(
    private reclamationService: ReclamationService,
    private departementService: DepartementService
  ) {}


  ngOnInit(): void {
    this.getReclamations();
    this.getDepartements();
  }


   /****  Service Reclamation  ****/

   addReclamation(): void {

    this.newReclamation.agent.id = 1 // id de agent
    this.newReclamation.departement.id = 1 // id de departement a partir de categorie
    // Mise à jour de la description dans newReclamation
    let newDescription = `Category: ${this.newReclamation.category}, Gravité: ${this.gravity}, Nombre de jours: ${this.days}, Nombre de fois: ${this.occurrences}, ${this.newReclamation.description}`;
    this.newReclamation.description = newDescription;

    this.reclamationService.addReclamation(this.newReclamation).subscribe(
      response => {
        console.log('Reclamation added', response);
        this.getReclamations(); // Refresh the list after adding
      },
    );
  }

  getReclamations(): void {
    this.reclamationService.getReclamations().subscribe(
      data => {
        this.reclamations = data;
        console.log(this.reclamations);
      },
    );
  }

  public getReclamationById(id: number):void{
    this.reclamationService.getReclamationById(id)
  }

  public getReclamationByFonctionel(id:number):void{
    this.reclamationService.getReclamationByFonctionnel(id)
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


  /*public scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }*/


}
