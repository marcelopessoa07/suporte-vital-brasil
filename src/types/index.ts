
// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: string;
  isValidated: boolean;
  plan: Plan;
  familyMembers: FamilyMember[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  receiveNotifications: boolean;
}

export interface Plan {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  expirationDate: string;
  price: number;
}

// Incident related types
export interface Incident {
  id: string;
  userId: string;
  userName: string;
  status: IncidentStatus;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  timestamp: string;
  ambulanceId?: string;
  hospitalName?: string;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  status: IncidentStatus;
  timestamp: string;
  note?: string;
}

export type IncidentStatus = 
  | 'sos_acionado' 
  | 'central_em_contato' 
  | 'ambulancia_a_caminho' 
  | 'ambulancia_chegou' 
  | 'paciente_embarcado' 
  | 'paciente_hospital';

// Ambulance related types
export interface Ambulance {
  id: string;
  plate: string;
  location: {
    latitude: number;
    longitude: number;
  };
  status: 'available' | 'busy' | 'maintenance';
  currentIncidentId?: string;
  driverId?: string;
}

// Mock user for development
export const mockUser: User = {
  id: "1",
  name: "João Silva",
  email: "joao.silva@example.com",
  phone: "(11) 98765-4321",
  cpf: "123.456.789-00",
  address: "Rua das Flores, 123 - São Paulo, SP",
  isValidated: true,
  plan: {
    id: "1",
    name: "Plano Completo",
    status: "active",
    expirationDate: "2023-12-31",
    price: 99.90
  },
  familyMembers: [
    {
      id: "1",
      name: "Maria Silva",
      relationship: "Esposa",
      phone: "(11) 98765-1234",
      receiveNotifications: true
    },
    {
      id: "2",
      name: "Pedro Silva",
      relationship: "Filho",
      phone: "(11) 98765-5678",
      receiveNotifications: true
    }
  ]
};

// Mock incidents for development
export const mockIncidents: Incident[] = [
  {
    id: "1",
    userId: "1",
    userName: "João Silva",
    status: "ambulancia_a_caminho",
    location: {
      latitude: -23.550520,
      longitude: -46.633308,
      address: "Avenida Paulista, 1000 - São Paulo, SP"
    },
    timestamp: "2023-06-15T14:30:00",
    updates: [
      { status: "sos_acionado", timestamp: "2023-06-15T14:30:00" },
      { status: "central_em_contato", timestamp: "2023-06-15T14:32:00" },
      { status: "ambulancia_a_caminho", timestamp: "2023-06-15T14:35:00" }
    ]
  },
  {
    id: "2",
    userId: "2",
    userName: "Ana Santos",
    status: "paciente_hospital",
    location: {
      latitude: -23.550520,
      longitude: -46.633308,
      address: "Rua Augusta, 500 - São Paulo, SP"
    },
    timestamp: "2023-06-15T10:15:00",
    ambulanceId: "2",
    hospitalName: "Hospital São Paulo",
    updates: [
      { status: "sos_acionado", timestamp: "2023-06-15T10:15:00" },
      { status: "central_em_contato", timestamp: "2023-06-15T10:16:00" },
      { status: "ambulancia_a_caminho", timestamp: "2023-06-15T10:20:00" },
      { status: "ambulancia_chegou", timestamp: "2023-06-15T10:30:00" },
      { status: "paciente_embarcado", timestamp: "2023-06-15T10:35:00" },
      { status: "paciente_hospital", timestamp: "2023-06-15T10:50:00", note: "Hospital São Paulo" }
    ]
  }
];

// Mock ambulances for development
export const mockAmbulances: Ambulance[] = [
  {
    id: "1",
    plate: "ABC-1234",
    location: {
      latitude: -23.555000,
      longitude: -46.639000
    },
    status: "available"
  },
  {
    id: "2",
    plate: "DEF-5678",
    location: {
      latitude: -23.560000,
      longitude: -46.645000
    },
    status: "busy",
    currentIncidentId: "2"
  },
  {
    id: "3",
    plate: "GHI-9012",
    location: {
      latitude: -23.553000,
      longitude: -46.642000
    },
    status: "maintenance"
  }
];

// Mock users for admin panel
export const mockUsers: User[] = [
  mockUser,
  {
    id: "2",
    name: "Ana Santos",
    email: "ana.santos@example.com",
    phone: "(11) 97654-3210",
    cpf: "987.654.321-00",
    address: "Rua das Palmeiras, 456 - São Paulo, SP",
    isValidated: true,
    plan: {
      id: "1",
      name: "Plano Completo",
      status: "active",
      expirationDate: "2023-10-15",
      price: 99.90
    },
    familyMembers: [
      {
        id: "3",
        name: "Carlos Santos",
        relationship: "Esposo",
        phone: "(11) 97654-1234",
        receiveNotifications: true
      }
    ]
  },
  {
    id: "3",
    name: "Luiz Oliveira",
    email: "luiz.oliveira@example.com",
    phone: "(11) 96543-2109",
    cpf: "456.789.123-00",
    address: "Avenida Brigadeiro, 789 - São Paulo, SP",
    isValidated: false,
    plan: {
      id: "2",
      name: "Plano Básico",
      status: "inactive",
      expirationDate: "2023-05-20",
      price: 69.90
    },
    familyMembers: []
  }
];
