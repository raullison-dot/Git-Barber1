import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { Schedule } from './pages/Schedule';
import { Clients } from './pages/Clients';
import { AIStylist } from './pages/AIStylist';
import { Settings } from './pages/Settings';
import { WhatsAppBot } from './pages/WhatsAppBot';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MOCK_APPOINTMENTS, MOCK_CLIENTS, MOCK_SERVICES, MOCK_BARBERS } from './constants';
import { Appointment, AppointmentStatus, Client, Service, Barber } from './types';

// Storage Keys
const STORAGE_KEYS = {
  USERS: 'barberpro_users',
  SESSION: 'barberpro_session',
  APPOINTMENTS: 'barberpro_appointments',
  CLIENTS: 'barberpro_clients',
  SERVICES: 'barberpro_services',
  BARBERS_LIST: 'barberpro_barbers_list' // In a real app, users and barbers might be distinct, here they are similar
};

interface BarberAppProps {
  user: Barber;
  onLogout: () => void;
  onUpdateUser: (updatedData: Partial<Barber>) => void;
}

// This component contains the logic for the actual Application (post-login)
const BarberApp: React.FC<BarberAppProps> = ({ user, onLogout, onUpdateUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse the current page from the URL path relative to /app
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes('schedule')) return 'schedule';
    if (path.includes('clients')) return 'clients';
    if (path.includes('ai-stylist')) return 'ai-stylist';
    if (path.includes('settings')) return 'settings';
    return 'dashboard';
  };
  
  const [currentPage, setCurrentPage] = useState(getCurrentPage());
  
  // App State with Persistence
  // We use lazy initialization (function inside useState) to read from localStorage only once on mount
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return saved ? JSON.parse(saved) : MOCK_APPOINTMENTS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return saved ? JSON.parse(saved) : MOCK_CLIENTS;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return saved ? JSON.parse(saved) : MOCK_SERVICES;
  });

  // Mock barbers list for the app (usually fetched from backend)
  // We sync this with the registered users from the parent component implicitly via props or context in a real app
  // For this standalone structure, we keep a local state or use the mock
  const [barbers, setBarbers] = useState<Barber[]>(MOCK_BARBERS);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  // Sync route with nav state
  useEffect(() => {
    setCurrentPage(getCurrentPage());
  }, [location]);

  const handleNavigate = (page: string) => {
    navigate(`/app/${page}`);
  };

  const handleAddAppointment = (appt: Appointment) => {
    setAppointments(prev => [...prev, appt]);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    // Logic for Automatic Feedback Request on Completion
    if (status === AppointmentStatus.COMPLETED) {
      const appt = appointments.find(a => a.id === id);
      if (appt) {
        const client = clients.find(c => c.id === appt.clientId);
        const clientPhone = client?.phone || '';
        const clientName = appt.clientName.split(' ')[0];

        const feedbackMsg = `Olá ${clientName}! 💈\nObrigado pela preferência hoje na BarberPro!\n\nO que achou do serviço? Seu feedback é muito importante para nós. ⭐`;

        let waLink = `https://wa.me/?text=${encodeURIComponent(feedbackMsg)}`;

        if (clientPhone) {
           const cleanPhone = clientPhone.replace(/\D/g, '');
           if (cleanPhone.length >= 10) {
              const phoneWithCountry = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
              waLink = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(feedbackMsg)}`;
           }
        }
        
        window.open(waLink, '_blank');
      }
    }

    setAppointments(prev => prev.map(a => 
      a.id === id ? { ...a, status } : a
    ));
  };

  const handleAddClient = (newClient: Client) => {
    setClients(prev => [...prev, newClient]);
  };

  const handleAddService = (newService: Service) => {
    setServices(prev => [...prev, newService]);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  const isWhatsAppBot = location.pathname.includes('whatsapp-bot');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans max-w-lg mx-auto shadow-2xl overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1503951914875-452162b7f30a?q=80&w=2070&auto=format&fit=crop" 
          alt="Barbershop Background" 
          className="w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gray-100/85 backdrop-blur-[3px]"></div>
      </div>

      <main className="h-screen overflow-hidden relative z-10 flex flex-col">
        <div className={`flex-1 overflow-hidden ${isWhatsAppBot ? '' : 'p-4 pb-20 pt-6'}`}>
          <Routes>
            <Route path="/" element={<Dashboard appointments={appointments} onStatusChange={handleStatusChange} onDeleteAppointment={handleDeleteAppointment} user={user} onLogout={onLogout} />} />
            <Route path="/dashboard" element={<Dashboard appointments={appointments} onStatusChange={handleStatusChange} onDeleteAppointment={handleDeleteAppointment} user={user} onLogout={onLogout} />} />
            <Route path="/schedule" element={
              <Schedule 
                appointments={appointments} 
                services={services} 
                clients={clients} 
                barbers={barbers}
                onAddAppointment={handleAddAppointment}
                onStatusChange={handleStatusChange}
                onDeleteAppointment={handleDeleteAppointment}
                onAddClient={handleAddClient}
                onAddService={handleAddService}
              />
            } />
            <Route path="/clients" element={
              <Clients 
                clients={clients} 
                onAddClient={handleAddClient} 
                onDeleteClient={handleDeleteClient} 
              />
            } />
            <Route path="/ai-stylist" element={<AIStylist />} />
            <Route 
              path="/settings" 
              element={
                <Settings 
                  user={user} 
                  onUpdateUser={onUpdateUser} 
                  services={services}
                  onAddService={handleAddService}
                  onDeleteService={handleDeleteService}
                />
              } 
            />
            <Route 
              path="/whatsapp-bot" 
              element={
                <WhatsAppBot 
                  services={services}
                  barbers={barbers}
                  appointments={appointments}
                  onAddAppointment={handleAddAppointment}
                />
              } 
            />
          </Routes>
        </div>
      </main>
      
      {!isWhatsAppBot && <Navigation currentPage={currentPage} onNavigate={handleNavigate} />}
    </div>
  );
}

export default function App() {
  // Initialize Users from LocalStorage
  const [registeredBarbers, setRegisteredBarbers] = useState<Barber[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : MOCK_BARBERS;
  });

  // Initialize Session from LocalStorage
  const [currentUser, setCurrentUser] = useState<Barber | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
    return saved ? JSON.parse(saved) : null;
  });

  // Save Users whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(registeredBarbers));
  }, [registeredBarbers]);

  const handleLogin = (user: Barber) => {
    setCurrentUser(user);
    // Persist Session
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  };

  const handleRegister = (newUser: Barber) => {
    setRegisteredBarbers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    // Persist Session
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(newUser));
  };

  const handleUpdateUser = (updatedData: Partial<Barber>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updatedData };
    
    // Update current session state and storage
    setCurrentUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedUser));
    
    // Update user in the list state (effect will handle storage)
    setRegisteredBarbers(prev => 
      prev.map(b => b.id === updatedUser.id ? updatedUser : b)
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login barbers={registeredBarbers} onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route 
          path="/app/*" 
          element={
            currentUser ? (
              <BarberApp 
                user={currentUser} 
                onLogout={handleLogout} 
                onUpdateUser={handleUpdateUser}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </HashRouter>
  );
}