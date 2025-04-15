
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Search, Filter, AlertCircle, Calendar, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminPlans = () => {
  const { users, updateUserPlan } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlanStatus, setFilterPlanStatus] = useState<'active' | 'inactive' | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [planData, setPlanData] = useState({
    name: "",
    status: "active" as "active" | "inactive",
    expirationDate: "",
    price: 0
  });

  // Get today's date for filtering expiring plans
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  // Include only users (not admin or central)
  const allUsers = users.filter(user => user.role === 'user');
  
  // Filter users by search term and plan status
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlanStatus = filterPlanStatus === null || user.plan.status === filterPlanStatus;
    
    return matchesSearch && matchesPlanStatus;
  });

  // Filter users with expiring plans (within 30 days)
  const usersWithExpiringPlans = allUsers.filter(user => {
    const expirationDate = new Date(user.plan.expirationDate);
    return user.plan.status === 'active' && 
           expirationDate <= thirtyDaysFromNow;
  }).sort((a, b) => {
    return new Date(a.plan.expirationDate).getTime() - new Date(b.plan.expirationDate).getTime();
  });

  const openEditPlanDialog = (user: typeof users[0]) => {
    setEditingUserId(user.id);
    setPlanData({
      name: user.plan.name,
      status: user.plan.status,
      expirationDate: user.plan.expirationDate.split('T')[0],
      price: user.plan.price
    });
    setIsPlanDialogOpen(true);
  };

  const handleSavePlanChanges = () => {
    if (editingUserId) {
      updateUserPlan(editingUserId, planData);
      setIsPlanDialogOpen(false);
      setEditingUserId(null);
    }
  };

  return (
    <AppLayout title="Gerenciar Planos">
      <div className="pb-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciar Planos</h1>

        {/* Expiring Plans Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-amber-500" />
            <h2 className="text-lg font-semibold">Planos a Vencer (próximos 30 dias)</h2>
          </div>
          
          {usersWithExpiringPlans.length === 0 ? (
            <Card className="p-4 text-center text-gray-500">
              Nenhum plano expirando nos próximos 30 dias.
            </Card>
          ) : (
            <div className="space-y-4">
              {usersWithExpiringPlans.map(user => (
                <Card key={user.id} className="p-4 border-amber-200 bg-amber-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImage} alt={user.name} />
                        <AvatarFallback className="bg-supportlife-blue text-white">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <div className="flex items-center text-sm text-amber-700">
                          <Calendar size={14} className="mr-1" />
                          Expira em: {new Date(user.plan.expirationDate).toLocaleDateString('pt-BR')}
                          <Badge variant="outline" className="ml-2">
                            {user.plan.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm"
                      onClick={() => openEditPlanDialog(user)}
                    >
                      Renovar Plano
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* All Plans Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Todos os Planos</h2>
          
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter size={16} />
                    Filtrar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuCheckboxItem
                    checked={filterPlanStatus === 'active'}
                    onCheckedChange={() => setFilterPlanStatus(filterPlanStatus === 'active' ? null : 'active')}
                  >
                    Planos Ativos
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterPlanStatus === 'inactive'}
                    onCheckedChange={() => setFilterPlanStatus(filterPlanStatus === 'inactive' ? null : 'inactive')}
                  >
                    Planos Inativos
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Users list */}
          {filteredUsers.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">
              Nenhum usuário encontrado.
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map(user => (
                <Card 
                  key={user.id}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImage} alt={user.name} />
                        <AvatarFallback className="bg-supportlife-blue text-white">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={user.plan.status === 'active' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                              : 'bg-red-100 text-red-800 hover:bg-red-100'}
                          >
                            {user.plan.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {user.plan.name} - R$ {user.plan.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            Expira: {new Date(user.plan.expirationDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => openEditPlanDialog(user)}
                    >
                      Editar Plano
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Plan Dialog */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Plano</DialogTitle>
            <DialogDescription>
              Atualize as informações do plano do usuário.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="planName">Nome do Plano</Label>
              <Input
                id="planName"
                value={planData.name}
                onChange={(e) => setPlanData({...planData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="planStatus">Status do Plano</Label>
              <Select 
                value={planData.status}
                onValueChange={(value: "active" | "inactive") => setPlanData({...planData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="planExpirationDate">Data de Expiração</Label>
              <Input
                id="planExpirationDate"
                type="date"
                value={planData.expirationDate}
                onChange={(e) => setPlanData({...planData, expirationDate: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="planPrice">Valor (R$)</Label>
              <Input
                id="planPrice"
                type="number"
                step="0.01"
                value={planData.price}
                onChange={(e) => setPlanData({...planData, price: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPlanDialogOpen(false)}>
              <X size={16} className="mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSavePlanChanges} className="bg-supportlife-blue hover:bg-supportlife-darkblue">
              <Check size={16} className="mr-2" />
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default AdminPlans;
