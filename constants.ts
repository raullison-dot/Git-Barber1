import { Appointment, AppointmentStatus, Client, Service, Barber } from './types';

export const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Corte Degrade', price: 45, durationMinutes: 45 },
  { id: '2', name: 'Barba Terapia', price: 35, durationMinutes: 30 },
  { id: '3', name: 'Combo (Corte + Barba)', price: 70, durationMinutes: 60 },
  { id: '4', name: 'Pezinho / Acabamento', price: 15, durationMinutes: 15 },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Carlos Silva', phone: '(11) 99999-1234', lastVisit: '2023-10-15', preferences: 'Gosta de café sem açúcar, conversa sobre futebol.', totalSpent: 450 },
  { id: 'c2', name: 'Roberto Almeida', phone: '(11) 98888-5678', lastVisit: '2023-10-20', preferences: 'Prefere silêncio, corte rápido.', totalSpent: 120 },
  { id: 'c3', name: 'João Souza', phone: '(11) 97777-9012', lastVisit: '2023-10-25', preferences: 'Sempre pede a pomada efeito matte.', totalSpent: 890 },
];

export const MOCK_BARBERS: Barber[] = [
  {
    id: 'b1',
    name: 'Mestre Navalha',
    email: 'admin@barber.com',
    password: '123',
    phone: '(11) 99999-0001',
    avatar: 'https://images.unsplash.com/photo-1583336237731-137bc81855a8?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'b2',
    name: 'João Tesoura',
    email: 'joao@barber.com',
    password: '123',
    phone: '(11) 99999-0002',
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { 
    id: 'a1', 
    clientId: 'c1', 
    clientName: 'Carlos Silva', 
    serviceId: '3', 
    serviceName: 'Combo (Corte + Barba)', 
    date: new Date().toISOString().split('T')[0], 
    time: '10:00', 
    status: AppointmentStatus.CONFIRMED,
    price: 70,
    barberId: 'b1',
    barberName: 'Mestre Navalha'
  },
  { 
    id: 'a2', 
    clientId: 'c2', 
    clientName: 'Roberto Almeida', 
    serviceId: '1', 
    serviceName: 'Corte Degrade', 
    date: new Date().toISOString().split('T')[0], 
    time: '14:00', 
    status: AppointmentStatus.PENDING,
    price: 45,
    barberId: 'b2',
    barberName: 'João Tesoura'
  },
  { 
    id: 'a3', 
    clientId: 'c3', 
    clientName: 'João Souza', 
    serviceId: '2', 
    serviceName: 'Barba Terapia', 
    date: new Date().toISOString().split('T')[0], 
    time: '16:30', 
    status: AppointmentStatus.COMPLETED,
    price: 35,
    barberId: 'b1',
    barberName: 'Mestre Navalha'
  },
];