
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Clock, CreditCard, AlertTriangle } from "lucide-react";

const Plan = () => {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  const isActive = currentUser.plan.status === 'active';
  const expirationDate = new Date(currentUser.plan.expirationDate);
  const today = new Date();
  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Sample payment history
  const paymentHistory = [
    { id: 1, date: "2023-05-15", amount: currentUser.plan.price, status: "pago" },
    { id: 2, date: "2023-04-15", amount: currentUser.plan.price, status: "pago" },
    { id: 3, date: "2023-03-15", amount: currentUser.plan.price, status: "pago" },
  ];

  return (
    <AppLayout title="Meu Plano" showBackButton>
      <div className="pb-24">
        {/* Plan Summary Card */}
        <Card className="p-5 mb-6">
          <h2 className="text-xl font-semibold mb-4">{currentUser.plan.name}</h2>
          
          <div className="flex items-center mb-3">
            <div className={`w-3 h-3 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={isActive ? 'text-green-700' : 'text-red-700'}>
              {isActive ? 'Plano Ativo' : 'Plano Inativo'}
            </span>
          </div>
          
          <div className="flex items-start mb-4">
            <Calendar size={20} className="mr-3 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Validade</p>
              <p className="text-sm text-gray-600">
                {expirationDate.toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          
          <div className="flex items-start mb-4">
            <CreditCard size={20} className="mr-3 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Valor mensal</p>
              <p className="text-sm text-gray-600">
                {`R$ ${currentUser.plan.price.toFixed(2).replace('.', ',')}`}
              </p>
            </div>
          </div>
          
          {daysUntilExpiration <= 15 && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start mt-2">
              <AlertTriangle size={18} className="text-amber-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Plano próximo ao vencimento</p>
                <p className="text-xs text-amber-700">
                  {daysUntilExpiration <= 0 
                    ? 'Seu plano venceu. Renove agora para continuar com o serviço.' 
                    : `Seu plano vence em ${daysUntilExpiration} dias. Renove para continuar com o serviço.`}
                </p>
              </div>
            </div>
          )}
        </Card>
        
        {/* Payment History Card */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">Histórico de Pagamentos</h2>
          
          <div className="space-y-4">
            {paymentHistory.map(payment => (
              <div key={payment.id} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium">{new Date(payment.date).toLocaleDateString('pt-BR')}</p>
                  <p className="text-sm text-gray-500">
                    {`R$ ${payment.amount.toFixed(2).replace('.', ',')}`}
                  </p>
                </div>
                <div className="flex items-center">
                  {payment.status === "pago" ? (
                    <div className="flex items-center text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs">
                      <Check size={12} className="mr-1" />
                      Pago
                    </div>
                  ) : (
                    <div className="flex items-center text-red-700 bg-red-50 px-2 py-1 rounded-full text-xs">
                      <Clock size={12} className="mr-1" />
                      Pendente
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Button className="w-full mt-4 bg-supportlife-blue hover:bg-supportlife-darkblue">
            Ver todos os pagamentos
          </Button>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Plan;
