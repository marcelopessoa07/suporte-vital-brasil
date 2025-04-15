
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { AlertCircle, Heart, Users, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IncidentStatusBadge } from "@/components/ui/IncidentStatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";

const Home = () => {
  const { currentUser, incidents, triggerSOS } = useApp();
  const navigate = useNavigate();
  const [isConfirmingSOSOpen, setIsConfirmingSOSOpen] = useState(false);

  // Get active incidents for the current user
  const activeIncident = incidents
    .filter(inc => inc.userId === currentUser?.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  const handleSOSButton = () => {
    setIsConfirmingSOSOpen(true);
  };
  
  const confirmSOS = () => {
    // In a real app, this would get the actual GPS location
    const mockLocation = {
      latitude: -23.550520,
      longitude: -46.633308,
      address: "Av. Paulista, 1000 - São Paulo, SP"
    };
    
    triggerSOS(mockLocation);
    setIsConfirmingSOSOpen(false);
    navigate("/incidents");
  };

  return (
    <AppLayout title="Início">
      <div className="mb-24"> {/* Add bottom margin to avoid navbar overlap */}
        {/* Greeting section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Olá, {currentUser?.name.split(" ")[0]}!
          </h2>
          <p className="text-gray-500">Como podemos ajudar hoje?</p>
        </div>

        {/* SOS Button */}
        <div className="flex justify-center my-8">
          <button
            onClick={handleSOSButton}
            className="w-40 h-40 rounded-full bg-supportlife-red text-white flex flex-col items-center justify-center sos-button shadow-lg transition-transform hover:scale-105 active:scale-95"
            disabled={!!activeIncident}
          >
            <AlertCircle size={60} />
            <span className="text-2xl font-bold mt-2">SOS</span>
          </button>
        </div>

        {/* Active incident card */}
        {activeIncident && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">Emergência Ativa</h3>
              <IncidentStatusBadge status={activeIncident.status} />
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              {new Date(activeIncident.timestamp).toLocaleString('pt-BR')}
            </p>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                className="text-supportlife-blue border-supportlife-blue"
                onClick={() => navigate(`/incident/${activeIncident.id}`)}
              >
                Ver Detalhes
              </Button>
              
              <Button 
                variant="ghost"
                className="text-gray-500"
                onClick={() => navigate("/incidents")}
              >
                <Bell size={16} className="mr-1" /> 
                Todas as Emergências
              </Button>
            </div>
          </div>
        )}

        {/* Quick access buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center border-2"
            onClick={() => navigate("/family")}
          >
            <Users size={24} className="mb-2 text-supportlife-blue" />
            <span>Familiares</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center border-2"
            onClick={() => navigate("/plan")}
          >
            <Heart size={24} className="mb-2 text-supportlife-blue" />
            <span>Meu Plano</span>
          </Button>
        </div>

        {/* Plan status card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-md font-semibold mb-2">Status do Plano</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{currentUser?.plan.name}</p>
              <p className="text-sm text-gray-500">
                Validade: {new Date(currentUser?.plan.expirationDate || "").toLocaleDateString('pt-BR')}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentUser?.plan.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {currentUser?.plan.status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
      </div>
      
      {/* SOS Confirmation Dialog */}
      <Dialog open={isConfirmingSOSOpen} onOpenChange={setIsConfirmingSOSOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-red-600">Confirmar Emergência</DialogTitle>
            <DialogDescription className="text-center">
              Você está prestes a acionar uma emergência médica.
              <br />A central será notificada imediatamente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-6">
            <AlertCircle size={80} className="text-red-500" />
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="sm:flex-1" onClick={() => setIsConfirmingSOSOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 sm:flex-1" onClick={confirmSOS}>
              Confirmar Emergência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Home;
