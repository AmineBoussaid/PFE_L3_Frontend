export class UserDto {
  id!: number;
  username!: string | null;
  email!: string | null;
  role!: string | null;
  createdAt!: string | null;
  lastLogin!: string | null;
  description!: string | null;

  // Parameterless constructor
  constructor();

  // Constructor with parameters
  constructor(id?: number, username?: string, email?: string, role?: string,createdAt?: string,lastLogin?: string, description?: string) {
    this.id = id ?? 0;
    this.username = username ?? null;
    this.email = email ?? null;
    this.role = role ?? null;
    this.createdAt = createdAt ?? null;
    this.lastLogin = lastLogin ?? null;
    this.description = description ?? null;
  }
}


export class UserHistoriqueDto {
  id!: number;
  user!: UserDto;
  createdAt!: string | null;
  action!: string | null;
  details!: string | null;
  ipAddress!: string | null;

  // Parameterless constructor
  constructor();

  // Constructor with parameters
  constructor(id?: number, user?: UserDto,createdAt?: string, action?: string, details?: string, ipAddress?: string) {
    this.id =id  ?? 0;
    this.user = user  ?? new UserDto();
    this.createdAt = createdAt ?? null;
    this.action = action  ?? null;
    this.details = details  ?? null;
    this.ipAddress = ipAddress  ?? null;
  }
}


export class TechnicienDto {
  id !: number;
  username!: string | null;
  email!: string | null;
  description!: string | null;
  service !: ServiceDto | null;


// Parameterless constructor
  constructor();

// Constructor with parameters
  constructor(userId?: number, username?: string,email?: string, service?: ServiceDto, description?: string) {
    this.id = userId ?? 0;
    this.username = username ?? null;
    this.email = email ?? null;
    this.service = service ?? null;
    this.description = description ?? null;

  }
}


export class ReclamationDto {
  id!: number;
  idFonctionnel!: string ;
  nomClient!: string | null;
  telephone!: string | null;
  email!: string | null;
  codeAbonnement!: string | null;
  pays!: string | null;
  ville!: string | null;
  quartier!: string | null;
  nomRue!: string | null;
  category!: string | null;
  situation!: string | null;
  periode!: string | null;
  occurrence!: string | null;
  status!: string | null;
  description!: string | null;
  createdAt!: string | null;
  agent!: UserDto ;
  service!: ServiceDto;

  // Parameterless constructor
  constructor();

  // Constructor with parameters
  constructor(
    id?: number, idFonctionnel?: string, nomClient?: string, telephone?: string, email?: string, codeAbonnement?: string,
    pays?: string, ville?: string, quartier?: string, nomRue?:string, category?: string, situation?: string, periode?: string,
    occurrence?: string, status?: string, description?: string, createdAt?: string, agent?: UserDto, service?: ServiceDto
  ) {
    this.id = id ?? 0;
    this.idFonctionnel != idFonctionnel;
    this.nomClient = nomClient ?? null;
    this.telephone = telephone ?? null;
    this.email = email ?? null;
    this.codeAbonnement = codeAbonnement ?? null;
    this.pays = pays ?? null;
    this.ville = ville ?? null;
    this.quartier = quartier ?? null;
    this.nomRue = nomRue ?? null;
    this.category = category ?? null;
    this.situation = situation ?? null;
    this.periode = periode ?? null;
    this.occurrence = occurrence ?? null;
    this.status = status ?? null;
    this.description = description ?? null;
    this.createdAt = createdAt ?? null;
    this.agent = agent ?? new UserDto();
    this.service = service ?? new ServiceDto();
  }
}



export class DepartementDto {
  id!: number;
  nom!: string | null;
  chefDepartement!: UserDto;

  // Parameterless constructor
  constructor();

  // Constructor with parameters
  constructor(id?: number, nom?: string, chefDepartement?: UserDto) {
    this.id = id ?? 0;
    this.nom = nom ?? null;
    this.chefDepartement = chefDepartement ?? new UserDto();
  }
}




export class ServiceDto {
  id!: number;
  nom!: string | null;
  departement!: DepartementDto;
  chefService!: UserDto;

  // Parameterless constructor
  constructor();

  // Constructor with parameters
  constructor(id?: number, nom?: string, departement?: DepartementDto, chefService?: UserDto) {
    this.id = id ?? 0;
    this.nom = nom ?? null;
    this.departement = departement ?? new DepartementDto();
    this.chefService = chefService ?? new UserDto();
  }
}

export class EquipeDto{
  id!: number;
  nom!: string | null;
  chefEquipe!: TechnicienDto;
  createdAt!: string | null;
  disabledAt!: string | null;
  active!: boolean | null;
  techniciens!: TechnicienDto[] | null;

  constructor();

  constructor(
    id?: number, nom?: string,chefEquipe?: TechnicienDto, createdAt?: string, disabledAt?: string, active?:boolean
  ) {
    this.id = id ?? 0;
    this.nom = nom ?? null;
    this.chefEquipe = chefEquipe ?? new TechnicienDto();
    this.createdAt = createdAt ?? null;
    this.disabledAt = disabledAt ?? null;
    this.active = active ?? null;

  }
}



export class InterventionDto {
  id!: number;
  titre!: string | null;
  status!: string | null;
  dateDebut!: Date | null;
  dateFin!: Date | null;
  createdAt!: string | null;
  description!: string | null;
  createur!: UserDto;
  reclamation: ReclamationDto;
  departement!: DepartementDto;
  service!: ServiceDto;
  technicien!: TechnicienDto | null;
  equipe!: EquipeDto | null;

  // Parameterless constructor
  constructor()

  // Constructor with parameters
  constructor(
    id?: number, titre?: string, status?: string, dateDebut?: Date, dateFin?: Date,
    description?: string, createdAt?: string,  reclamation?:ReclamationDto ,departement?:DepartementDto,
    createur?: UserDto, service?: ServiceDto, technicien?: TechnicienDto, equipe?: EquipeDto)
  {
    this.id = id ?? 0;
    this.titre = titre ?? null;
    this.status = status ?? null;
    this.dateDebut = dateDebut?? null;
    this.dateFin = dateFin ?? null;
    this.description = description ?? null;
    this.createdAt = createdAt ?? null;
    this.createur = createur ?? new UserDto();
    this.reclamation = reclamation ?? new ReclamationDto();
    this.departement = departement ?? new DepartementDto();
    this.service = service ?? new ServiceDto();
    this.technicien = technicien ?? new TechnicienDto();
    this.equipe = equipe ?? new EquipeDto();
  }
}


export class ClientDto {
  id!: number;
  nomClient!: string | null;
  codeAbonnement!: string | null;
  pays!: string | null;
  ville!: string | null;
  quartier!: string | null;
  nomRue!: string | null;

  // Parameterless constructor
  constructor();

  // Constructor with parameters
  constructor(
    id?: number, nomClient?: string, codeAbonnement?: string,
    pays?: string, ville?: string, quartier?: string, nomRue?:string
  ) {
    this.id = id ?? 0;
    this.nomClient = nomClient ?? null;
    this.codeAbonnement = codeAbonnement ?? null;
    this.pays = pays ?? null;
    this.ville = ville ?? null;
    this.quartier = quartier ?? null;
    this.nomRue = nomRue ?? null;
  }

}



