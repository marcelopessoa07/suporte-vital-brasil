
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, User, Mail, Phone, MapPin, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppLayout title="Meu Perfil" showBackButton>
      <div className="pb-24">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-supportlife-blue rounded-full flex items-center justify-center text-white text-3xl font-medium mb-4">
            {currentUser.name.charAt(0)}
          </div>
          <h2 className="text-xl font-semibold">{currentUser.name}</h2>
          <p className="text-sm text-gray-500">
            {currentUser.plan.status === 'active' ? 'Plano Ativo' : 'Plano Inativo'}
          </p>
        </div>

        {/* Personal Information */}
        <Card className="p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Informações Pessoais</h3>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
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
      </div>
    </AppLayout>
  );
};

export default Profile;
