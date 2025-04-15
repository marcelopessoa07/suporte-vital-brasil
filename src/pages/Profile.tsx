
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, User, Mail, Phone, MapPin, CreditCard, Calendar, Heart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { MedicalInfo } from "@/types";

const Profile = () => {
  const { currentUser, logout, updateUserProfile, updateUserMedicalInfo } = useApp();
  const navigate = useNavigate();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editMedicalOpen, setEditMedicalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    profileImage: currentUser?.profileImage || "",
  });
  const [medicalData, setMedicalData] = useState<MedicalInfo>({
    bloodType: currentUser?.medicalInfo?.bloodType || "",
    allergies: currentUser?.medicalInfo?.allergies || [],
    conditions: currentUser?.medicalInfo?.conditions || [],
    medications: currentUser?.medicalInfo?.medications || [],
    emergencyContact: currentUser?.medicalInfo?.emergencyContact || "",
  });

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const saveProfileChanges = () => {
    if (currentUser) {
      updateUserProfile(currentUser.id, profileData);
      setEditProfileOpen(false);
    }
  };

  const saveMedicalChanges = () => {
    if (currentUser) {
      updateUserMedicalInfo(currentUser.id, medicalData);
      setEditMedicalOpen(false);
    }
  };

  const handleArrayInput = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: 'allergies' | 'conditions' | 'medications'
  ) => {
    // Split by newlines and filter empty strings
    const values = e.target.value
      .split('\n')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    setMedicalData({ ...medicalData, [field]: values });
  };

  return (
    <AppLayout title="Meu Perfil" showBackButton>
      <div className="pb-24">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-24 h-24 border-2 border-supportlife-blue">
            <AvatarImage 
              src={currentUser.profileImage} 
              alt={currentUser.name} 
            />
            <AvatarFallback className="bg-supportlife-blue text-white text-3xl">
              {currentUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold mt-4">{currentUser.name}</h2>
          <p className={cn(
            "text-sm px-2 py-1 rounded mt-1",
            currentUser.plan.status === 'active' 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          )}>
            {currentUser.plan.status === 'active' ? 'Plano Ativo' : 'Plano Inativo'}
          </p>
        </div>

        {/* Personal Information */}
        <Card className="p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Informações Pessoais</h3>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setEditProfileOpen(true)}>
              <Pencil size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <User size={18} className="mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Nome completo</p>
                <p className="text-sm text-gray-600">{currentUser.name}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail size={18} className="mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone size={18} className="mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Telefone</p>
                <p className="text-sm text-gray-600">{currentUser.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CreditCard size={18} className="mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">CPF</p>
                <p className="text-sm text-gray-600">{currentUser.cpf}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin size={18} className="mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Endereço</p>
                <p className="text-sm text-gray-600">{currentUser.address}</p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Medical Information */}
        <Card className="p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Informações Médicas</h3>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setEditMedicalOpen(true)}>
              <Pencil size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <Heart size={18} className="mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Tipo Sanguíneo</p>
                <p className="text-sm text-gray-600">{currentUser.medicalInfo?.bloodType || "Não informado"}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <X size={18} className="mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Alergias</p>
                {currentUser.medicalInfo?.allergies && currentUser.medicalInfo.allergies.length > 0 ? (
                  <ul className="list-disc ml-4 text-sm text-gray-600">
                    {currentUser.medicalInfo.allergies.map((allergy, index) => (
                      <li key={index}>{allergy}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">Nenhuma alergia registrada</p>
                )}
              </div>
            </div>
            
            <div className="flex items-start">
              <Heart size={18} className="mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Condições Médicas</p>
                {currentUser.medicalInfo?.conditions && currentUser.medicalInfo.conditions.length > 0 ? (
                  <ul className="list-disc ml-4 text-sm text-gray-600">
                    {currentUser.medicalInfo.conditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">Nenhuma condição registrada</p>
                )}
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar size={18} className="mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Medicamentos</p>
                {currentUser.medicalInfo?.medications && currentUser.medicalInfo.medications.length > 0 ? (
                  <ul className="list-disc ml-4 text-sm text-gray-600">
                    {currentUser.medicalInfo.medications.map((medication, index) => (
                      <li key={index}>{medication}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">Nenhum medicamento registrado</p>
                )}
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone size={18} className="mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Contato de Emergência</p>
                <p className="text-sm text-gray-600">{currentUser.medicalInfo?.emergencyContact || "Não informado"}</p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Plan Information */}
        <Card className="p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Informações do Plano</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <CreditCard size={18} className="mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Nome do Plano</p>
                <p className="text-sm text-gray-600">{currentUser.plan.name}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar size={18} className="mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Data de Expiração</p>
                <p className="text-sm text-gray-600">
                  {new Date(currentUser.plan.expirationDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar size={18} className="mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Valor</p>
                <p className="text-sm text-gray-600">
                  R$ {currentUser.plan.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Actions */}
        <Card className="p-5">
          <h3 className="text-lg font-semibold mb-4">Ações</h3>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Pencil size={16} className="mr-2" />
              Alterar senha
            </Button>
            
            <Button onClick={handleLogout} variant="destructive" className="w-full justify-start">
              Sair do aplicativo
            </Button>
          </div>
        </Card>
        
        {/* Edit Profile Dialog */}
        <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
              <DialogDescription>
                Atualize suas informações pessoais
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center mb-4">
                <Label htmlFor="profileImage" className="text-center mb-2">Foto de Perfil (URL)</Label>
                <Avatar className="w-20 h-20 mb-2">
                  <AvatarImage src={profileData.profileImage} />
                  <AvatarFallback className="bg-supportlife-blue text-white">
                    {profileData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Input
                  id="profileImage"
                  value={profileData.profileImage}
                  onChange={(e) => setProfileData({...profileData, profileImage: e.target.value})}
                  placeholder="URL da imagem"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditProfileOpen(false)}>Cancelar</Button>
              <Button onClick={saveProfileChanges}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Medical Info Dialog */}
        <Dialog open={editMedicalOpen} onOpenChange={setEditMedicalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Informações Médicas</DialogTitle>
              <DialogDescription>
                Atualize suas informações médicas para melhor atendimento
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Tipo Sanguíneo</Label>
                <Input
                  id="bloodType"
                  value={medicalData.bloodType}
                  onChange={(e) => setMedicalData({...medicalData, bloodType: e.target.value})}
                  placeholder="Ex: A+, B-, O+"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies">Alergias (uma por linha)</Label>
                <Textarea
                  id="allergies"
                  value={medicalData.allergies?.join('\n')}
                  onChange={(e) => handleArrayInput(e, 'allergies')}
                  placeholder="Ex: Penicilina&#10;Aspirina"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="conditions">Condições Médicas (uma por linha)</Label>
                <Textarea
                  id="conditions"
                  value={medicalData.conditions?.join('\n')}
                  onChange={(e) => handleArrayInput(e, 'conditions')}
                  placeholder="Ex: Hipertensão&#10;Diabetes"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medications">Medicamentos (um por linha)</Label>
                <Textarea
                  id="medications"
                  value={medicalData.medications?.join('\n')}
                  onChange={(e) => handleArrayInput(e, 'medications')}
                  placeholder="Ex: Losartana 50mg&#10;Metformina 500mg"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contato de Emergência</Label>
                <Input
                  id="emergencyContact"
                  value={medicalData.emergencyContact}
                  onChange={(e) => setMedicalData({...medicalData, emergencyContact: e.target.value})}
                  placeholder="(11) 98765-4321"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditMedicalOpen(false)}>Cancelar</Button>
              <Button onClick={saveMedicalChanges}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Profile;
