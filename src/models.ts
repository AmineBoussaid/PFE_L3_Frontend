export class User {
  id!: number | null;
  username: string | null;
  password!: string | null;
  email!: string | null;
  role!: string | null;

  // Parameterless constructor
  constructor();

  // Constructor with parameters
  constructor(id?: number, username?: string, password?: string, email?: string, role?: string) {
    this.id != id;
    this.username = username || null ;
    this.password = password || null ;
    this.email = email || null;
    this.role = role || null ;
  }
}

export class Reclamation {
  id!: number | null;
  idFonctionnel!: string | null;
  nomClient!: string | null;
  telephone!: string | null;
  email: string | null;
  category: string | null;
  status: string | null;
  description: string | null;
  agent: User;
  departement: Departement;

  // Parameterless constructor
  constructor();

  // Constructor with parameters
  constructor(
    id?: number, idFonctionnel?: string, nomClient?: string, telephone?: string, email?: string, category?: string,
    status?: string, description?: string, agent?: User, departement?: Departement)
  {
    this.id != id ;
    this.idFonctionnel = idFonctionnel || null;
    this.nomClient = nomClient || null;
    this.telephone = telephone || null;
    this.email = email || null;
    this.category = category || null;
    this.status = status || null;
    this.description = description || null;
    this.agent = agent || new User();
    this.departement = departement || new Departement();
  }
}

export class Departement {
  id!: number | null;
  nom: string | null;
  chefDepartement: User;

  // Parameterless constructor
  constructor();

  // Constructor with parameters
  constructor(id?: number, nom?: string, chefDepartement?: User) {
    this.id != id ;
    this.nom = nom || null;
    this.chefDepartement = chefDepartement || new User();
  }
}
