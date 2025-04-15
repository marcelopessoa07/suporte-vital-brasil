
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Ambulance, MapPin } from "lucide-react";

const AdminAmbulances = () => {
  const { ambulances, incidents } = useApp();

  return (
    <AppLayout title="Monitorar Ambulâncias">
      <div className="pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Monitorar Ambulâncias</h1>
        </div>

        {/* Map placeholder */}
        <Card className="p-4 mb-6 aspect-video flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <MapPin size={48} className="mx-auto mb-2" />
            <p>Mapa de localização das ambulâncias em tempo real</p>
            <p className="text-sm">(Simulação)</p>
          </div>
        </Card>

        {/* Ambulances list */}
        <h2 className="text-xl font-semibold mb-4">Lista de Ambulâncias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ambulances.map(ambulance => {
            // Find the incident associated with this ambulance
            const associatedIncident = incidents.find(inc => inc.ambulanceId === ambulance.id);
            
            return (
              <Card key={ambulance.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${
                      ambulance.status === 'available' 
                        ? 'bg-green-100' 
                        : ambulance.status === 'busy' 
                          ? 'bg-amber-100' 
                          : 'bg-red-100'
                    }`}>
                      <Ambulance size={20} className={`${
                        ambulance.status === 'available' 
                          ? 'text-green-700' 
                          : ambulance.status === 'busy' 
                            ? 'text-amber-700' 
                            : 'text-red-700'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Ambulância {ambulance.plate}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        ambulance.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : ambulance.status === 'busy' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {ambulance.status === 'available' ? 'Disponível' : 
                         ambulance.status === 'busy' ? 'Em atendimento' : 'Em manutenção'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {associatedIncident && (
                  <div className="mt-3 bg-gray-50 p-2 rounded">
                    <p className="text-sm font-medium">Atendendo emergência:</p>
                    <p className="text-sm text-gray-600">Paciente: {associatedIncident.userName}</p>
                    <p className="text-sm text-gray-600">Local: {associatedIncident.location.address}</p>
                    <p className="text-sm text-gray-600">
                      Status: {getStatusLabel(associatedIncident.status)}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

// Helper function to get status label
const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    sos_acionado: "SOS Acionado",
    central_em_contato: "Central em Contato",
    ambulancia_a_caminho: "Ambulância a Caminho",
    ambulancia_chegou: "Ambulância Chegou",
    paciente_embarcado: "Paciente Embarcado",
    paciente_hospital: "Paciente no Hospital",
  };

  return statusLabels[status] || status;
};

export default AdminAmbulances;
