
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserPlus, Trash2, Bell, BellOff, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Switch
} from "@/components/ui/switch";

const Family = () => {
  const { currentUser, addFamilyMember, removeFamilyMember } = useApp();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
    receiveNotifications: true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  
  const toggleNotification = (name: string, value: boolean) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    
    if (!formData.relationship.trim()) {
      newErrors.relationship = "Relação é obrigatória";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    addFamilyMember(formData);
    
    // Reset form and close dialog
    setFormData({
      name: "",
      relationship: "",
      phone: "",
      receiveNotifications: true
    });
    setIsAddDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    removeFamilyMember(id);
    setDeleteConfirmationId(null);
  };

  return (
    <AppLayout title="Familiares" showBackButton>
      <div className="pb-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Seus familiares</h2>
          <Button 
            className="bg-supportlife-blue hover:bg-supportlife-darkblue"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <UserPlus size={18} className="mr-2" /> Adicionar
          </Button>
        </div>

        {(!currentUser?.familyMembers || currentUser.familyMembers.length === 0) ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <User size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">
              Você ainda não adicionou nenhum familiar.
              <br />
              Adicione familiares para que eles recebam alertas durante emergências.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentUser?.familyMembers.map(member => (
              <Card key={member.id} className="p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.relationship}</p>
                    <p className="text-sm text-gray-600 mt-1">{member.phone}</p>
                    <div className="flex items-center mt-2">
                      {member.receiveNotifications ? (
                        <>
                          <Bell size={14} className="text-supportlife-blue mr-1" />
                          <span className="text-xs text-supportlife-blue">Receberá notificações</span>
                        </>
                      ) : (
                        <>
                          <BellOff size={14} className="text-gray-400 mr-1" />
                          <span className="text-xs text-gray-400">Notificações desativadas</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteConfirmationId(member.id)}
                    className="h-8 w-8 text-gray-400 hover:text-supportlife-red hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add Family Member Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Familiar</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo*
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
                  Relação*
                </label>
                <Input
                  id="relationship"
                  name="relationship"
                  placeholder="Ex: Esposo, Filho, Mãe"
                  value={formData.relationship}
                  onChange={handleChange}
                  className={errors.relationship ? "border-red-500" : ""}
                />
                {errors.relationship && <p className="text-red-500 text-xs mt-1">{errors.relationship}</p>}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone*
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Receber notificações</p>
                  <p className="text-xs text-gray-500">Será notificado em caso de emergência</p>
                </div>
                <Switch 
                  checked={formData.receiveNotifications}
                  onCheckedChange={(value) => toggleNotification('receiveNotifications', value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                className="bg-supportlife-blue hover:bg-supportlife-darkblue" 
                onClick={handleSubmit}
              >
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirmationId} onOpenChange={() => setDeleteConfirmationId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
            </DialogHeader>
            <p className="py-4">
              Tem certeza que deseja remover este familiar da sua lista de contatos?
              Ele não receberá mais notificações em caso de emergência.
            </p>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDeleteConfirmationId(null)}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-supportlife-red hover:bg-red-700"
                onClick={() => deleteConfirmationId && handleDelete(deleteConfirmationId)}
              >
                Remover
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Family;
