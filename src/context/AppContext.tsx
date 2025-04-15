
import React, { createContext, useState, useContext, ReactNode } from "react";
import { User, Incident, Ambulance, mockUser, mockIncidents, mockAmbulances, mockUsers, IncidentStatus } from "@/types";

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // User related
  currentUser: User | null;
  users: User[];
  validateUser: (userId: string) => void;
  addFamilyMember: (familyMember: Omit<FamilyMember, "id">) => void;
  removeFamilyMember: (familyMemberId: string) => void;
  
  // Incidents related
  incidents: Incident[];
  triggerSOS: (location: { latitude: number; longitude: number; address: string }) => void;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus, note?: string) => void;
  
  // Ambulances related
  ambulances: Ambulance[];
  
  // Admin view state
  isAdminView: boolean;
  setIsAdminView: (value: boolean) => void;
}

// Create context with default values
const AppContext = createContext<AppContextType>({} as AppContextType);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  
  // Data states
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(mockAmbulances);

  // Auth functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo: simple validation
    if (email && password) {
      // For demo purposes: set mockUser as current user
      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsAdminView(false);
  };

  // User management functions
  const validateUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isValidated: true } : user
    ));
  };

  const addFamilyMember = (familyMember: Omit<FamilyMember, "id">) => {
    if (!currentUser) return;
    
    const newFamilyMember = {
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
      ]
    };
    
    setIncidents([newIncident, ...incidents]);
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
    incidents,
    triggerSOS,
    updateIncidentStatus,
    ambulances,
    isAdminView,
    setIsAdminView
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useApp = () => useContext(AppContext);

// Type for family member
interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  receiveNotifications: boolean;
}
