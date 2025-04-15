
import React from "react";
import { ChevronLeft, LogOut, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showLogoutButton?: boolean;
  onMenuClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton = false,
  showLogoutButton = false,
  onMenuClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useApp();

  const goBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="px-4 py-3 bg-supportlife-blue text-white flex items-center justify-between shadow-md">
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={goBack}
            className="mr-3 p-1"
            aria-label="Voltar"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="mr-3 p-1"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
        )}
        <h1 className="text-xl font-semibold">
          {title || "Supportlife"}
        </h1>
      </div>
      {showLogoutButton && (
        <button 
          onClick={handleLogout}
          className="p-2"
          aria-label="Sair"
        >
          <LogOut size={20} />
        </button>
      )}
    </header>
  );
};
