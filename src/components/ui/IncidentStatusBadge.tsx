
import { cn } from "@/lib/utils";
import { IncidentStatus } from "@/types";

interface IncidentStatusBadgeProps {
  status: IncidentStatus;
  className?: string;
}

export const IncidentStatusBadge: React.FC<IncidentStatusBadgeProps> = ({ status, className }) => {
  const statusConfig: Record<IncidentStatus, { label: string; color: string }> = {
    sos_acionado: { 
      label: "SOS Acionado", 
      color: "bg-supportlife-red text-white" 
    },
    central_em_contato: { 
      label: "Central em Contato", 
      color: "bg-supportlife-lightred text-supportlife-red" 
    },
    central_acionada: { 
      label: "Central Acionada", 
      color: "bg-supportlife-lightred text-supportlife-red" 
    },
    ambulancia_a_caminho: { 
      label: "Ambulância a Caminho", 
      color: "bg-amber-100 text-amber-800" 
    },
    ambulancia_chegou: { 
      label: "Ambulância Chegou", 
      color: "bg-amber-500 text-white" 
    },
    chegada_local: { 
      label: "Chegada ao Local", 
      color: "bg-amber-500 text-white" 
    },
    paciente_embarcado: { 
      label: "Paciente Embarcado", 
      color: "bg-blue-100 text-blue-800" 
    },
    a_caminho_hospital: { 
      label: "A Caminho do Hospital", 
      color: "bg-blue-100 text-blue-800" 
    },
    paciente_hospital: { 
      label: "Paciente no Hospital", 
      color: "bg-green-100 text-green-800" 
    }
  };

  const config = statusConfig[status];

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", 
      config.color,
      className
    )}>
      {config.label}
    </span>
  );
};

export const getIncidentStatusLabel = (status: IncidentStatus): string => {
  const statusLabels: Record<IncidentStatus, string> = {
    sos_acionado: "SOS Acionado",
    central_em_contato: "Central em Contato",
    central_acionada: "Central Acionada",
    ambulancia_a_caminho: "Ambulância a Caminho",
    ambulancia_chegou: "Ambulância Chegou",
    chegada_local: "Chegada ao Local",
    paciente_embarcado: "Paciente Embarcado",
    a_caminho_hospital: "A Caminho do Hospital",
    paciente_hospital: "Paciente no Hospital",
  };

  return statusLabels[status];
};
