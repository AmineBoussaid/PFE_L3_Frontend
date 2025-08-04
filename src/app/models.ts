export class User {
  id!: number;
  username!: string | null;
  password!: string | null;
  email!: string | null;
  role!: string | null;

  // Parameterless constructor
  constructor();

  // Constructor with parameters
  constructor(id?: number, username?: string, password?: string, email?: string, role?: string) {
    this.id = id ?? 0;
    this.username = username ?? null;
    this.password = password ?? null;
    this.email = email ?? null;
    this.role = role ?? null;
  }
}

export class UserHist {
  id!: number;
  user!: User;
  created_at!: string | null;
  action!: string | null;
  details!: string | null;
  ipAddress!: string | null;

  // Parameterless constructor
  constructor();

  // Constructor with parameters
  constructor(id?: number, user?: User,created_at?: string, action?: string, details?: string, ipAddress?: string) {
    this.id =id  ?? 0;
    this.user = user  ?? new User();
    this.created_at = created_at ?? null;
    this.action = action  ?? null;
    this.details = details  ?? null;
    this.ipAddress = ipAddress  ?? null;
  }
}


export class TechnicienDto {
  userId !: number;
  username!: string | null;
  email!: string | null;
  role!: string | null;
  serviceId !: number | null;;
  serviceName!: string | null;

// Parameterless constructor
  constructor();

// Constructor with parameters
  constructor(userId?: number, username?: string,email?: string, role?: string, serviceId ?: number, serviceName?: string,) {
    this.userId = userId ?? 0;
    this.username = username ?? null;
    this.email = email ?? null;
    this.role = role ?? null;
    this.serviceId = serviceId ?? null;
    this.serviceName = serviceName ?? null;
  }
}




export class Reclamation {
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
  created_at!: string | null;
  agent!: User;
  service!: Service;

  // Parameterless constructor
  constructor();

  // Constructor with parameters
  constructor(
    id?: number, idFonctionnel?: string, nomClient?: string, telephone?: string, email?: string, codeAbonnement?: string,
    pays?: string, ville?: string, quartier?: string, nomRue?:string, category?: string, situation?: string, periode?: string,
    occurrence?: string, status?: string, description?: string, created_at?: string, agent?: User, service?: Service
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
    this.created_at = created_at ?? null;
    this.agent = agent ?? new User();
    this.service = service ?? new Service();
  }
}



export class Departement {
  id!: number;
  nom!: string | null;
  chefDepartement!: User;

  // Parameterless constructor
  constructor();

  // Constructor with parameters
  constructor(id?: number, nom?: string, chefDepartement?: User) {
    this.id = id ?? 0;
    this.nom = nom ?? null;
    this.chefDepartement = chefDepartement ?? new User();
  }
}



export class Service {
  id!: number;
  nom!: string | null;
  departement!: Departement;
  chefService!: User;

  // Parameterless constructor
  constructor();

  // Constructor with parameters
  constructor(id?: number, nom?: string, departement?: Departement, chefService?: User) {
    this.id = id ?? 0;
    this.nom = nom ?? null;
    this.departement = departement ?? new Departement();
    this.chefService = chefService ?? new User();
  }
}



export class Intervention {
  id!: number;
  titre!: string | null;
  status!: string | null;
  dateDebut!: Date | null;
  dateFin!: Date | null;
  created_at!: string | null;
  description!: string | null;
  createur!: User;
  reclamation!: Reclamation;
  departement!: Departement;
  service!: Service;
  technicien!: User;

  // Parameterless constructor
  constructor();

  // Constructor with parameters
  constructor(
    id?: number, titre?: string, status?: string, dateDebut?: Date, dateFin?: Date, description?: string, created_at?: string,  reclamation?:Reclamation ,createur?: User, service?: Service, technicien?: User)
  {
    this.id = id ?? 0;
    this.titre = titre ?? null;
    this.status = status ?? null;
    this.dateDebut = dateDebut?? null;
    this.dateFin = dateDebut ?? null;
    this.description = description ?? null;
    this.created_at = created_at ?? null;
    this.createur = createur ?? new User();
    this.reclamation = reclamation ?? new Reclamation();
    this.departement = this.departement ?? new Departement();
    this.service = service ?? new Service();
    this.technicien = technicien ?? new User();
  }
}
