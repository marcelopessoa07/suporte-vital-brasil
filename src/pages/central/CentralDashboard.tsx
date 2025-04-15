import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Bell, Ambulance, UserCheck, AlertCircle, Clock, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IncidentStatusBadge } from "@/components/ui/IncidentStatusBadge";
import { Button } from "@/components/ui/button";

const CentralDashboard = () => {
  const { incidents, ambulances } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");

  // Get active incidents
  const activeIncidents = incidents.filter(
    incident => incident.status !== "paciente_hospital" && 
                (filter === "all" || incident.status === filter)
  ).sort((a, b) => {
    // Sort by urgency (SOS first, then by timestamp)
    if (a.status === "sos_acionado" && b.status !== "sos_acionado") return -1;
    if (a.status !== "sos_acionado" && b.status === "sos_acionado") return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Available ambulances
  const availableAmbulances = ambulances.filter(
    ambulance => ambulance.status === "available"
  );

  return (
    <AppLayout title="Central de Emergências">
      <div className="pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Central de Emergências</h1>
            <p className="text-gray-500">Acompanhamento de chamados em tempo real</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="text-sm"
            >
              Todos
            </Button>
            <Button 
              variant={filter === "sos_acionado" ? "default" : "outline"}
              onClick={() => setFilter("sos_acionado")}
              className="bg-red-500 text-white hover:bg-red-600 text-sm"
            >
              SOS
            </Button>
            <Button 
              variant={filter === "central_acionada" ? "default" : "outline"}
              onClick={() => setFilter("central_acionada")}
              className="text-sm"
            >
              Aguardando
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-red-50 border-red-100">
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-3">
                <Bell size={20} className="text-supportlife-red" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Emergências ativas</p>
                <p className="text-2xl font-bold">{activeIncidents.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-50 border-blue-100">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <Ambulance size={20} className="text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ambulâncias disponíveis</p>
                <p className="text-2xl font-bold">{availableAmbulances.length} / {ambulances.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-green-50 border-green-100">
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-3">
                <Clock size={20} className="text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tempo médio de resposta</p>
                <p className="text-2xl font-bold">8.2 min</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Active emergencies */}
        <Card className="p-5 mb-6">
          <h2 className="text-xl font-semibold mb-4">Emergências Ativas</h2>

          {activeIncidents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <AlertCircle className="text-gray-400 mb-3" size={48} />
              <p className="text-gray-500">Nenhuma emergência ativa no momento</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeIncidents.map(incident => (
                <div 
                  key={incident.id}
                  className={`border rounded-lg p-4 ${
                    incident.status === "sos_acionado" 
                      ? "border-red-300 bg-red-50 animate-pulse" 
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center mb-1">
                        <h3 className="font-semibold">{incident.userName}</h3>
                        <IncidentStatusBadge status={incident.status} className="ml-2" />
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(incident.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => navigate(`/central/patient/${incident.userId}`)}
                    >
                      <UserCheck size={16} />
                      Ficha do Paciente
                    </Button>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-start mb-2">
                      <AlertCircle size={16} className="text-gray-500 mr-2 mt-1" />
                      <div>
                        <p className="text-gray-600 font-medium">Localização</p>
                        <p className="text-sm">{incident.location.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone size={16} className="text-gray-500 mr-2 mt-1" />
                      <div>
                        <p className="text-gray-600 font-medium">Contato</p>
                        <p className="text-sm">{incidents[0].userId && incidents[0].userId.includes("user") ? "(11) 97123-4567" : "Não informado"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={() => navigate(`/central/incident/${incident.id}`)}
                      className="bg-supportlife-blue hover:bg-supportlife-darkblue"
                    >
                      Ver Detalhes
                    </Button>
                    
                    {incident.status === "sos_acionado" && (
                      <Button variant="outline">
                        Iniciar Atendimento
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Available ambulances section */}
        <Card className="p-5">
          <h2 className="text-xl font-semibold mb-4">Ambulâncias Disponíveis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableAmbulances.map(ambulance => (
              <div key={ambulance.id} className="border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Ambulance size={20} className="text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-medium">{ambulance.code}</h3>
                    <p className="text-xs text-gray-500">{ambulance.type}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <p><span className="font-medium">Equipe:</span> {ambulance.crew?.join(", ") || "Não informado"}</p>
                  <p><span className="font-medium">Local:</span> {ambulance.location?.address || "Não informado"}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CentralDashboard;
