import React, { useState, useEffect } from 'react';
import { Appointment, AppointmentStatus, Service, Client, Barber } from '../types';
import { AppointmentCard } from '../components/AppointmentCard';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Share2, MessageCircle, Clock, Calendar, LayoutList, Columns, CheckCircle, XCircle, Grid3X3 } from 'lucide-react';

interface ScheduleProps {
  appointments: Appointment[];
  services: Service[];
  clients: Client[];
  barbers: Barber[];
  onAddAppointment: (appointment: Appointment) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onDeleteAppointment: (id: string) => void;
  onAddClient: (client: Client) => void;
  onAddService: (service: Service) => void;
}

export const Schedule: React.FC<ScheduleProps> = ({ 
  appointments, 
  services, 
  clients, 
  barbers,
  onAddAppointment, 
  onStatusChange,
  onDeleteAppointment,
  onAddClient,
  onAddService
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Edit Mode State
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  
  // Toggle States
  const [isNewClientMode, setIsNewClientMode] = useState(false);
  const [isNewServiceMode, setIsNewServiceMode] = useState(false);
  const [notifyClient, setNotifyClient] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    clientId: '',
    serviceId: '',
    barberId: '',
    date: '', 
    time: '',
    // New Client Fields
    newClientName: '',
    newClientPhone: '',
    // New Service Fields
    newServiceName: '',
    newServicePrice: '',
    newServiceDuration: ''
  });

  // Sync form date with selected view date when opening modal for NEW appointment
  useEffect(() => {
    if (isModalOpen && !editingAppointment) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0],
        time: '' // Reset time to force selection
      }));
    }
  }, [isModalOpen, selectedDate, editingAppointment]);

  const formattedDate = selectedDate.toISOString().split('T')[0];

  const dailyAppointments = appointments
    .filter(a => a.date === formattedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    if (viewMode === 'month') {
      prev.setMonth(prev.getMonth() - 1);
    } else {
      prev.setDate(prev.getDate() - (viewMode === 'week' ? 7 : 1));
    }
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    if (viewMode === 'month') {
      next.setMonth(next.getMonth() + 1);
    } else {
      next.setDate(next.getDate() + (viewMode === 'week' ? 7 : 1));
    }
    setSelectedDate(next);
  };

  // Logic to share available slots via WhatsApp
  const handleShareAvailability = () => {
    const workingHours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
    const busyTimes = dailyAppointments.map(a => a.time);
    const freeSlots = workingHours.filter(time => !busyTimes.includes(time));

    if (freeSlots.length === 0) {
      alert('Não há horários livres (inicio de hora) para este dia.');
      return;
    }

    const dateStr = selectedDate.toLocaleDateString('pt-BR');
    const text = `💈 *BarberPro* \nOlá! Tenho os seguintes horários livres para hoje (${dateStr}):\n\n${freeSlots.map(t => `🕒 ${t}`).join('\n')}\n\nResponda essa mensagem para agendar!`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleOpenEdit = (app: Appointment) => {
    setEditingAppointment(app);
    setFormData({
      clientId: app.clientId,
      serviceId: app.serviceId,
      barberId: app.barberId || '',
      date: app.date,
      time: app.time,
      newClientName: '',
      newClientPhone: '',
      newServiceName: '',
      newServicePrice: '',
      newServiceDuration: ''
    });
    setNotifyClient(false); // Don't notify by default when editing
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (status: AppointmentStatus) => {
    if (editingAppointment) {
      onStatusChange(editingAppointment.id, status);
      closeModal();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If editing, prioritize the Status Buttons, so this submit acts as "Create New" only or closes.
    if (editingAppointment) {
        closeModal();
        return;
    }
    
    // Validate Time
    if (!formData.time) {
      alert("Por favor, selecione um horário.");
      return;
    }

    let finalClientId = formData.clientId;
    let finalClientName = '';
    let finalClientPhone = '';
    let finalServiceId = formData.serviceId;
    let finalServiceName = '';
    let finalServicePrice = 0;

    // 1. Handle Client (Existing or New)
    if (isNewClientMode) {
      if (!formData.newClientName) return;
      const newClient: Client = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.newClientName,
        phone: formData.newClientPhone || '',
        lastVisit: new Date().toISOString(),
        preferences: 'Novo cliente',
        totalSpent: 0
      };
      onAddClient(newClient);
      finalClientId = newClient.id;
      finalClientName = newClient.name;
      finalClientPhone = newClient.phone;
    } else {
      const existingClient = clients.find(c => c.id === formData.clientId);
      if (existingClient) {
        finalClientName = existingClient.name;
        finalClientPhone = existingClient.phone;
      } else {
        return; // Validation failed
      }
    }

    // 2. Handle Service (Existing or New)
    if (isNewServiceMode) {
      if (!formData.newServiceName || !formData.newServicePrice) return;
      const newService: Service = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.newServiceName,
        price: parseFloat(formData.newServicePrice),
        durationMinutes: parseInt(formData.newServiceDuration) || 30
      };
      onAddService(newService);
      finalServiceId = newService.id;
      finalServiceName = newService.name;
      finalServicePrice = newService.price;
    } else {
      const existingService = services.find(s => s.id === formData.serviceId);
      if (existingService) {
        finalServiceName = existingService.name;
        finalServicePrice = existingService.price;
      } else {
        return; // Validation failed
      }
    }

    // 3. Handle Barber selection
    let finalBarberId = formData.barberId;
    let finalBarberName = 'Barbearia';
    if (finalBarberId) {
       const b = barbers.find(barber => barber.id === finalBarberId);
       if (b) finalBarberName = b.name;
    }

    // Use formData.date for the appointment
    const appointmentDateStr = formData.date; 
    // Format date for display in msg
    const [y, m, d] = appointmentDateStr.split('-');
    const dateDisplay = `${d}/${m}/${y}`;

    // 4. Create Appointment
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: finalClientId,
      clientName: finalClientName,
      serviceId: finalServiceId,
      serviceName: finalServiceName,
      price: finalServicePrice,
      date: appointmentDateStr,
      time: formData.time,
      status: AppointmentStatus.PENDING,
      barberId: finalBarberId,
      barberName: finalBarberName
    };

    onAddAppointment(newAppointment);

    // 5. Handle WhatsApp Notification
    if (notifyClient) {
      const msg = 
`Olá ${finalClientName}! 👋
Seu agendamento foi confirmado com sucesso na *BarberPro*!

✂️ *Serviço:* ${finalServiceName}
💈 *Profissional:* ${finalBarberName}
📅 *Data:* ${dateDisplay}
⏰ *Horário:* ${formData.time}
💰 *Valor:* R$ ${finalServicePrice.toFixed(2)}

⚠️ _Caso precise cancelar ou reagendar, por favor, responda a esta mensagem._

Te aguardamos!`;
      
      let waLink = `https://wa.me/?text=${encodeURIComponent(msg)}`;
      
      if (finalClientPhone) {
        const cleanPhone = finalClientPhone.replace(/\D/g, '');
        if (cleanPhone.length >= 10) {
           const phoneWithCountry = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
           waLink = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msg)}`;
        }
      }
      
      window.open(waLink, '_blank');
    }

    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
    setIsNewClientMode(false);
    setIsNewServiceMode(false);
    setNotifyClient(true);
    setFormData({
      clientId: '',
      serviceId: '',
      barberId: '',
      date: '',
      time: '',
      newClientName: '',
      newClientPhone: '',
      newServiceName: '',
      newServicePrice: '',
      newServiceDuration: ''
    });
  };

  // Helper to generate next 7 days for horizontal picker
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(selectedDate); // Start from selectedDate to sync logic
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };

  // Helper to generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    let startHour = 9;
    const endHour = 19;
    for (let h = startHour; h <= endHour; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
      if (h !== endHour) {
        slots.push(`${h.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const nextDays = getNextDays();

  // --- Render Views ---

  const renderWeekView = () => {
    return (
      <div className="space-y-6 pb-20">
        {nextDays.map((day) => {
          const dayString = day.toISOString().split('T')[0];
          const dayAppointments = appointments
            .filter(a => a.date === dayString)
            .sort((a, b) => a.time.localeCompare(b.time));
            
          const isToday = new Date().toISOString().split('T')[0] === dayString;

          return (
            <div key={dayString} className="animate-fade-in">
              <div className={`flex items-center gap-2 mb-3 px-1 sticky top-0 bg-gray-50/95 backdrop-blur py-2 z-10 ${isToday ? 'text-primary-600' : 'text-gray-500'}`}>
                <span className="font-bold text-lg capitalize">
                  {day.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')},
                </span>
                <span className="text-lg">
                  {day.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                </span>
                {isToday && <span className="text-xs font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Hoje</span>}
              </div>
              
              <div className="space-y-3 min-h-[60px]">
                {dayAppointments.length > 0 ? (
                  dayAppointments.map(app => (
                    <div 
                      key={app.id} 
                      onClick={(e) => {
                        if((e.target as HTMLElement).closest('button')) return;
                        handleOpenEdit(app);
                      }}
                    >
                      <AppointmentCard 
                        appointment={app} 
                        onStatusChange={onStatusChange}
                        onDeleteAppointment={onDeleteAppointment}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <p className="text-sm text-gray-400">Nenhum agendamento</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    // First day of current month
    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    
    // Total days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Previous month filler days (just count)
    const fillerDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

    // Current month days
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    return (
      <div className="animate-fade-in pb-20">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
           {/* Header Week Days */}
           <div className="grid grid-cols-7 mb-2">
             {weekDays.map((day, i) => (
               <div key={i} className="text-center text-xs font-bold text-gray-400 py-2">
                 {day}
               </div>
             ))}
           </div>

           {/* Calendar Grid */}
           <div className="grid grid-cols-7 gap-1">
             {fillerDays.map((_, i) => (
               <div key={`filler-${i}`} className="h-10"></div>
             ))}
             
             {monthDays.map((day) => {
               // Construct Date String YYYY-MM-DD
               const dateObj = new Date(year, month, day);
               const dateStr = dateObj.toISOString().split('T')[0];
               const isSelected = dateStr === formattedDate;
               const isToday = new Date().toISOString().split('T')[0] === dateStr;
               
               // Check appointments for this day
               const hasAppointments = appointments.some(a => a.date === dateStr && a.status !== AppointmentStatus.CANCELLED);
               const count = appointments.filter(a => a.date === dateStr && a.status !== AppointmentStatus.CANCELLED).length;

               return (
                 <button
                    key={dateStr}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={`h-12 rounded-xl flex flex-col items-center justify-center relative transition-all ${
                      isSelected 
                        ? 'bg-primary-500 text-white shadow-md transform scale-105 z-10' 
                        : isToday 
                          ? 'bg-primary-50 text-primary-700 font-bold border border-primary-100' 
                          : 'hover:bg-gray-50 text-gray-700'
                    }`}
                 >
                   <span className="text-sm">{day}</span>
                   {hasAppointments && (
                     <div className="flex gap-0.5 mt-0.5">
                       <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-primary-500'}`}></span>
                       {count > 1 && <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-primary-500'}`}></span>}
                     </div>
                   )}
                 </button>
               );
             })}
           </div>
        </div>
        
        {/* Selected Date Appointments List (Below Calendar) */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3 px-1">
            {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          {dailyAppointments.length > 0 ? (
              dailyAppointments.map(app => (
                <div 
                  key={app.id} 
                  onClick={(e) => {
                    if((e.target as HTMLElement).closest('button')) return;
                    handleOpenEdit(app);
                  }}
                >
                  <AppointmentCard 
                    appointment={app} 
                    onStatusChange={onStatusChange}
                    onDeleteAppointment={onDeleteAppointment}
                  />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
                <CalendarIcon size={32} className="mb-2 opacity-20" />
                <p className="text-sm">Sem agendamentos</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 text-primary-600 text-xs font-bold"
                >
                  + Agendar
                </button>
              </div>
            )}
        </div>
      </div>
    );
  };

  const getHeaderTitle = () => {
    if (viewMode === 'month') {
      return selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }
    if (viewMode === 'week') {
      return 'Semana selecionada'; // Simplified for layout
    }
    return selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  };

  const getHeaderSubtitle = () => {
    if (viewMode === 'month') return 'Visão Mensal';
    if (viewMode === 'week') return 'Visão Semanal';
    return selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' });
  };

  return (
    <div className="h-full flex flex-col">
      <header className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
          <p className="text-xs text-gray-500">Gerencie seus horários</p>
        </div>
        
        <div className="flex items-center gap-2">
           {/* View Toggle */}
           <div className="flex bg-gray-200 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('day')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'day' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                title="Visão Diária"
              >
                <LayoutList size={18} />
              </button>
              <button 
                onClick={() => setViewMode('week')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'week' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                title="Visão Semanal"
              >
                <Columns size={18} />
              </button>
              <button 
                onClick={() => setViewMode('month')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'month' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                title="Visão Mensal"
              >
                <Grid3X3 size={18} />
              </button>
           </div>

           <div className="h-6 w-px bg-gray-200 mx-1"></div>

          <button 
            onClick={handleShareAvailability}
            className="bg-green-500 text-white p-2 rounded-xl shadow-md active:scale-95 transition-transform flex items-center gap-1"
            title="Enviar horários livres no WhatsApp"
          >
            <Share2 size={20} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-500 text-white p-2 rounded-xl shadow-md active:scale-95 transition-transform"
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      {/* Date Navigator */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
        <button onClick={handlePrevDay} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <span className="block text-xs text-gray-500 font-medium uppercase tracking-wider">
             {getHeaderSubtitle()}
          </span>
          <span className="block text-lg font-bold text-gray-900 capitalize">
            {getHeaderTitle()}
          </span>
        </div>
        <button onClick={handleNextDay} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {viewMode === 'day' ? (
          // Daily View
          <div className="pb-20">
            {dailyAppointments.length > 0 ? (
              dailyAppointments.map(app => (
                <div 
                  key={app.id} 
                  onClick={(e) => {
                    if((e.target as HTMLElement).closest('button')) return;
                    handleOpenEdit(app);
                  }}
                >
                  <AppointmentCard 
                    appointment={app} 
                    onStatusChange={onStatusChange}
                    onDeleteAppointment={onDeleteAppointment}
                  />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <CalendarIcon size={48} className="mb-4 opacity-20" />
                <p>Agenda livre para este dia</p>
                <button 
                  onClick={handleShareAvailability}
                  className="mt-4 text-primary-600 font-medium text-sm flex items-center gap-1 hover:underline"
                >
                  <Share2 size={16} /> Compartilhar disponibilidade
                </button>
              </div>
            )}
          </div>
        ) : viewMode === 'week' ? (
          // Weekly View
          renderWeekView()
        ) : (
          // Month View
          renderMonthView()
        )}
      </div>

      {/* Add/Edit Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-fade-in shadow-2xl overflow-y-auto max-h-[95vh] no-scrollbar">
            <h2 className="text-xl font-bold mb-4">
              {editingAppointment ? 'Detalhes do Agendamento' : 'Novo Agendamento'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Date Selection */}
              <div className={editingAppointment ? 'opacity-75 pointer-events-none' : ''}>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                   <Calendar size={16} /> Data
                </label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                   {nextDays.map((date, idx) => {
                     const val = date.toISOString().split('T')[0];
                     const isSelected = formData.date === val;
                     const isToday = new Date().toISOString().split('T')[0] === val;
                     return (
                       <button
                        key={val}
                        type="button"
                        disabled={!!editingAppointment}
                        onClick={() => setFormData({...formData, date: val})}
                        className={`flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-xl border min-w-[70px] transition-all ${
                          isSelected 
                            ? 'bg-primary-500 text-white border-primary-500 shadow-md transform scale-105' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-primary-300'
                        }`}
                       >
                         <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">
                           {isToday ? 'Hoje' : date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                         </span>
                         <span className="text-lg font-bold">
                           {date.getDate()}
                         </span>
                       </button>
                     );
                   })}
                   <div className="relative flex-shrink-0">
                      <input 
                        type="date"
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        disabled={!!editingAppointment}
                      />
                      <button type="button" className="h-full flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 min-w-[70px]">
                        <CalendarIcon size={20} />
                        <span className="text-[10px] mt-1">Outro</span>
                      </button>
                   </div>
                </div>
              </div>

              {/* Time Selection Grid */}
              <div className={editingAppointment ? 'opacity-75 pointer-events-none' : ''}>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                   <Clock size={16} /> Horário
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map(t => (
                    <button
                      key={t}
                      type="button"
                      disabled={!!editingAppointment}
                      onClick={() => setFormData({...formData, time: t})}
                      className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors ${
                        formData.time === t
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Selection Section */}
              <div className={`bg-gray-50 p-3 rounded-xl border border-gray-100 ${editingAppointment ? 'opacity-75 pointer-events-none' : ''}`}>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Cliente</label>
                  {!editingAppointment && (
                    <button 
                      type="button"
                      onClick={() => setIsNewClientMode(!isNewClientMode)}
                      className="text-xs font-bold text-primary-600 flex items-center gap-1"
                    >
                      {isNewClientMode ? 'Selecionar Existente' : '+ Cadastrar Novo'}
                    </button>
                  )}
                </div>
                
                {isNewClientMode ? (
                  <div className="space-y-2 animate-fade-in">
                    <input 
                      type="text"
                      placeholder="Nome do Cliente"
                      required
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.newClientName}
                      onChange={e => setFormData({...formData, newClientName: e.target.value})}
                    />
                    <input 
                      type="tel"
                      placeholder="Telefone com DDD (Ex: 11999998888)"
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.newClientPhone}
                      onChange={e => setFormData({...formData, newClientPhone: e.target.value})}
                    />
                  </div>
                ) : (
                  <select 
                    required
                    disabled={!!editingAppointment}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                    value={formData.clientId}
                    onChange={e => setFormData({...formData, clientId: e.target.value})}
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
              </div>

              {/* Service Selection Section */}
              <div className={`bg-gray-50 p-3 rounded-xl border border-gray-100 ${editingAppointment ? 'opacity-75 pointer-events-none' : ''}`}>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Serviço</label>
                  {!editingAppointment && (
                    <button 
                      type="button"
                      onClick={() => setIsNewServiceMode(!isNewServiceMode)}
                      className="text-xs font-bold text-primary-600 flex items-center gap-1"
                    >
                      {isNewServiceMode ? 'Selecionar Existente' : '+ Criar Serviço'}
                    </button>
                  )}
                </div>

                {isNewServiceMode ? (
                  <div className="space-y-2 animate-fade-in">
                    <input 
                      type="text"
                      placeholder="Nome do Serviço"
                      required
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.newServiceName}
                      onChange={e => setFormData({...formData, newServiceName: e.target.value})}
                    />
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                        <input 
                          type="number"
                          placeholder="0.00"
                          required
                          step="0.01"
                          className="w-full pl-8 pr-2 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                          value={formData.newServicePrice}
                          onChange={e => setFormData({...formData, newServicePrice: e.target.value})}
                        />
                      </div>
                      <input 
                        type="number"
                        placeholder="Min"
                        className="w-20 p-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.newServiceDuration}
                        onChange={e => setFormData({...formData, newServiceDuration: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <select 
                    required
                    disabled={!!editingAppointment}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                    value={formData.serviceId}
                    onChange={e => setFormData({...formData, serviceId: e.target.value})}
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name} - R${s.price}</option>)}
                  </select>
                )}
              </div>

              {/* Barber Selection */}
              <div className={editingAppointment ? 'opacity-75 pointer-events-none' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barbeiro</label>
                <select 
                  disabled={!!editingAppointment}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.barberId}
                  onChange={e => setFormData({...formData, barberId: e.target.value})}
                >
                   <option value="">Qualquer profissional</option>
                   {barbers.map(b => (
                     <option key={b.id} value={b.id}>{b.name}</option>
                   ))}
                </select>
              </div>

              {!editingAppointment && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl cursor-pointer" onClick={() => setNotifyClient(!notifyClient)}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${notifyClient ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
                    {notifyClient && <MessageCircle size={12} className="text-white" />}
                  </div>
                  <span className="text-sm font-medium text-gray-700 select-none">Enviar confirmação via WhatsApp</span>
                </div>
              )}

              {/* Actions */}
              {editingAppointment ? (
                <div className="space-y-3 mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs text-center text-gray-400 mb-2">Gerenciar status do agendamento</p>
                  <div className="flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => handleStatusUpdate(AppointmentStatus.CONFIRMED)}
                      className="flex-1 py-3 text-white font-bold bg-green-600 rounded-xl hover:bg-green-700 shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} /> Confirmar
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleStatusUpdate(AppointmentStatus.CANCELLED)}
                      className="flex-1 py-3 text-red-700 font-bold bg-red-100 rounded-xl hover:bg-red-200 flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} /> Cancelar
                    </button>
                  </div>
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="w-full py-3 text-gray-600 font-medium bg-gray-50 rounded-xl hover:bg-gray-100"
                  >
                    Fechar
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 mt-4 pt-2 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="flex-1 py-3 text-gray-600 font-medium bg-gray-100 rounded-xl hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 text-white font-bold bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/30"
                  >
                    Confirmar
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};