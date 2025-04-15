
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Calendar, 
  ChevronDown,
  ChevronUp,
  Filter
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

const AdminIncidents = () => {
  const { incidents } = useApp();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<IncidentStatus[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
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
    { value: 'ambulancia_a_caminho', label: 'Ambulância a Caminho' },
    { value: 'ambulancia_chegou', label: 'Ambulância Chegou' },
    { value: 'paciente_embarcado', label: 'Paciente Embarcado' },
    { value: 'paciente_hospital', label: 'Paciente no Hospital' },
  ];

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

        {/* Incidents list */}
        {filteredIncidents.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            Nenhum incidente encontrado.
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredIncidents.map(incident => (
              <Card 
                key={incident.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/admin/incident/${incident.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{incident.userName}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(incident.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <IncidentStatusBadge status={incident.status} />
                </div>
                
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Local:</strong> {incident.location.address}
                </p>
                
                {incident.hospitalName && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Hospital:</strong> {incident.hospitalName}
                  </p>
                )}
                
                {incident.ambulanceId && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Ambulância:</strong> {incident.ambulanceId}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminIncidents;
