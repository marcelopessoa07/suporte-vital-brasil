
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RegisterSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle size={80} className="text-supportlife-success" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Cadastro Realizado!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Seu cadastro foi recebido com sucesso e está em processo de validação. 
          Você receberá uma notificação quando sua conta for aprovada.
        </p>
        
        <div className="space-y-3">
          <Button 
            className="w-full bg-supportlife-blue hover:bg-supportlife-darkblue"
            onClick={() => navigate("/")}
          >
            Voltar para Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;
