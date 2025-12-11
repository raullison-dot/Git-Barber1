import React, { useMemo } from 'react';
import { Appointment, AppointmentStatus, Barber } from '../types';
import { AppointmentCard } from '../components/AppointmentCard';
import { TrendingUp, Users, Calendar, Scissors, LogOut } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  appointments: Appointment[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onDeleteAppointment: (id: string) => void;
  user: Barber;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ appointments, onStatusChange, onDeleteAppointment, user, onLogout }) => {
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaysAppointments = appointments.filter(a => a.date === today);
    const confirmed = todaysAppointments.filter(a => a.status === AppointmentStatus.CONFIRMED || a.status === AppointmentStatus.COMPLETED);
    const revenue = confirmed.reduce((acc, curr) => acc + curr.price, 0);
    
    return {
      count: todaysAppointments.length,
      revenue,
      pending: todaysAppointments.filter(a => a.status === AppointmentStatus.PENDING).length
    };
  }, [appointments]);

  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter(a => a.status !== AppointmentStatus.COMPLETED && a.status !== AppointmentStatus.CANCELLED)
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(0, 3);
  }, [appointments]);

  const chartData = [
    { name: 'Seg', valor: 350 },
    { name: 'Ter', valor: 420 },
    { name: 'Qua', valor: 380 },
    { name: 'Qui', valor: 510 },
    { name: 'Sex', valor: 890 },
    { name: 'Sáb', valor: 1200 },
  ];

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-24 animate-fade-in space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Olá, {user.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 text-sm">Visão geral do dia</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-500">
             {user.avatar ? (
               <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                 {user.name.charAt(0)}
               </div>
             )}
          </div>
          <button 
            onClick={onLogout}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            title="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-2xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <TrendingUp size={16} />
            <span className="text-xs font-medium">Faturamento Hoje</span>
          </div>
          <p className="text-2xl font-bold">R$ {stats.revenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-2 mb-2 text-gray-500">
            <Calendar size={16} />
            <span className="text-xs font-medium">Agendamentos</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Performance da Semana</h2>
        {/* Recharts Wrapper Fix: Relative parent with fixed height + Absolute child */}
        <div className="relative w-full h-40">
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip />
                <Area type="monotone" dataKey="valor" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorValor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Upcoming List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Próximos Clientes</h2>
          <button className="text-primary-600 text-xs font-medium">Ver tudo</button>
        </div>
        <div className="space-y-2">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(app => (
              <AppointmentCard 
                key={app.id} 
                appointment={app} 
                onStatusChange={onStatusChange} 
                onDeleteAppointment={onDeleteAppointment}
              />
            ))
          ) : (
             <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-400 text-sm">Nenhum agendamento pendente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};