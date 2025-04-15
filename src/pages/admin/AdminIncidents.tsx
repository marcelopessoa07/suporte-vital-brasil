import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Calendar, 
  ChevronDown,
  ChevronUp,
  Filter,
  AlertTriangle,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IncidentStatusBadge } from "@/components/ui/IncidentStatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IncidentStatus } from "@/types";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminIncidents = () => {
  const { incidents, ambulances, updateIncidentStatus, assignAmbulanceToIncident, assignHospitalToIncident, isCentralView } = useApp();
  const navigate = useNavigate();
  
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<IncidentStatus[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string>("");
  const [selectedETA, setSelectedETA] = useState<number>(15);
  const [hospitalName, setHospitalName] = useState<string>("");
  const [isAssigningAmbulance, setIsAssigningAmbulance] = useState(false);
  const [isAssigningHospital, setIsAssigningHospital] = useState(false);
  
  // Get active incident
  const activeIncident = activeIncidentId ? incidents.find(inc => inc.id === activeIncidentId) : null;
  
  // Filter and sort incidents
  const filteredIncidents = incidents
    .filter(incident => {
      const matchesSearch = incident.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           incident.location.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatuses.length === 0 || 
                          selectedStatuses.includes(incident.status);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by urgency first (SOS is most urgent)
      const urgencyOrder: Record<IncidentStatus, number> = {
        'sos_acionado': 0,
        'central_em_contato': 1,
        'central_acionada': 2,
        'ambulancia_a_caminho': 3,
        'ambulancia_chegou': 4,
        'chegada_local': 5,
        'paciente_embarcado': 6,
        'a_caminho_hospital': 7,
        'paciente_hospital': 8
      };
      
      const urgencyDiff = urgencyOrder[a.status] - urgencyOrder[b.status];
      if (urgencyDiff !== 0) return urgencyDiff;
      
      // Then sort by date
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const toggleStatus = (status: IncidentStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  const statusOptions: { value: IncidentStatus; label: string }[] = [
    { value: 'sos_acionado', label: 'SOS Acionado' },
    { value: 'central_em_contato', label: 'Central em Contato' },
    { value: 'central_acionada', label: 'Central Acionada' },
    { value: 'ambulancia_a_caminho', label: 'Ambulância a Caminho' },
    { value: 'ambulancia_chegou', label: 'Ambulância Chegou' },
    { value: 'chegada_local', label: 'Chegada ao Local' },
    { value: 'paciente_embarcado', label: 'Paciente Embarcado' },
    { value: 'a_caminho_hospital', label: 'A Caminho do Hospital' },
    { value: 'paciente_hospital', label: 'Paciente no Hospital' },
  ];
  
  // Available ambulances for assignment
  const availableAmbulances = ambulances.filter(amb => amb.status === 'available');
  
  // Handle incident click
  const handleIncidentClick = (incidentId: string) => {
    setActiveIncidentId(incidentId);
    navigate(isCentralView ? `/central/incident/${incidentId}` : `/admin/incident/${incidentId}`);
  };
  
  // Handle status update
  const handleStatusUpdate = (incident: typeof activeIncident, newStatus: IncidentStatus) => {
    if (!incident) return;
    updateIncidentStatus(incident.id, newStatus);
  };
  
  // Handle ambulance assignment
  const handleAmbulanceAssignment = () => {
    if (!activeIncident || !selectedAmbulanceId) return;
    
    assignAmbulanceToIncident(activeIncident.id, selectedAmbulanceId, selectedETA);
    updateIncidentStatus(activeIncident.id, 'ambulancia_a_caminho');
    
    setIsAssigningAmbulance(false);
    setSelectedAmbulanceId("");
    setSelectedETA(15);
  };
  
  // Handle hospital assignment
  const handleHospitalAssignment = () => {
    if (!activeIncident || !hospitalName) return;
    
    assignHospitalToIncident(activeIncident.id, hospitalName);
    
    setIsAssigningHospital(false);
    setHospitalName("");
  };
  
  // Open ambulance assignment dialog
  const openAmbulanceDialog = (incidentId: string) => {
    setActiveIncidentId(incidentId);
    setIsAssigningAmbulance(true);
  };
  
  // Open hospital assignment dialog
  const openHospitalDialog = (incidentId: string) => {
    setActiveIncidentId(incidentId);
    setIsAssigningHospital(true);
  };
  
  // View patient details
  const viewPatientDetails = (userId: string) => {
    navigate(isCentralView ? `/central/patient/${userId}` : `/admin/users/${userId}`);
  };

  return (
    <AppLayout title="Gerenciar Incidentes">
      <div className="pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Incidentes</h1>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar por nome ou endereço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter size={16} />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {statusOptions.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={selectedStatuses.includes(option.value)}
                    onCheckedChange={() => toggleStatus(option.value)}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" onClick={toggleSortDirection} className="gap-2">
              <Calendar size={16} />
              {sortDirection === 'desc' ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </Button>
          </div>
        </div>

        {/* Emergency alerts section */}
        {filteredIncidents.some(inc => inc.status === 'sos_acionado') && (
          <div className="mb-6">
            <h2 className="flex items-center text-lg font-semibold mb-3 text-red-600">
              <AlertTriangle className="mr-2" size={20} />
              Emergências Recentes
            </h2>
            
            <div className="space-y-4">
              {filteredIncidents
                .filter(inc => inc.status === 'sos_acionado')
                .map(incident => (
                  <Card 
                    key={incident.id}
                    className="p-4 border-red-300 bg-red-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{incident.userName}</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs text-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewPatientDetails(incident.userId);
                            }}
                          >
                            <User size={14} className="mr-1" />
                            Ver paciente
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(incident.timestamp).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <IncidentStatusBadge status={incident.status} />
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Local:</strong> {incident.location.address}
                    </p>
                    
                    {/* Action buttons */}
                    <div className="mt-4 flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(incident, 'central_em_contato')}
                      >
                        Confirmar Contato
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleIncidentClick(incident.id)}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Ongoing incidents */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Ocorrências em Andamento</h2>
          
          <div className="space-y-4">
            {filteredIncidents
              .filter(inc => 
                inc.status !== 'sos_acionado' && 
                inc.status !== 'paciente_hospital'
              )
              .map(incident => (
                <Card 
                  key={incident.id}
                  className="p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{incident.userName}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewPatientDetails(incident.userId);
                          }}
                        >
                          <User size={14} className="mr-1" />
                          Ver paciente
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(incident.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <IncidentStatusBadge status={incident.status} />
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Local:</strong> {incident.location.address}
                  </p>
                  
                  {incident.ambulanceId && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Ambulância:</strong> {incident.ambulanceId}
                    </p>
                  )}
                  
                  {incident.hospitalName && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Hospital:</strong> {incident.hospitalName}
                    </p>
                  )}
                  
                  {/* Action buttons */}
                  <div className="mt-4 flex justify-end gap-2">
                    {incident.status === 'central_em_contato' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openAmbulanceDialog(incident.id)}
                      >
                        Designar Ambulância
                      </Button>
                    )}
                    
                    {incident.status === 'ambulancia_a_caminho' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(incident, 'ambulancia_chegou')}
                      >
                        Confirmar Chegada
                      </Button>
                    )}
                    
                    {incident.status === 'ambulancia_chegou' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(incident, 'paciente_embarcado')}
                      >
                        Confirmar Embarque
                      </Button>
                    )}
                    
                    {incident.status === 'paciente_embarcado' && !incident.hospitalName && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openHospitalDialog(incident.id)}
                      >
                        Definir Hospital
                      </Button>
                    )}
                    
                    {incident.status === 'paciente_embarcado' && incident.hospitalName && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusUpdate(incident, 'paciente_hospital')}
                      >
                        Confirmar Chegada ao Hospital
                      </Button>
                    )}
                    
                    <Button 
                      size="sm"
                      onClick={() => handleIncidentClick(incident.id)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </Card>
              ))}
              
            {filteredIncidents.filter(inc => 
              inc.status !== 'sos_acionado' && 
              inc.status !== 'paciente_hospital'
            ).length === 0 && (
              <Card className="p-6 text-center text-gray-500">
                Nenhum incidente em andamento.
              </Card>
            )}
          </div>
        </div>
        
        {/* Completed incidents */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Ocorrências Concluídas</h2>
          
          <div className="space-y-4">
            {filteredIncidents
              .filter(inc => inc.status === 'paciente_hospital')
              .map(incident => (
                <Card 
                  key={incident.id}
                  className="p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{incident.userName}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewPatientDetails(incident.userId);
                          }}
                        >
                          <User size={14} className="mr-1" />
                          Ver paciente
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(incident.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <IncidentStatusBadge status={incident.status} />
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Hospital:</strong> {incident.hospitalName}
                  </p>
                  
                  <div className="mt-4 flex justify-end">
                    <Button 
                      size="sm"
                      onClick={() => handleIncidentClick(incident.id)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </Card>
              ))}
              
            {filteredIncidents.filter(inc => inc.status === 'paciente_hospital').length === 0 && (
              <Card className="p-6 text-center text-gray-500">
                Nenhuma ocorrência concluída.
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Ambulance Assignment Dialog */}
      <Dialog open={isAssigningAmbulance} onOpenChange={setIsAssigningAmbulance}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Designar Ambulância</DialogTitle>
            <DialogDescription>
              Selecione uma ambulância disponível para atender esta emergência.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ambulance">Ambulância</Label>
              <Select
                value={selectedAmbulanceId}
                onValueChange={setSelectedAmbulanceId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma ambulância" />
                </SelectTrigger>
                <SelectContent>
                  {availableAmbulances.length > 0 ? (
                    availableAmbulances.map(ambulance => (
                      <SelectItem key={ambulance.id} value={ambulance.id}>
                        {ambulance.plate}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Nenhuma ambulância disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eta">Tempo Estimado (minutos)</Label>
              <Select
                value={selectedETA.toString()}
                onValueChange={(value) => setSelectedETA(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tempo estimado" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20, 30, 45, 60].map(time => (
                    <SelectItem key={time} value={time.toString()}>
                      {time} minutos
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssigningAmbulance(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAmbulanceAssignment}
              disabled={!selectedAmbulanceId || availableAmbulances.length === 0}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Hospital Assignment Dialog */}
      <Dialog open={isAssigningHospital} onOpenChange={setIsAssigningHospital}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Definir Hospital de Destino</DialogTitle>
            <DialogDescription>
              Informe o hospital para onde o paciente está sendo encaminhado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital</Label>
              <Input
                id="hospital"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="Nome do hospital"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssigningHospital(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleHospitalAssignment}
              disabled={!hospitalName}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default AdminIncidents;
