import React, { useState, useEffect } from 'react';
import { Barber, Service } from '../types';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Save, Camera, Shield, Bell, Scissors, Plus, Trash2, Clock, DollarSign, Phone, MessageSquare } from 'lucide-react';

interface SettingsProps {
  user: Barber;
  onUpdateUser: (updatedData: Partial<Barber>) => void;
  services: Service[];
  onAddService: (service: Service) => void;
  onDeleteService: (id: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  user, 
  onUpdateUser, 
  services, 
  onAddService, 
  onDeleteService 
}) => {
  const navigate = useNavigate();
  // User Profile State
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: user.password,
    phone: user.phone || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync formData with user prop changes
  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phone || ''
    });
  }, [user]);

  // Service Management State
  const [isAddingService, setIsAddingService] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    duration: ''
  });

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancelEdit = () => {
    // Reset form data to original user data
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.phone || ''
    });
    setIsEditing(false);
  };

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.price) return;

    const serviceToAdd: Service = {
      id: Math.random().toString(36).substr(2, 9),
      name: newService.name,
      price: parseFloat(newService.price),
      durationMinutes: parseInt(newService.duration) || 30
    };

    onAddService(serviceToAdd);
    setIsAddingService(false);
    setNewService({ name: '', price: '', duration: '' });
  };

  return (
    <div className="h-full pb-24 overflow-y-auto no-scrollbar">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500 text-sm">Gerencie seu perfil e menu de serviços</p>
      </header>

      {showSuccess && (
        <div className="mb-4 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-xl animate-fade-in flex items-center">
          <Shield size={18} className="mr-2" />
          <span>Dados atualizados com sucesso!</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-primary-500 to-primary-600 opacity-90"></div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto bg-white p-1 rounded-full shadow-lg mb-3 mt-4">
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative group">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-gray-400">{user.name.charAt(0)}</span>
                )}
                
                {/* Simulated Avatar Upload Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            {user.phone && <p className="text-gray-400 text-xs mt-1">{user.phone}</p>}
          </div>
        </div>

        {/* WhatsApp Integration Testing */}
        <div 
          onClick={() => navigate('/app/whatsapp-bot')}
          className="bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-500/30 text-white flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
        >
           <div className="flex items-center gap-3">
             <div className="p-2 bg-white/20 rounded-lg">
               <MessageSquare size={24} />
             </div>
             <div>
               <h3 className="font-bold text-lg">Testar Autoatendimento</h3>
               <p className="text-green-100 text-xs opacity-90">Simular cliente agendando via WhatsApp</p>
             </div>
           </div>
           <div className="bg-white/20 p-2 rounded-full">
             <MessageSquare size={16} />
           </div>
        </div>

        {/* Manage Services Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Scissors size={20} className="text-gray-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Menu de Serviços</h3>
                <p className="text-xs text-gray-500">O que sua barbearia oferece</p>
              </div>
            </div>
            <button 
              onClick={() => setIsAddingService(!isAddingService)}
              className="p-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          {isAddingService && (
            <form onSubmit={handleAddServiceSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
              <h4 className="text-sm font-bold text-gray-700 mb-3">Novo Serviço</h4>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Nome do Serviço (ex: Corte Navalhado)"
                  className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm"
                  value={newService.name}
                  onChange={e => setNewService({...newService, name: e.target.value})}
                  required
                />
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <DollarSign size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="number" 
                      placeholder="Preço"
                      className="w-full pl-7 pr-2 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      value={newService.price}
                      onChange={e => setNewService({...newService, price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="relative w-24">
                     <Clock size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input 
                      type="number" 
                      placeholder="Min"
                      className="w-full pl-7 pr-2 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      value={newService.duration}
                      onChange={e => setNewService({...newService, duration: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsAddingService(false)}
                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold shadow-md shadow-primary-500/20"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {services.map(service => (
              <div key={service.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl hover:border-primary-100 transition-colors group">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{service.name}</h4>
                  <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1"><Clock size={10} /> {service.durationMinutes} min</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary-600">R$ {service.price.toFixed(2)}</span>
                  <button 
                    onClick={() => {
                      if(window.confirm('Excluir este serviço?')) onDeleteService(service.id)
                    }}
                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Dados da Conta</h3>
            <button 
              onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {isEditing ? 'Cancelar' : 'Editar'}
            </button>
          </div>

          <form onSubmit={handleSubmitProfile} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Nome de Exibição</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all ${
                    isEditing ? 'border-primary-300 focus:ring-2 focus:ring-primary-100 bg-white' : 'border-transparent text-gray-600'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Telefone / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="(00) 00000-0000"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all ${
                    isEditing ? 'border-primary-300 focus:ring-2 focus:ring-primary-100 bg-white' : 'border-transparent text-gray-600'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Endereço de E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all ${
                    isEditing ? 'border-primary-300 focus:ring-2 focus:ring-primary-100 bg-white' : 'border-transparent text-gray-600'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all ${
                    isEditing ? 'border-primary-300 focus:ring-2 focus:ring-primary-100 bg-white' : 'border-transparent text-gray-600'
                  }`}
                />
              </div>
            </div>

            {isEditing && (
              <button 
                type="submit"
                className="w-full mt-4 py-3 bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Salvar Alterações
              </button>
            )}
          </form>
        </div>

        {/* Other Settings (Mock) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 opacity-60">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-gray-100 rounded-lg">
                <Bell size={20} className="text-gray-600" />
             </div>
             <div className="flex-1">
               <h4 className="font-bold text-gray-900">Notificações</h4>
               <p className="text-xs text-gray-500">Alertas de agendamentos</p>
             </div>
             <div className="w-10 h-6 bg-primary-200 rounded-full relative cursor-not-allowed">
               <div className="absolute right-1 top-1 w-4 h-4 bg-primary-500 rounded-full"></div>
             </div>
           </div>
           <p className="text-xs text-center text-gray-400 mt-2">Mais opções em breve</p>
        </div>
      </div>
    </div>
  );
};