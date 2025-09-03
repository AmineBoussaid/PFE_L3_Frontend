import { Component, OnInit } from '@angular/core';
import { InterventionDto, ServiceDto, UserDto } from '../../models';
import { InterventionService } from '../../services/intervention.service';
import { Chart, registerables } from 'chart.js';
import { NgClass, NgFor } from '@angular/common';
import { DepartementService } from '../../services/departement.service';
import { AuthService } from '../../services/auth.service';
import { ServiceDService } from '../../services/service_d.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor,NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  interventions: InterventionDto[] = [];
  interventionsByService: InterventionDto[] = []; // Liste des interventions filtrées par service
  totalIntervnetions: number = 0;
  enAttente: number = 0;
  enCours: number = 0;
  terminees: number = 0;
  annulees: number = 0;
  years: number[] = [];
  selectedYear: number = new Date().getFullYear() ;
  monthlyChart: any;
  quartierChart: any;
  selectedServiceId!: number ; // Variable pour stocker l'ID du service sélectionné

  currentUser: UserDto | null = null;
  services: ServiceDto[] = [];


  constructor(private interventionService: InterventionService,
              private departementService: DepartementService,
              private serviceDService: ServiceDService,

              private authService: AuthService)
              {
                Chart.register(...registerables);
              }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
      if (this.currentUser) {
        this.getServices(this.currentUser!.id);
        this.getYears();
        this.getIntervnetion(this.currentUser!.id);
        console.log('Current User:', this.currentUser);

      } else {
        console.log('No user is currently logged in.');
      }
  }


  getIntervnetion(user_id : number): void {
    this.departementService.getByChefDepartement(user_id).subscribe(departement => {
      this.interventionService.getInterventionsByDepartementId(departement.id).subscribe(reponse => {
        this.interventions = reponse;
        this.filterInterventionsByService(); // Appliquer le filtrage lors du chargement initial
      })
    });
  }

  getServices(user_id: number): void {
    this.departementService.getByChefDepartement(user_id).subscribe(departement => {
      this.serviceDService.getServicesByDepartementId(departement.id).subscribe(
        data => {
          this.services = data;
          if (this.services.length > 0) {
            this.selectedServiceId = this.services[0].id; // Sélectionner le premier service par défaut
          }
        });
    });
  }

  filterInterventionsByService(): void {
    // Filtrer les interventions par service sélectionné
    if (this.selectedServiceId) {
      this.interventionsByService = this.interventions.filter(intervention =>
        intervention.service && intervention.service.id === this.selectedServiceId
      );
    } else {
      this.interventionsByService = this.interventions;
    }
    this.calculateStatistics(); // Recalculer les statistiques après le filtrage
    this.updateChart();
    this.renderCharts(); // Recalculer les graphiques après le filtrage
  }

  onServiceChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedServiceId = parseInt(target.value);;
    this.filterInterventionsByService();
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
    this.totalIntervnetions = this.interventionsByService.length;
    this.enAttente = this.interventionsByService.filter(r => r.status === 'En attente').length;
    this.enCours = this.interventionsByService.filter(r => r.status === 'En cours').length;
    this.terminees = this.interventionsByService.filter(r => r.status === 'Terminer').length;
    this.annulees = this.interventionsByService.filter(r => r.status === 'Annulee').length;
  }

  getQuartierData() {
    const QuartierMap = new Map<string, number>();
    this.interventionsByService.forEach(intervention => {
      if (intervention.reclamation.quartier) {
        const quartier = intervention.reclamation.quartier;
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

    this.interventionsByService.forEach(intervention => {
      if (intervention.createdAt) {
        const date = new Date(intervention.createdAt);
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
    const quartierData = this.getQuartierData();
    if (this.monthlyChart) {
      this.monthlyChart.data.datasets[0].data = Object.values(monthlyData);
      this.monthlyChart.data.datasets[0].label = `Interventions par Mois (${this.selectedYear})`;
      this.monthlyChart.update();
    }
    if (this.quartierChart) {
      this.quartierChart.data.datasets[0].data = Object.values(quartierData);
      this.quartierChart.data.labels = Object.keys(quartierData);
      this.quartierChart.update();
    }
  }

  renderCharts() {
    const QuartierData = this.getQuartierData();
    const monthlyData = this.getMonthlyData();

    const ctxQuartier = (document.getElementById('QuartierChart') as HTMLCanvasElement)?.getContext('2d');
    if (ctxQuartier) {
      this.quartierChart = new Chart(ctxQuartier, {
        type: 'doughnut',
        data: {
          labels: Object.keys(QuartierData),
          datasets: [{
            label: 'interventions',
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
              text: 'Interventions par Quartier'
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
            label: `Interventions par Mois (${this.selectedYear})`,
            data: Object.values(monthlyData),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`;
                }
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

}

