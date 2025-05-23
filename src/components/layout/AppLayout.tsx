
import React, { useState } from "react";
import { AppHeader } from "./AppHeader";
import { Home, Users, Calendar, Settings, Bell, FileText, CreditCard, Headset, BarChart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  hideNavigation?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  showBackButton = false,
  hideNavigation = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdminView, isCentralView } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Define navigation items based on user role
  const navItems = isAdminView
    ? [
        { icon: Home, label: "Dashboard", path: "/admin" },
        { icon: Users, label: "Usuários", path: "/admin/users" },
        { icon: CreditCard, label: "Planos", path: "/admin/plans" },
        { icon: Bell, label: "Incidentes", path: "/admin/incidents" },
        { icon: BarChart, label: "Relatórios", path: "/admin/reports" },
        { icon: Settings, label: "Configurações", path: "/admin/settings" },
      ]
    : isCentralView
    ? [
        { icon: Bell, label: "Emergências", path: "/central/incidents" },
        { icon: Headset, label: "Central", path: "/central" },
      ]
    : [
        { icon: Home, label: "Início", path: "/home" },
        { icon: Bell, label: "Emergências", path: "/incidents" },
        { icon: Users, label: "Familiares", path: "/family" },
        { icon: FileText, label: "Meu Plano", path: "/plan" },
        { icon: Settings, label: "Perfil", path: "/profile" },
      ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader 
        title={title} 
        showBackButton={showBackButton} 
        showLogoutButton={true}
        onMenuClick={toggleSidebar}
      />
      
      {/* Sidebar for larger screens */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        >
          <div 
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-supportlife-blue p-4">
              <h2 className="text-white text-xl font-bold">Supportlife</h2>
              <p className="text-white text-sm opacity-75">
                {isAdminView ? 'Painel Administrativo' : isCentralView ? 'Painel da Central' : 'Área do Cliente'}
              </p>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        closeSidebar();
                      }}
                      className={cn(
                        "flex items-center w-full p-3 rounded-lg",
                        location.pathname === item.path
                          ? "bg-supportlife-lightblue text-supportlife-darkblue"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="mr-3" size={20} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 p-4">
        {children}
      </main>

      {/* Bottom navigation for mobile */}
      {!hideNavigation && (
        <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full">
          <ul className="flex justify-around">
            {navItems.slice(0, 5).map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center w-full py-2",
                    location.pathname === item.path
                      ? "text-supportlife-blue"
                      : "text-gray-500"
                  )}
                >
                  <item.icon size={20} />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};
