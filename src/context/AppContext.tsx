import React, { createContext, useState, useContext, ReactNode } from "react";
import { User, Incident, Ambulance, mockUser, mockIncidents, mockAmbulances, mockUsers, IncidentStatus, mockAdminUser, mockCentralUser, UserRole, MedicalInfo, Plan } from "@/types";
import { toast } from "sonner";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  receiveNotifications: boolean;
}

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  
  // User related
  currentUser: User | null;
  users: User[];
  validateUser: (userId: string) => void;
  addFamilyMember: (familyMember: Omit<FamilyMember, "id">) => void;
  removeFamilyMember: (familyMemberId: string) => void;
  updateUserProfile: (userId: string, userData: Partial<User>) => void;
  updateUserMedicalInfo: (userId: string, medicalInfo: MedicalInfo) => void;
  createUser: (userData: Omit<User, "id" | "isValidated" | "familyMembers">) => Promise<boolean>;
  resetPasswordRequest: (userId: string) => Promise<boolean>;
  
  // Incidents related
  incidents: Incident[];
  triggerSOS: (location: { latitude: number; longitude: number; address: string }) => void;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus, note?: string) => void;
  assignAmbulanceToIncident: (incidentId: string, ambulanceId: string, eta: number) => void;
  assignHospitalToIncident: (incidentId: string, hospitalName: string) => void;
  
  // Ambulances related
  ambulances: Ambulance[];
  updateAmbulancePosition: (ambulanceId: string, position: { latitude: number; longitude: number }) => void;
  updateAmbulanceStatus: (ambulanceId: string, status: "available" | "busy" | "maintenance") => void;
  
  // Plan management
  updateUserPlan: (userId: string, planData: Partial<Plan>) => void;
  
  // Admin view state
  isAdminView: boolean;
  setIsAdminView: (value: boolean) => void;
  isCentralView: boolean;
  setIsCentralView: (value: boolean) => void;
}

