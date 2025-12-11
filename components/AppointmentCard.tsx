import React from 'react';
import { Appointment, AppointmentStatus } from '../types';
import { Clock, CheckCircle, XCircle, AlertCircle, Trash2 } from 'lucide-react';

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusChange?: (id: string, status: AppointmentStatus) => void;
  onDeleteAppointment?: (id: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onStatusChange, onDeleteAppointment }) => {
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED: return 'bg-green-100 text-green-800 border-green-200';
      case AppointmentStatus.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case AppointmentStatus.COMPLETED: return 'bg-gray-100 text-gray-800 border-gray-200';
      case AppointmentStatus.CANCELLED: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100';
    }
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED: return <CheckCircle size={14} className="mr-1" />;
      case AppointmentStatus.PENDING: return <AlertCircle size={14} className="mr-1" />;
      case AppointmentStatus.CANCELLED: return <XCircle size={14} className="mr-1" />;
      default: return null;
    }
  };

  const handleDelete = () => {
    if (onDeleteAppointment && window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      onDeleteAppointment(appointment.id);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 relative overflow-hidden group">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        appointment.status === AppointmentStatus.CONFIRMED ? 'bg-green-500' : 
        appointment.status === AppointmentStatus.PENDING ? 'bg-yellow-400' : 'bg-gray-300'
      }`}></div>
      
      <div className="pl-2">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-900">{appointment.clientName}</h3>
            <p className="text-sm text-gray-500">{appointment.serviceName}</p>
          </div>
          <div className="text-right">
            <span className="block font-bold text-gray-900">R$ {appointment.price.toFixed(2)}</span>
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
              {getStatusIcon(appointment.status)}
              {appointment.status}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center text-gray-600 text-sm">
            <Clock size={16} className="mr-1.5" />
            <span>{appointment.time}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {onStatusChange && appointment.status !== AppointmentStatus.COMPLETED && appointment.status !== AppointmentStatus.CANCELLED && (
              <div className="flex gap-2">
                {appointment.status === AppointmentStatus.PENDING && (
                  <button 
                    onClick={() => onStatusChange(appointment.id, AppointmentStatus.CONFIRMED)}
                    className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg active:bg-green-100"
                  >
                    Confirmar
                  </button>
                )}
                <button 
                  onClick={() => onStatusChange(appointment.id, AppointmentStatus.COMPLETED)}
                  className="px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg active:bg-gray-800"
                >
                  Concluir
                </button>
              </div>
            )}
            
            {onDeleteAppointment && (
              <button 
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
                aria-label="Excluir agendamento"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};