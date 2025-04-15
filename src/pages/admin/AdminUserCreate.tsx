
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Check, Save, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminUserCreate = () => {
  const { createUser, resetPasswordRequest } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    address: "",
    role: "user",
    profileImage: "",
    medicalInfo: {
      bloodType: "",
      allergies: [] as string[],
      conditions: [] as string[],
      medications: [] as string[],
      emergencyContact: ""
    },
    plan: {
      id: "1",
      name: "Plano Básico",
      status: "active" as "active" | "inactive",
      expirationDate: new Date().toISOString().split("T")[0],
      price: 69.90
    }
  });
  
  const [allergiesText, setAllergiesText] = useState("");
  const [conditionsText, setConditionsText] = useState("");
  const [medicationsText, setMedicationsText] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    field: string, 
    nestedField?: string
  ) => {
    if (nestedField) {
      setFormData({
        ...formData,
        [field]: {
          ...formData[field as keyof typeof formData],
          [nestedField]: e.target.value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: e.target.value
      });
    }
  };
  
  const handleSelectChange = (value: string, field: string, nestedField?: string) => {
    if (nestedField) {
      setFormData({
        ...formData,
        [field]: {
          ...formData[field as keyof typeof formData],
          [nestedField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const processArrayText = (text: string): string[] => {
    return text.split('\n')
      .map(item => item.trim())
      .filter(item => item !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Process text areas into arrays
      const medicalInfo = {
        ...formData.medicalInfo,
        allergies: processArrayText(allergiesText),
        conditions: processArrayText(conditionsText),
        medications: processArrayText(medicationsText)
      };
      
      // Create the user
      const success = await createUser({
        ...formData,
        medicalInfo
      });
      
      if (success) {
        toast.success("Usuário criado com sucesso. Um email será enviado para definição de senha.");
        navigate("/admin/users");
      } else {
        toast.error("Erro ao criar usuário.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao processar a solicitação.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="Criar Novo Usuário">
      <div className="pb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Adicionar Novo Usuário</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Informações Básicas</h3>
              
              <div className="flex flex-col items-center mb-4">
                <Label htmlFor="profileImage" className="text-center mb-2">Foto de Perfil (URL)</Label>
                <Avatar className="w-20 h-20 mb-2">
                  <AvatarImage src={formData.profileImage} />
                  <AvatarFallback className="bg-supportlife-blue text-white">
                    {formData.name.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Input
                  id="profileImage"
                  value={formData.profileImage}
                  onChange={(e) => handleChange(e, "profileImage")}
                  placeholder="URL da imagem"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo*</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange(e, "name")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email*</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange(e, "email")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone*</Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange(e, "phone")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF*</Label>
                  <Input
                    id="cpf"
                    required
                    value={formData.cpf}
                    onChange={(e) => handleChange(e, "cpf")}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Endereço Completo*</Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => handleChange(e, "address")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Tipo de Usuário*</Label>
                  <Select 
                    defaultValue={formData.role}
                    onValueChange={(value) => handleSelectChange(value, "role")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="central">Central</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Informações Médicas (apenas para usuários) */}
            {formData.role === "user" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Informações Médicas</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Tipo Sanguíneo</Label>
                    <Input
                      id="bloodType"
                      value={formData.medicalInfo.bloodType}
                      onChange={(e) => handleChange(e, "medicalInfo", "bloodType")}
                      placeholder="Ex: A+, B-, O+"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Contato de Emergência</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.medicalInfo.emergencyContact}
                      onChange={(e) => handleChange(e, "medicalInfo", "emergencyContact")}
                      placeholder="(11) 98765-4321"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Alergias (uma por linha)</Label>
                    <Textarea
                      id="allergies"
                      value={allergiesText}
                      onChange={(e) => setAllergiesText(e.target.value)}
                      placeholder="Ex: Penicilina&#10;Aspirina"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="conditions">Condições Médicas (uma por linha)</Label>
                    <Textarea
                      id="conditions"
                      value={conditionsText}
                      onChange={(e) => setConditionsText(e.target.value)}
                      placeholder="Ex: Hipertensão&#10;Diabetes"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="medications">Medicamentos (um por linha)</Label>
                    <Textarea
                      id="medications"
                      value={medicationsText}
                      onChange={(e) => setMedicationsText(e.target.value)}
                      placeholder="Ex: Losartana 50mg&#10;Metformina 500mg"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Informações do Plano (apenas para usuários) */}
            {formData.role === "user" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Informações do Plano</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="planName">Nome do Plano*</Label>
                    <Input
                      id="planName"
                      required
                      value={formData.plan.name}
                      onChange={(e) => handleChange(e, "plan", "name")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="planStatus">Status do Plano*</Label>
                    <Select 
                      defaultValue={formData.plan.status}
                      onValueChange={(value: "active" | "inactive") => handleSelectChange(value, "plan", "status")}
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
                    <Label htmlFor="planExpirationDate">Data de Expiração*</Label>
                    <Input
                      id="planExpirationDate"
                      type="date"
                      required
                      value={formData.plan.expirationDate}
                      onChange={(e) => handleChange(e, "plan", "expirationDate")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="planPrice">Valor (R$)*</Label>
                    <Input
                      id="planPrice"
                      type="number"
                      step="0.01"
                      required
                      value={formData.plan.price}
                      onChange={(e) => setFormData({
                        ...formData,
                        plan: {
                          ...formData.plan,
                          price: parseFloat(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate("/admin/users")}
              >
                <X size={16} className="mr-2" />
                Cancelar
              </Button>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-supportlife-blue hover:bg-supportlife-darkblue"
              >
                <Save size={16} className="mr-2" />
                {isLoading ? "Salvando..." : "Salvar Usuário"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminUserCreate;
