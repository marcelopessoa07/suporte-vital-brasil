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
  role: UserRole;
  profileImage?: string;
  medicalInfo?: MedicalInfo;
}

export type UserRole = 'admin' | 'central' | 'user';

export interface MedicalInfo {
  bloodType?: string;
  allergies?: string[];
  conditions?: string[];
  medications?: string[];
  emergencyContact?: string;
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
  eta?: number | null;
  tracking: {
    currentLocation: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    destinationLocation: {
      latitude: number;
      longitude: number;
      address: string;
    } | null;
    path: Array<{
      latitude: number;
      longitude: number;
    }>;
  };
}

export interface IncidentUpdate {
  status: IncidentStatus;
  timestamp: string;
  note?: string;
}

export type IncidentStatus = 
  | 'sos_acionado' 
  | 'central_em_contato'
  | 'central_acionada'  
  | 'ambulancia_a_caminho' 
  | 'ambulancia_chegou'
  | 'chegada_local' 
  | 'paciente_embarcado'
  | 'a_caminho_hospital' 
  | 'paciente_hospital';

// Ambulance related types
export interface Ambulance {
  id: string;
  plate: string;
  code: string;
  type: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: 'available' | 'busy' | 'maintenance';
  currentIncidentId?: string;
  driverId?: string;
  crew?: string[];
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
  role: "user",
  profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
  medicalInfo: {
    bloodType: "A+",
    allergies: ["Penicilina", "Poeira"],
    conditions: ["Hipertensão"],
    medications: ["Losartana 50mg"],
    emergencyContact: "(11) 98765-5678"
  },
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

// Adicionando mock users para os outros perfis
export const mockCentralUser: User = {
  id: "4",
  name: "Carlos Operador",
  email: "carlos.operador@example.com",
  phone: "(11) 95432-1098",
  cpf: "765.432.109-00",
  address: "Rua dos Operadores, 456 - São Paulo, SP",
  isValidated: true,
  role: "central",
  plan: {
    id: "3",
    name: "Central",
    status: "active",
    expirationDate: "2024-12-31",
    price: 0
  },
  familyMembers: []
};

export const mockAdminUser: User = {
  id: "5",
  name: "Amanda Admin",
  email: "amanda.admin@example.com",
  phone: "(11) 94321-0987",
  cpf: "654.321.098-00",
  address: "Rua dos Administradores, 789 - São Paulo, SP",
  isValidated: true,
  role: "admin",
  plan: {
    id: "4",
    name: "Admin",
    status: "active",
    expirationDate: "2024-12-31",
    price: 0
  },
  familyMembers: []
};

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
    role: "user",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
    medicalInfo: {
      bloodType: "O-",
      allergies: ["Frutos do mar"],
      conditions: ["Diabetes"],
      medications: ["Insulina"],
      emergencyContact: "(11) 97654-7890"
    },
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
    role: "user",
    profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
    plan: {
      id: "2",
      name: "Plano Básico",
      status: "inactive",
      expirationDate: "2023-05-20",
      price: 69.90
    },
    familyMembers: []
  },
  mockCentralUser,
  mockAdminUser
];

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
    ],
    eta: 15,
    tracking: {
      currentLocation: {
        latitude: -23.555000,
        longitude: -46.639000
      },
      destinationLocation: null,
      path: [
        {
          latitude: -23.555000,
          longitude: -46.639000
        }
      ]
    }
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
    ],
    tracking: {
      currentLocation: {
        latitude: -23.560000,
        longitude: -46.645000,
        address: "Hospital São Paulo"
      },
      destinationLocation: {
        latitude: -23.550520,
        longitude: -46.633308,
        address: "Hospital São Paulo"
      },
      path: [
        {
          latitude: -23.555000, 
          longitude: -46.639000
        },
        {
          latitude: -23.560000,
          longitude: -46.645000
        }
      ]
    }
  }
];

// Mock ambulances for development
export const mockAmbulances: Ambulance[] = [
  {
    id: "1",
    plate: "ABC-1234",
    code: "AMB-01",
    type: "UTI Móvel",
    location: {
      latitude: -23.555000,
      longitude: -46.639000,
      address: "Av. Paulista, 1000"
    },
    status: "available",
    crew: ["Dr. Silva", "Enf. Santos"]
  },
  {
    id: "2",
    plate: "DEF-5678",
    code: "AMB-02",
    type: "Básica",
    location: {
      latitude: -23.560000,
      longitude: -46.645000,
      address: "Av. Rebouças, 500"
    },
    status: "busy",
    currentIncidentId: "2",
    crew: ["Dr. Lima", "Enf. Oliveira"]
  },
  {
    id: "3",
    plate: "GHI-9012",
    code: "AMB-03",
    type: "UTI Móvel",
    location: {
      latitude: -23.553000,
      longitude: -46.642000,
      address: "Av. Brigadeiro, 750"
    },
    status: "maintenance",
    crew: ["Em manutenção"]
  }
];
