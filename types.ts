export interface Client {
  id: string;
  name: string;
  phone: string;
  lastVisit: string;
  preferences: string;
  totalSpent: number;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
}

export enum AppointmentStatus {
  PENDING = 'Pendente',
  CONFIRMED = 'Confirmado',
  COMPLETED = 'Concluído',
  CANCELLED = 'Cancelado'
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  date: string; // ISO string
  time: string;
  status: AppointmentStatus;
  price: number;
  barberId?: string; // Optional for backward compatibility in mock
  barberName?: string;
}

export interface AIRecommendation {
  styleName: string;
  description: string;
  maintenanceLevel: string;
  products: string[];
}

export interface Barber {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  phone: string;
  avatar?: string;
}