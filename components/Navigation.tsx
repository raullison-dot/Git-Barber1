import React from 'react';
import { LayoutDashboard, Calendar, Users, Sparkles, Settings } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Início' },
    { id: 'schedule', icon: Calendar, label: 'Agenda' },
    { id: 'clients', icon: Users, label: 'Clientes' },
    { id: 'ai-stylist', icon: Sparkles, label: 'IA Style' },
    { id: 'settings', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              currentPage === item.id ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <item.icon size={24} strokeWidth={currentPage === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};