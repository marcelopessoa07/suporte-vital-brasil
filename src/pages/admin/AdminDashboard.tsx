
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Bell, Users, Calendar, AlertCircle, ChevronRight, TrendingUp, Clock, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IncidentStatusBadge } from "@/components/ui/IncidentStatusBadge";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDashboard = () => {
  const { incidents, users } = useApp();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<string>("7d");

  // Count active incidents
  const activeIncidents = incidents.filter(
    incident => incident.status !== "paciente_hospital"
  );

  // Count pending validations
  const pendingValidations = users.filter(
    user => !user.isValidated
  );

  // Recent incidents
  const recentIncidents = [...incidents]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  // Filter data based on selected time range
  const getFilteredData = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch(timeRange) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    return incidents.filter(incident => 
      new Date(incident.timestamp) >= startDate
    );
  };

  const filteredIncidents = getFilteredData();

  // Operational metrics for charts - using filtered data
  const incidentsByStatus = [
    { name: 'SOS acionado', value: filteredIncidents.filter(i => i.status === 'sos_acionado').length },
    { name: 'Central em contato', value: filteredIncidents.filter(i => i.status === 'central_em_contato').length },
    { name: 'Central acionada', value: filteredIncidents.filter(i => i.status === 'central_acionada').length },
    { name: 'Ambulância a caminho', value: filteredIncidents.filter(i => i.status === 'ambulancia_a_caminho').length },
    { name: 'Chegada ao local', value: filteredIncidents.filter(i => i.status === 'chegada_local').length },
    { name: 'A caminho do hospital', value: filteredIncidents.filter(i => i.status === 'a_caminho_hospital').length },
    { name: 'No hospital', value: filteredIncidents.filter(i => i.status === 'paciente_hospital').length },
  ];

  const COLORS = ['#9b87f5', '#F97316', '#0EA5E9', '#ea384c', '#8B5CF6', '#33C3F0'];
  
  // Generate data for incident trends based on the time range
  const generateTrendData = () => {
    const dateMap: { [key: string]: number } = {};
    const dateFormat: Intl.DateTimeFormatOptions = 
      timeRange === "year" ? { month: 'short' } : { day: '2-digit', month: 'short' };
    
    let interval = 1;
    if (timeRange === "30d") interval = 3;
    if (timeRange === "90d") interval = 7;
    if (timeRange === "year") interval = 30;
    
    // Initialize dates
    let currentDate = new Date();
    const startDate = new Date();
    
    if (timeRange === "7d") startDate.setDate(currentDate.getDate() - 7);
    if (timeRange === "30d") startDate.setDate(currentDate.getDate() - 30);
    if (timeRange === "90d") startDate.setDate(currentDate.getDate() - 90);
    if (timeRange === "year") startDate.setFullYear(currentDate.getFullYear() - 1);
    
    // Initialize all dates in range with 0 incidents
    while (currentDate >= startDate) {
      const dateStr = currentDate.toLocaleDateString('pt-BR', dateFormat);
      dateMap[dateStr] = 0;
      currentDate.setDate(currentDate.getDate() - interval);
    }
    
    // Count incidents per date
    filteredIncidents.forEach(incident => {
      const incidentDate = new Date(incident.timestamp);
      const dateStr = incidentDate.toLocaleDateString('pt-BR', dateFormat);
      if (dateMap[dateStr] !== undefined) {
        dateMap[dateStr]++;
      }
    });
    
    // Convert to array format for chart
    return Object.entries(dateMap)
      .map(([name, incidents]) => ({ name, incidents }))
      .sort((a, b) => {
        // For year view, sort by month
        if (timeRange === "year") {
          const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
          return months.indexOf(a.name.toLowerCase()) - months.indexOf(b.name.toLowerCase());
        }
        return 0;
      });
  };
  
  const incidentTrends = generateTrendData();

  // Response time data - this would ideally come from actual data rather than mocked
  const generateResponseTimes = () => {
    // Calculate average response times based on filtered incidents
    // This is simplified mock data - in a real implementation, you would compute these values
    return [
      { name: 'SOS → Central', tempo: Math.random() * 2 + 1 },
      { name: 'Central → Ambulância', tempo: Math.random() * 3 + 3 },
      { name: 'Despacho → Chegada', tempo: Math.random() * 5 + 10 },
    ];
  };

  const responseTimes = generateResponseTimes();

  return (
    <AppLayout title="Dashboard Admin">
      <div className="pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Painel Geral de Operações</h1>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período de análise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="year">Último ano</SelectItem>
              </SelectContent>
            </Select>
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

        {/* Key indicator charts - reduced to 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Incident Status Distribution */}
          <Card className="p-5 col-span-1">
            <h2 className="text-lg font-semibold mb-4">Status das Emergências</h2>
            <div className="h-64">
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
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
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
          <Card className="p-5 col-span-1">
            <h2 className="text-lg font-semibold mb-4">Tendência de Emergências</h2>
            <div className="h-64">
              <ChartContainer config={{}}>
                <AreaChart data={incidentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="incidents" stroke="#9b87f5" fill="#9b87f5" />
                </AreaChart>
              </ChartContainer>
            </div>
          </Card>

          {/* Response Time Metrics */}
          <Card className="p-5 col-span-1">
            <h2 className="text-lg font-semibold mb-4">Tempo Médio de Resposta (min)</h2>
            <div className="h-64">
              <ChartContainer config={{}}>
                <BarChart data={responseTimes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tempo" fill="#0EA5E9" />
                </BarChart>
              </ChartContainer>
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
