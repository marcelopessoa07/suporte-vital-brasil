
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Search, Check, X, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminUsers = () => {
  const { users, validateUser } = useApp();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValidated, setFilterValidated] = useState<boolean | null>(null);
  const [filterPlanStatus, setFilterPlanStatus] = useState<'active' | 'inactive' | null>(null);
  
  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    
    const matchesValidation = filterValidated === null || user.isValidated === filterValidated;
    
    const matchesPlanStatus = filterPlanStatus === null || user.plan.status === filterPlanStatus;
    
    return matchesSearch && matchesValidation && matchesPlanStatus;
  });

  return (
    <AppLayout title="Gerenciar Usuários">
      <div className="pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar por nome, email ou telefone..."
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
                  checked={filterValidated === true}
                  onCheckedChange={() => setFilterValidated(filterValidated === true ? null : true)}
                >
                  Validados
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterValidated === false}
                  onCheckedChange={() => setFilterValidated(filterValidated === false ? null : false)}
                >
                  Não Validados
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterPlanStatus === 'active'}
                  onCheckedChange={() => setFilterPlanStatus(filterPlanStatus === 'active' ? null : 'active')}
                >
                  Plano Ativo
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterPlanStatus === 'inactive'}
                  onCheckedChange={() => setFilterPlanStatus(filterPlanStatus === 'inactive' ? null : 'inactive')}
                >
                  Plano Inativo
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
          <div className="space-y-4">
            {filteredUsers.map(user => (
              <Card 
                key={user.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-semibold">{user.name}</h3>
                      {!user.isValidated && (
                        <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                          Pendente
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-600 mt-1">{user.phone}</p>
                    <div className="flex items-center mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.plan.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.plan.status === 'active' ? 'Plano Ativo' : 'Plano Inativo'}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        Expira: {new Date(user.plan.expirationDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!user.isValidated && (
                      <Button 
                        onClick={() => validateUser(user.id)}
                        className="h-8 bg-supportlife-blue hover:bg-supportlife-darkblue"
                        size="sm"
                      >
                        <Check size={16} className="mr-1" /> Validar
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/admin/user/${user.id}`)}
                      className="h-8"
                      size="sm"
                    >
                      Detalhes
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminUsers;
