import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { InterventionService } from '../../services/intervention.service';
import { InterventionDto, UserDto } from '../../models';
import { NgFor } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../../menu/header/header.component';
import { SidebarComponent } from '../../menu/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor,HeaderComponent,SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  intervnetions: InterventionDto[] = [];
  totalIntervnetions: number = 0;
  enAttente: number = 0;
  enCours: number = 0;
  terminees: number = 0;
  years: number[] = [];
  selectedYear: number = new Date().getFullYear() ;
  monthlyChart: any;

  currentUser: UserDto | null = null;
  service_id!: number


  constructor(private interventionService: InterventionService,
    private authService: AuthService
  )
              {
                Chart.register(...registerables);
              }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.getYears();
      this.getIntervnetion(this.currentUser!.id);
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

  getIntervnetion(user_id : number): void {
    this.interventionService.getInterventionsByTechnicienId(user_id).subscribe(reponse => {
      this.intervnetions = reponse;
      this.calculateStatistics();
      this.renderCharts();
    });
  }

  getYears(): void {
    const currentYear = new Date().getFullYear();
    this.years.push(currentYear);

    // Add the range of years including the current year
    for (let i = currentYear; i >= currentYear - 5; i--) {
      if (!this.years.includes(i)) {
        this.years.push(i);
      }
    }
  }

  onYearChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedYear = parseInt(target.value);
    this.updateChart();
  }

  calculateStatistics(): void {
    this.totalIntervnetions = this.intervnetions.length;
    this.enAttente = this.intervnetions.filter(r => r.status === 'En attente').length;
    this.enCours = this.intervnetions.filter(r => r.status === 'En cours').length;
    this.terminees = this.intervnetions.filter(r => r.status === 'Terminer').length;
  }

  getQuartierData() {
    const QuartierMap = new Map<string, number>();
    this.intervnetions.forEach(Intervnetion => {
      if (Intervnetion.reclamation.quartier) {
        const quartier = Intervnetion.reclamation.quartier;
        QuartierMap.set(quartier, (QuartierMap.get(quartier) || 0) + 1);
      }
    });

    const QuartierData: any = {};
    QuartierMap.forEach((value, key) => {
      QuartierData[key] = value;
    });

    return QuartierData;
  }


  getMonthlyData(): any {
    const monthlyMap = new Map<string, number>([
      ['janv.', 0], ['févr.', 0], ['mars', 0], ['avr.', 0], ['mai', 0], ['juin', 0],
      ['juil.', 0], ['août', 0], ['sept.', 0], ['oct.', 0], ['nov.', 0], ['déc.', 0]
    ]);

    this.intervnetions.forEach(Intervnetion => {
      if (Intervnetion.createdAt) {
        const date = new Date(Intervnetion.createdAt);
        const year = date.getFullYear();
        if (year === this.selectedYear) {
          const month = date.toLocaleString('fr-FR', { month: 'short' });
          monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);
        }
      }
    });

    const monthlyData: any = {};
    monthlyMap.forEach((value, key) => {
      monthlyData[key] = value;
    });

    return monthlyData;
  }

  updateChart(): void {
    const monthlyData = this.getMonthlyData();
    if (this.monthlyChart) {
      this.monthlyChart.data.datasets[0].data = Object.values(monthlyData);
      this.monthlyChart.data.datasets[0].label = `Réclamations par Mois (${this.selectedYear})`;
      this.monthlyChart.update();
    }
  }



renderCharts() {
  const QuartierData = this.getQuartierData();
  const monthlyData = this.getMonthlyData();

  const ctxQuartier = (document.getElementById('QuartierChart') as HTMLCanvasElement)?.getContext('2d');
  if (ctxQuartier) {
    new Chart(ctxQuartier, {
      type: 'doughnut',
      data: {
        labels: Object.keys(QuartierData),
        datasets: [{
          label: 'intervnetions',
          data: Object.values(QuartierData),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'intervnetions by Quartier'
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              }
            }
          }
        },
        cutout: '5%'
      }
    });
  }

  const ctxMonthly = (document.getElementById('MonthlyChart') as HTMLCanvasElement)?.getContext('2d');
  if (ctxMonthly) {
    this.monthlyChart = new Chart(ctxMonthly, {
      type: 'line',
      data: {
        labels: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
        datasets: [{
          label: `Intervention par Mois (${this.selectedYear})`,
          data: Object.values(monthlyData),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Diagramme des Interventions '
          }
        },
        scales: {
          y: {
            beginAtZero: true,
          }
        }
      }
    });
  }

}


}
