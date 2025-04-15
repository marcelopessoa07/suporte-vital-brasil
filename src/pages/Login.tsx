
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, UserPlus, Building } from "lucide-react";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, setIsAdminView } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (isAdmin: boolean) => {
    setError("");
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        setIsAdminView(isAdmin);
        navigate(isAdmin ? "/admin" : "/");
      } else {
        setError("Email ou senha inválidos");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-supportlife-blue">
            Supportlife
          </h1>
          <p className="text-gray-500 mt-2">
            Sistema de emergência médica
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-supportlife-red rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(false); }}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div className="pt-2 space-y-3">
            <Button
              type="submit"
              className="w-full bg-supportlife-blue hover:bg-supportlife-darkblue"
              disabled={isLoading}
            >
              <LogIn size={18} className="mr-2" />
              Entrar como Usuário
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full border-supportlife-blue text-supportlife-blue hover:bg-supportlife-blue hover:text-white"
              onClick={(e) => { e.preventDefault(); handleLogin(true); }}
              disabled={isLoading}
            >
              <Building size={18} className="mr-2" />
              Entrar como Administrador
            </Button>
            
            <div className="text-center pt-2">
              <Button 
                type="button" 
                variant="link" 
                onClick={handleRegister}
                className="text-gray-500 hover:text-supportlife-blue"
              >
                <UserPlus size={16} className="mr-1" />
                Novo usuário? Registre-se
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
