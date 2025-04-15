
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Bell, Users, Ambulance, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IncidentStatusBadge } from "@/components/ui/IncidentStatusBadge";

const AdminDashboard = () => {
  const { incidents, users, ambulances } = useApp();
  const navigate = useNavigate();

  // Count active incidents
  const activeIncidents = incidents.filter(
    incident => incident.status !== "paciente_hospital"
  );

  // Count available ambulances
  const availableAmbulances = ambulances.filter(
    ambulance => ambulance.status === "available"
  );

  // Count pending validations
  const pendingValidations = users.filter(
    user => !user.isValidated
  );

  // Recent incidents
  const recentIncidents = [...incidents]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <AppLayout title="Dashboard Admin">
      <div className="pb-6">
        <h1 className="text-2xl font-bold mb-6">Painel Geral</h1>

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

          <Card className="p-4 bg-amber-50 border-amber-100">
            <div className="flex items-start">
              <div className="bg-amber-100 p-3 rounded-full mr-3">
                <Users size={20} className="text-amber-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Validações pendentes</p>
                <p className="text-2xl font-bold">{pendingValidations.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent incidents */}
        <Card className="p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Emergências recentes</h2>
            <button
              onClick={() => navigate("/admin/incidents")}
              className="text-sm text-supportlife-blue hover:underline"
            >
              Ver todas
            </button>
          </div>

          {recentIncidents.length === 0 ? (
            <p className="text-center text-gray-500 py-6">Nenhuma emergência registrada</p>
          ) : (
            <div className="space-y-4">
              {recentIncidents.map(incident => (
                <div 
                  key={incident.id}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/admin/incident/${incident.id}`)}
                >
                  <div>
                    <p className="font-medium">{incident.userName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(incident.timestamp).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {incident.location.address.substring(0, 40)}...
                    </p>
                  </div>
                  <div>
                    <IncidentStatusBadge status={incident.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Pending validations */}
        {pendingValidations.length > 0 && (
          <Card className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Validações Pendentes</h2>
              <button 
                onClick={() => navigate("/admin/users")}
                className="text-sm text-supportlife-blue hover:underline"
              >
                Ver todas
              </button>
            </div>

            <div className="space-y-3">
              {pendingValidations.slice(0, 3).map(user => (
                <div 
                  key={user.id}
                  className="flex justify-between items-center p-3 border border-amber-200 bg-amber-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <button
                    className="text-white bg-supportlife-blue hover:bg-supportlife-darkblue py-1 px-3 rounded-md text-sm"
                    onClick={() => navigate(`/admin/user/${user.id}`)}
                  >
                    Validar
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
