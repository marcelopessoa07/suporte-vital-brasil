
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { MapPin, Clock, User, Ambulance, Building } from "lucide-react";
import { IncidentStatusBadge, getIncidentStatusLabel } from "@/components/ui/IncidentStatusBadge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import TrackingMap from "@/components/tracking/TrackingMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IncidentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { incidents, ambulances } = useApp();
  const navigate = useNavigate();

  const incident = incidents.find(inc => inc.id === id);
  const assignedAmbulance = incident?.ambulanceId 
    ? ambulances.find(amb => amb.id === incident.ambulanceId)
    : undefined;

  if (!incident) {
    return (
      <AppLayout title="Emergência não encontrada" showBackButton>
        <div className="text-center py-10">
          <p className="text-gray-500">Emergência não encontrada</p>
          <button 
            onClick={() => navigate("/incidents")}
            className="mt-4 text-supportlife-blue underline"
          >
            Voltar para lista de emergências
          </button>
        </div>
      </AppLayout>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Check if we should show the tracking map
  const showTracking = incident.status !== 'sos_acionado';
  
  const ambulanceLocation = assignedAmbulance 
    ? { ...assignedAmbulance.location } 
    : incident.tracking.currentLocation;
    
  const hospitalLocation = incident.tracking.destinationLocation 
    ? { ...incident.tracking.destinationLocation } 
    : incident.hospitalName 
      ? { 
          latitude: incident.location.latitude + 0.02, 
          longitude: incident.location.longitude + 0.02, 
          address: incident.hospitalName 
        } 
      : null;

  return (
    <AppLayout title="Detalhes da Emergência" showBackButton>
      <div className="pb-20">
        {/* Status badge */}
        <div className="flex justify-center mb-6">
          <IncidentStatusBadge 
            status={incident.status} 
            className="text-base px-4 py-2"
          />
        </div>

        <Tabs defaultValue="info" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="tracking" disabled={!showTracking}>
              Acompanhamento
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="pt-4">
            {/* Incident details card */}
            <Card className="p-4 mb-6">
              <h2 className="text-lg font-semibold mb-3">Informações</h2>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <Clock size={18} className="mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Horário do chamado</p>
                    <p className="text-sm text-gray-600">{formatDateTime(incident.timestamp)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin size={18} className="mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Localização</p>
                    <p className="text-sm text-gray-600">{incident.location.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User size={18} className="mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Paciente</p>
                    <p className="text-sm text-gray-600">{incident.userName}</p>
                  </div>
                </div>
                
                {incident.ambulanceId && (
                  <div className="flex items-start">
                    <Ambulance size={18} className="mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Ambulância</p>
                      <p className="text-sm text-gray-600">Código: {incident.ambulanceId}</p>
                      {incident.eta && (
                        <p className="text-sm text-supportlife-blue">
                          Previsão de chegada: {incident.eta} min
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {incident.hospitalName && (
                  <div className="flex items-start">
                    <Building size={18} className="mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Hospital</p>
                      <p className="text-sm text-gray-600">{incident.hospitalName}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Status timeline */}
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-3">Histórico da Ocorrência</h2>
              
              <div className="space-y-4">
                {incident.updates.map((update, index) => (
                  <div key={index}>
                    <div className="flex">
                      {/* Timeline dot */}
                      <div className="relative mr-4">
                        <div className="h-4 w-4 rounded-full bg-supportlife-blue"></div>
                        {index < incident.updates.length - 1 && (
                          <div className="absolute top-4 bottom-0 left-1.5 w-0.5 bg-gray-200 h-full"></div>
                        )}
                      </div>
                      
                      {/* Timeline content */}
                      <div className="flex-1 pb-6">
                        <p className="font-medium">{getIncidentStatusLabel(update.status)}</p>
                        <p className="text-sm text-gray-500">{formatTime(update.timestamp)}</p>
                        {update.note && <p className="text-sm mt-1">{update.note}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="tracking" className="pt-4">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-3">Acompanhamento</h2>
              
              <TrackingMap 
                patientLocation={incident.location}
                ambulanceLocation={showTracking ? ambulanceLocation : undefined}
                hospitalLocation={hospitalLocation || undefined}
                eta={incident.eta}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default IncidentDetails;
