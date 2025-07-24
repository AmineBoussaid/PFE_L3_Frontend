import { Component, OnInit } from '@angular/core';
import { ReclamationService } from '../../services/reclamation.service';
import { Reclamation } from '../../../models';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})
export class HistoriqueComponent  implements OnInit{

  reclamations: Reclamation[] = [];


  constructor(
    private reclamationService: ReclamationService,
  ) { }

  agent_id:number = 2
  ngOnInit(): void {
    this.getReclamationByAgentId(this.agent_id);
  }

  getReclamationByAgentId(agent_id : number): void {
    this.reclamationService.getReclamationByAgentId(agent_id).subscribe(
      data => {
        this.reclamations = data;
        console.log(this.reclamations);
      },
    );
  }

}