// Create context with default values
const AppContext = createContext<AppContextType>({} as AppContextType);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isCentralView, setIsCentralView] = useState<boolean>(false);
  
  // Data states
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(mockAmbulances);

  // Auth functions
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo: simple validation
    if (email && password) {
      let userToLogin: User | null = null;
      
      if (role === 'admin') {
        userToLogin = mockAdminUser;
        setIsAdminView(true);
        setIsCentralView(false);
      } else if (role === 'central') {
        userToLogin = mockCentralUser;
        setIsAdminView(false);
        setIsCentralView(true);
      } else {
        // Find user with matching email
        userToLogin = users.find(user => user.email === email && user.role === 'user') || mockUser;
        setIsAdminView(false);
        setIsCentralView(false);
      }
      
      setCurrentUser(userToLogin);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsAdminView(false);
    setIsCentralView(false);
  };

  // User management functions
  const validateUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isValidated: true } : user
    ));
    
    toast.success("Usuário validado com sucesso");
  };

  const addFamilyMember = (familyMember: Omit<FamilyMember, "id">) => {
    if (!currentUser) return;
    
    const newFamilyMember: FamilyMember = {
      ...familyMember,
      id: `fm-${Date.now()}`
    };
    
    const updatedUser = {
      ...currentUser,
      familyMembers: [...currentUser.familyMembers, newFamilyMember]
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    
    toast.success("Familiar adicionado com sucesso");
  };

  const removeFamilyMember = (familyMemberId: string) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      familyMembers: currentUser.familyMembers.filter(fm => fm.id !== familyMemberId)
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    
    toast.success("Familiar removido com sucesso");
  };
  
  const updateUserProfile = (userId: string, userData: Partial<User>) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    );
    
    setUsers(updatedUsers);
    
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, ...userData });
    }
    
    toast.success("Perfil atualizado com sucesso");
  };
  
  const updateUserMedicalInfo = (userId: string, medicalInfo: MedicalInfo) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, medicalInfo } : user
    );
    
    setUsers(updatedUsers);
    
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, medicalInfo });
    }
    
    toast.success("Informações médicas atualizadas com sucesso");
  };
  
  const createUser = async (userData: Omit<User, "id" | "isValidated" | "familyMembers">): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      isValidated: true, // Admin creates pre-validated users
      familyMembers: []
    };
    
    setUsers([...users, newUser]);
    toast.success(`Usuário ${newUser.name} criado com sucesso`);
    
    return true;
  };
  
  const resetPasswordRequest = async (userId: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast.success(`Email de redefinição de senha enviado para ${user.email}`);
      return true;
    }
    
    return false;
  };

  // Incident management functions
  const triggerSOS = (location: { latitude: number; longitude: number; address: string }) => {
    if (!currentUser) return;
    
    const newIncident: Incident = {
      id: `incident-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      status: "sos_acionado",
      location,
      timestamp: new Date().toISOString(),
      updates: [
        { status: "sos_acionado", timestamp: new Date().toISOString() }
      ],
      eta: null,
      tracking: {
        currentLocation: location,
        destinationLocation: null,
        path: [location]
      }
    };
    
    setIncidents([newIncident, ...incidents]);
    
    toast.success("SOS acionado com sucesso. A central foi notificada.");
  };

  const updateIncidentStatus = (incidentId: string, status: IncidentStatus, note?: string) => {
    const updatedIncidents = incidents.map(incident => {
      if (incident.id !== incidentId) return incident;
      
      const statusUpdate = {
        status,
        timestamp: new Date().toISOString(),
        note
      };
      
      return {
        ...incident,
        status,
        hospitalName: status === 'paciente_hospital' ? note : incident.hospitalName,
        updates: [...incident.updates, statusUpdate]
      };
    });
    
    setIncidents(updatedIncidents);
    
    toast.success(`Status do incidente atualizado para ${status}`);
  };

  const assignAmbulanceToIncident = (incidentId: string, ambulanceId: string, eta: number) => {
    // Update the incident with ambulance information
    const updatedIncidents = incidents.map(incident => {
      if (incident.id !== incidentId) return incident;
      
      return {
        ...incident,
        ambulanceId,
        eta
      };
    });
    
    setIncidents(updatedIncidents);
    
    // Update ambulance status to busy with this incident
    const updatedAmbulances = ambulances.map(ambulance => {
      if (ambulance.id !== ambulanceId) return ambulance;
      
      return {
        ...ambulance,
        status: "busy" as const,
        currentIncidentId: incidentId
      };
    });
    
    setAmbulances(updatedAmbulances);
    
    toast.success(`Ambulância designada para o incidente`);
  };

  const assignHospitalToIncident = (incidentId: string, hospitalName: string) => {
    const updatedIncidents = incidents.map(incident => {
      if (incident.id !== incidentId) return incident;
      
      return {
        ...incident,
        hospitalName,
        tracking: {
          ...incident.tracking,
          destinationLocation: {
            // Mock hospital location - in real app would be geocoded
            latitude: incident.location.latitude + 0.02,
            longitude: incident.location.longitude + 0.02,
            address: hospitalName
          }
        }
      };
    });
    
    setIncidents(updatedIncidents);
    
    toast.success(`Hospital designado: ${hospitalName}`);
  };

  const updateAmbulancePosition = (ambulanceId: string, position: { latitude: number; longitude: number }) => {
    // Update ambulance position
    const updatedAmbulances = ambulances.map(ambulance => {
      if (ambulance.id !== ambulanceId) return ambulance;
      
      return {
        ...ambulance,
        location: position
      };
    });
    
    setAmbulances(updatedAmbulances);
    
    // If ambulance is assigned to an incident, update the incident tracking
    const ambulance = updatedAmbulances.find(a => a.id === ambulanceId);
    if (ambulance?.currentIncidentId) {
      const updatedIncidents = incidents.map(incident => {
        if (incident.id !== ambulance.currentIncidentId) return incident;
        
        return {
          ...incident,
          tracking: {
            ...incident.tracking,
            currentLocation: position,
            path: [...incident.tracking.path, position]
          }
        };
      });
      
      setIncidents(updatedIncidents);
    }
  };

  const updateAmbulanceStatus = (ambulanceId: string, status: "available" | "busy" | "maintenance") => {
    const updatedAmbulances = ambulances.map(ambulance => {
      if (ambulance.id !== ambulanceId) return ambulance;
      
      return {
        ...ambulance,
        status,
        currentIncidentId: status === "busy" ? ambulance.currentIncidentId : undefined
      };
    });
    
    setAmbulances(updatedAmbulances);
  };
  
  // Plan management
  const updateUserPlan = (userId: string, planData: Partial<Plan>) => {
    const updatedUsers = users.map(user => {
      if (user.id !== userId) return user;
      
      return {
        ...user,
        plan: {
          ...user.plan,
          ...planData
        }
      };
    });
    
    setUsers(updatedUsers);
    
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({
        ...currentUser,
        plan: {
          ...currentUser.plan,
          ...planData
        }
      });
    }
    
    toast.success("Plano atualizado com sucesso");
  };

  const contextValue: AppContextType = {
    isAuthenticated,
    login,
    logout,
    currentUser,
    users,
    validateUser,
    addFamilyMember,
    removeFamilyMember,
    updateUserProfile,
    updateUserMedicalInfo,
    createUser,
    resetPasswordRequest,
    incidents,
    triggerSOS,
    updateIncidentStatus,
    assignAmbulanceToIncident,
    assignHospitalToIncident,
    ambulances,
    updateAmbulancePosition,
    updateAmbulanceStatus,
    updateUserPlan,
    isAdminView,
    setIsAdminView,
    isCentralView,
    setIsCentralView
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useApp = () => useContext(AppContext);
