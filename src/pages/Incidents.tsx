
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { IncidentStatusBadge } from "@/components/ui/IncidentStatusBadge";
import { Calendar, Clock } from "lucide-react";

const Incidents = () => {
  const { incidents, currentUser } = useApp();
  const navigate = useNavigate();

  // Filter incidents for the current user
  const userIncidents = incidents.filter(
    incident => incident.userId === currentUser?.id
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AppLayout title="Emergências" showBackButton>
      <div className="pb-24">
        <h2 className="text-xl font-semibold mb-4">Suas emergências</h2>

        {userIncidents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
            Você não tem emergências registradas.
          </div>
        ) : (
          <div className="space-y-4">
            {userIncidents.map((incident) => (
              <Card
                key={incident.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/incident/${incident.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center mb-2">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {formatDate(incident.timestamp)}
                    </span>
                    <Clock size={16} className="ml-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {formatTime(incident.timestamp)}
                    </span>
                  </div>
                  <IncidentStatusBadge status={incident.status} />
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <strong>Local:</strong> {incident.location.address}
                  </p>
                  {incident.hospitalName && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Hospital:</strong> {incident.hospitalName}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Incidents;
