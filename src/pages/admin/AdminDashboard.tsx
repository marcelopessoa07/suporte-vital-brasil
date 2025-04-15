
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Bell, Users, Calendar, ChevronRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IncidentStatusBadge } from "@/components/ui/IncidentStatusBadge";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
  
  // INDICATOR 1: Number of calls by final status
  const generateFinalStatusData = () => {
    // Create a comprehensive set of simulated final statuses
    const simulatedStatusData = [
      { status: "Ambulância mobilizada", value: 45 },
      { status: "Orientação por telefone", value: 32 },
      { status: "Transferência para hospital", value: 28 },
      { status: "Falso alarme", value: 15 },
      { status: "Outros", value: 8 }
    ];
    
    // Add actual data from our incidents
    const hospitalCases = filteredIncidents.filter(i => 
      i.status === "paciente_hospital"
    ).length;
    
    if (hospitalCases > 0) {
      simulatedStatusData[2].value += hospitalCases;
    }
    
    return simulatedStatusData;
  };
  
  const finalStatusData = generateFinalStatusData();
  const COLORS = ['#9b87f5', '#F97316', '#0EA5E9', '#8B5CF6', '#33C3F0', '#ea384c'];
  
  // INDICATOR 2: Average response time between call entry and ambulance arrival
  const generateResponseTimeData = () => {
    // Simulated response time data - this would normally come from timestamp differences
    const responseTimeData = [
      { month: 'Jan', averageMinutes: 15.8 },
      { month: 'Fev', averageMinutes: 14.3 },
      { month: 'Mar', averageMinutes: 16.1 },
      { month: 'Abr', averageMinutes: 13.7 },
      { month: 'Mai', averageMinutes: 12.8 },
      { month: 'Jun', averageMinutes: 11.9 }
    ];
    
    // If we are showing only recent data, truncate to show fewer months
    if (timeRange === "7d") {
      return responseTimeData.slice(5);
    } else if (timeRange === "30d") {
      return responseTimeData.slice(4);
    } else if (timeRange === "90d") {
      return responseTimeData.slice(3);
    }
    
    return responseTimeData;
  };
  
  const responseTimeData = generateResponseTimeData();

  return (
    <AppLayout title="Dashboard Admin">
      <div className="pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Central de Operações</h1>
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

          <Card className="p-4 bg-blue-50 border-blue-100">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <Clock size={20} className="text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tempo médio de resposta</p>
                <p className="text-2xl font-bold">13.2 min</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Key indicator charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* INDICATOR 1: Final Status Distribution */}
          <Card className="p-5 col-span-1">
            <h2 className="text-lg font-semibold mb-4">Distribuição de Atendimentos</h2>
            <div className="h-64">
              <ChartContainer config={{}}>
                <PieChart>
                  <Pie
                    data={finalStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="status"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {finalStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ChartContainer>
            </div>
          </Card>

          {/* INDICATOR 2: Response Time */}
          <Card className="p-5 col-span-1">
            <h2 className="text-lg font-semibold mb-4">Tempo Médio Entre Chamada e Chegada</h2>
            <div className="h-64">
              <ChartContainer config={{}}>
                <BarChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'minutos', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value} min`, 'Tempo Médio']} />
                  <Bar dataKey="averageMinutes" fill="#0EA5E9" />
                </BarChart>
              </ChartContainer>
            </div>
          </Card>
        </div>

        {/* Recent incidents */}
        <Card className="p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Emergências recentes</h2>
            <Button
              onClick={() => navigate("/admin/incidents")}
              variant="ghost"
              className="text-sm text-supportlife-blue hover:underline flex items-center"
            >
              Ver todas <ChevronRight size={16} />
            </Button>
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
              <Button 
                onClick={() => navigate("/admin/users")}
                variant="ghost"
                className="text-sm text-supportlife-blue hover:underline flex items-center"
              >
                Ver todas <ChevronRight size={16} />
              </Button>
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
                  <Button
                    className="text-white bg-supportlife-blue hover:bg-supportlife-darkblue"
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                  >
                    Validar
                  </Button>
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
