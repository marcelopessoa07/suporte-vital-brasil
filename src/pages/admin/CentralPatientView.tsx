
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Phone, Mail, MapPin, User, UserCheck, Heart, BadgeAlert, Pill, CalendarClock, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const CentralPatientView = () => {
  const { id } = useParams<{ id: string }>();
  const { users, incidents } = useApp();
  const navigate = useNavigate();

  // Get user by ID
  const user = users.find(u => u.id === id);

  // Get active incidents for user
  const userIncidents = incidents.filter(inc => inc.userId === id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const activeIncident = userIncidents.find(inc => 
    inc.status !== 'paciente_hospital'
  );

  if (!user) {
    return (
      <AppLayout title="Paciente não encontrado" showBackButton>
        <div className="text-center py-10">
          <p className="text-gray-500">Paciente não encontrado</p>
          <Button 
            className="mt-4"
            onClick={() => navigate("/central/incidents")}
          >
            Voltar para ocorrências
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dados do Paciente" showBackButton>
      <div className="pb-20">
        {/* Alert for active incident */}
        {activeIncident && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Emergência ativa</h3>
              <p className="text-sm text-red-600">
                Este paciente possui uma emergência em andamento.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-2 border-red-300 text-red-700 hover:bg-red-50"
                onClick={() => navigate(`/central/incident/${activeIncident.id}`)}
              >
                Ver emergência
              </Button>
            </div>
          </div>
        )}

        {/* Patient basic info */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4 mb-4">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={32} className="text-gray-400" />
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <UserCheck size={14} />
                <span>Cadastro {user.isValidated ? 'validado' : 'não validado'}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-gray-500" />
              <span>{user.phone}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-gray-500" />
              <span>{user.email}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-gray-500" />
              <span>{user.address}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Heart size={18} className="text-gray-500" />
              <span>{user.plan.name} - {user.plan.status === 'active' ? 'Ativo' : 'Inativo'}</span>
            </div>
          </div>
        </Card>
        
        <Tabs defaultValue="medical" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="medical">Informações Médicas</TabsTrigger>
            <TabsTrigger value="family">Familiares</TabsTrigger>
          </TabsList>
          
          <TabsContent value="medical" className="pt-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Informações Médicas</h3>
              
              {user.medicalInfo ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <BadgeAlert size={18} className="text-supportlife-red" />
                      <h4 className="font-medium">Tipo Sanguíneo</h4>
                    </div>
                    <p className="text-sm pl-6">{user.medicalInfo.bloodType || "Não informado"}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle size={18} className="text-supportlife-red" />
                      <h4 className="font-medium">Alergias</h4>
                    </div>
                    <div className="pl-6">
                      {user.medicalInfo.allergies && user.medicalInfo.allergies.length > 0 ? (
                        <ul className="list-disc list-inside text-sm">
                          {user.medicalInfo.allergies.map((allergy, index) => (
                            <li key={index}>{allergy}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm">Nenhuma alergia registrada</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <BadgeAlert size={18} className="text-supportlife-blue" />
                      <h4 className="font-medium">Condições Médicas</h4>
                    </div>
                    <div className="pl-6">
                      {user.medicalInfo.conditions && user.medicalInfo.conditions.length > 0 ? (
                        <ul className="list-disc list-inside text-sm">
                          {user.medicalInfo.conditions.map((condition, index) => (
                            <li key={index}>{condition}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm">Nenhuma condição médica registrada</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Pill size={18} className="text-supportlife-blue" />
                      <h4 className="font-medium">Medicações</h4>
                    </div>
                    <div className="pl-6">
                      {user.medicalInfo.medications && user.medicalInfo.medications.length > 0 ? (
                        <ul className="list-disc list-inside text-sm">
                          {user.medicalInfo.medications.map((medication, index) => (
                            <li key={index}>{medication}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm">Nenhuma medicação registrada</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Phone size={18} className="text-supportlife-blue" />
                      <h4 className="font-medium">Contato de Emergência</h4>
                    </div>
                    <p className="text-sm pl-6">{user.medicalInfo.emergencyContact || "Não informado"}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>Não há informações médicas registradas para este paciente.</p>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="family" className="pt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Familiares</h3>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {user.familyMembers.length} {user.familyMembers.length === 1 ? 'familiar' : 'familiares'}
                  </span>
                </div>
              </div>
              
              {user.familyMembers.length > 0 ? (
                <div className="space-y-4">
                  {user.familyMembers.map(member => (
                    <div key={member.id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          member.receiveNotifications 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.receiveNotifications ? 'Recebe notificações' : 'Sem notificações'}
                        </span>
                      </div>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="py-1 font-medium">Relação</TableCell>
                            <TableCell className="py-1">{member.relationship}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="py-1 font-medium">Telefone</TableCell>
                            <TableCell className="py-1">{member.phone}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>Não há familiares registrados para este paciente.</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* History of incidents */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">Histórico de Emergências</h3>
          
          {userIncidents.length > 0 ? (
            <div className="space-y-4">
              {userIncidents.map(incident => (
                <div 
                  key={incident.id}
                  className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/central/incident/${incident.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <CalendarClock size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(incident.timestamp).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">
                        <strong>Local:</strong> {incident.location.address}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        incident.status === 'sos_acionado' ? 'bg-red-100 text-red-800' :
                        incident.status === 'paciente_hospital' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {incident.status === 'sos_acionado' ? 'Emergência' :
                         incident.status === 'paciente_hospital' ? 'Concluído' :
                         'Em Andamento'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Não há histórico de emergências para este paciente.</p>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default CentralPatientView;
