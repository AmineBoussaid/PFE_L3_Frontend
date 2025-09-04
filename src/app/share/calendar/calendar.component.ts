import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { InterventionService } from './../../services/intervention.service';
import { InterventionDto, UserDto } from '../../models';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {

  @ViewChild(FullCalendarComponent) fullCalendar!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin, resourceTimeGridPlugin],
    initialView: 'dayGridMonth',
    locale: 'fr',
    events: [] // Initialiser comme tableau vide
  };

  intervnetions:InterventionDto[]=[];
  id:number = 0;
  totalIntervnetions: number = 0;
  enCours: number = 0;
  enCoursEquipe: number = 0;
  enCoursSolo: number = 0;
  terminees: number = 0;
  annulees: number = 0;


  constructor(
    private interventionService: InterventionService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if(params["technicienId"]){
        this.id = params["technicienId"]
        console.log(params["technicienId"])

        this.getIntervention(this.id)
      }
    })
    if(this.id == 0){
      let currentUser!: UserDto | null
      currentUser = this.authService.getCurrentUser();
      console.log(currentUser)

      this.getIntervention(currentUser!.id)
    }
  }


  getIntervention(id:number){
    this.interventionService.getInterventionsByTechnicienId(id).subscribe(
      (data: InterventionDto[]) => {
        this.intervnetions = data;
        this.populateEvents(data); // Mettez à jour les événements après avoir récupéré les données
        this.calculateStatistics();
      },
      error => {
        console.error('Erreur lors du chargement des interventions', error);
      }
    );
  }

  calculateStatistics(): void {
    this.totalIntervnetions = this.intervnetions.length;

    this.enCoursEquipe = this.intervnetions.filter(r => r.status === 'En cours' && r.equipe != null && r.technicien == null).length;

    this.enCoursSolo = this.intervnetions.filter(r => r.status === 'En cours' && r.technicien != null && r.equipe == null).length;

    this.terminees = this.intervnetions.filter(r => r.status === 'Terminee').length;

    this.annulees = this.intervnetions.filter(r => r.status === 'Annulee').length;
  }


  ngAfterViewInit() {
    // Assurez-vous que le calendrier est correctement initialisé
    if (this.fullCalendar) {
      this.fullCalendar.getApi().addEventSource(this.calendarOptions.events || []);
    }
  }

  private populateEvents(interventions: InterventionDto[]): void {
    const events: EventInput[] = interventions
      .map(interv => {
        const start = interv.dateDebut ? new Date(interv.dateDebut).toISOString() : undefined;
        const end = interv.dateFin ? new Date(interv.dateFin).toISOString() : undefined;

        // Ne pas ajouter les événements avec des dates undefined
        if (start && end) {
          return {
            title: `${interv.reclamation.ville} ${interv.reclamation.quartier} ${interv.reclamation.nomRue}` || 'No Title',
            start: start,
            end: end,
            backgroundColor: interv.status === "Terminee" ? 'green' : (interv.technicien ? '' : '#FF9103'), // Vert si terminé, sinon appliquer la couleur orange selon la condition
            borderColor: 'black',
            extendedProps: {
              technicien: interv.technicien ? `${interv.technicien.username} ${interv.technicien.description}` : 'Aucun technicien',
              description: interv.description || 'Pas de description disponible',
              // Ajoutez d'autres propriétés si nécessaire
              status: interv.status,
            }
          } as EventInput;
        }
        return null; // Filtrer les événements invalides
      })
      .filter((event): event is EventInput => event !== null); // Filtrer les événements nuls et utiliser un type garde

    console.log('Events:', events);

    // Mettre à jour les options du calendrier avec les événements
    this.calendarOptions.events = events; // Mettez à jour les options du calendrier

    if (this.fullCalendar) {
      // Reconfigurer le calendrier après la mise à jour des options
      this.fullCalendar.getApi().removeAllEvents(); // Nettoyer les événements existants
      this.fullCalendar.getApi().addEventSource(this.calendarOptions.events); // Utiliser le tableau d'événements mis à jour
    }
  }


}

