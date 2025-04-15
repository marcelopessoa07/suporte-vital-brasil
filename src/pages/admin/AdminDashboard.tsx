
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Bell, Users, Ambulance, AlertCircle, ChevronRight, TrendingUp, Clock, UserCheck, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IncidentStatusBadge } from "@/components/ui/IncidentStatusBadge";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

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

  // Operational metrics for charts
  const incidentsByStatus = [
    { name: 'SOS acionado', value: incidents.filter(i => i.status === 'sos_acionado').length },
    { name: 'Central em contato', value: incidents.filter(i => i.status === 'central_em_contato').length },
    { name: 'Central acionada', value: incidents.filter(i => i.status === 'central_acionada').length },
    { name: 'Ambulância a caminho', value: incidents.filter(i => i.status === 'ambulancia_a_caminho').length },
    { name: 'Chegada ao local', value: incidents.filter(i => i.status === 'chegada_local').length },
    { name: 'A caminho do hospital', value: incidents.filter(i => i.status === 'a_caminho_hospital').length },
    { name: 'No hospital', value: incidents.filter(i => i.status === 'paciente_hospital').length },
  ];

  const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#8884d8', '#82ca9d'];
  
  // Mock data for incident trends (past 7 days)
  const incidentTrends = [
    { name: 'Seg', incidents: 4 },
    { name: 'Ter', incidents: 3 },
    { name: 'Qua', incidents: 5 },
    { name: 'Qui', incidents: 2 },
    { name: 'Sex', incidents: 6 },
    { name: 'Sab', incidents: 8 },
    { name: 'Dom', incidents: 7 },
  ];

  // Mock data for response times
  const responseTimes = [
    { name: 'SOS → Central', tempo: 1.2 },
    { name: 'Central → Ambulância', tempo: 4.5 },
    { name: 'Despacho → Chegada', tempo: 12.3 },
    { name: 'Recolhimento → Hospital', tempo: 15.6 },
  ];

  return (
    <AppLayout title="Dashboard Admin">
      <div className="pb-6">
        <h1 className="text-2xl font-bold mb-6">Painel Geral de Operações</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

          <Card className="p-4 bg-green-50 border-green-100">
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-3">
                <UserCheck size={20} className="text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Usuários ativos</p>
                <p className="text-2xl font-bold">{users.filter(u => u.isValidated).length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Incident Status Distribution */}
          <Card className="p-5">
            <h2 className="text-lg font-semibold mb-4">Distribuição de Status</h2>
            <div className="h-72">
              <ChartContainer config={{}}>
                <PieChart>
                  <Pie
                    data={incidentsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {incidentsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ChartContainer>
            </div>
          </Card>

          {/* Incident Trends */}
          <Card className="p-5">
            <h2 className="text-lg font-semibold mb-4">Tendência de Emergências (7 dias)</h2>
            <div className="h-72">
              <ChartContainer config={{}}>
                <AreaChart data={incidentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="incidents" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ChartContainer>
            </div>
          </Card>

          {/* Response Time Metrics */}
          <Card className="p-5">
            <h2 className="text-lg font-semibold mb-4">Tempo Médio de Resposta (min)</h2>
            <div className="h-72">
              <ChartContainer config={{}}>
                <BarChart data={responseTimes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tempo" fill="#82ca9d" />
                </BarChart>
              </ChartContainer>
            </div>
          </Card>

          {/* KPI Card */}
          <Card className="p-5">
            <h2 className="text-lg font-semibold mb-4">KPIs de Operação</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="text-blue-500 mr-3" size={24} />
                  <div>
                    <p className="font-medium">Tempo médio de atendimento</p>
                    <p className="text-sm text-gray-500">Do SOS até chegada ao hospital</p>
                  </div>
                </div>
                <p className="font-bold text-lg">34.5 min</p>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="text-green-500 mr-3" size={24} />
                  <div>
                    <p className="font-medium">Taxa de sobrevivência</p>
                    <p className="text-sm text-gray-500">Casos críticos</p>
                  </div>
                </div>
                <p className="font-bold text-lg">98.2%</p>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="text-amber-500 mr-3" size={24} />
                  <div>
                    <p className="font-medium">Custo médio por atendimento</p>
                    <p className="text-sm text-gray-500">Operacional + equipamentos</p>
                  </div>
                </div>
                <p className="font-bold text-lg">R$ 780,00</p>
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
              className="text-sm text-supportlife-blue hover:underline flex items-center"
            >
              Ver todas <ChevronRight size={16} />
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
                className="text-sm text-supportlife-blue hover:underline flex items-center"
              >
                Ver todas <ChevronRight size={16} />
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
                    onClick={() => navigate(`/admin/users/${user.id}`)}
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
