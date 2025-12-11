import React, { useState } from 'react';
import { Client } from '../types';
import { generateMarketingMessage } from '../services/geminiService';
import { Search, Phone, MessageCircle, User, Sparkles, Plus, Trash2, X } from 'lucide-react';

interface ClientsProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

export const Clients: React.FC<ClientsProps> = ({ clients, onAddClient, onDeleteClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  
  // Add Client Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    preferences: ''
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleGenerateMessage = async (client: Client) => {
    setGeneratingFor(client.id);
    
    // Generate personalized message using AI
    const msg = await generateMarketingMessage(client.name, client.lastVisit, client.preferences);
    
    setGeneratingFor(null);

    // Format phone for WhatsApp link
    let phone = client.phone.replace(/\D/g, '');
    if (phone.length >= 10) {
       // Add country code if missing (assuming BR +55 for this context)
       if (phone.length <= 11) {
         phone = '55' + phone;
       }
    }

    const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(waLink, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: newClient.name,
      phone: newClient.phone,
      preferences: newClient.preferences || 'Sem preferências registradas',
      lastVisit: new Date().toISOString(),
      totalSpent: 0
    };
    onAddClient(client);
    setIsModalOpen(false);
    setNewClient({ name: '', phone: '', preferences: '' });
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      onDeleteClient(id);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Meus Clientes</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-500 text-white p-2 rounded-xl shadow-md active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="Buscar por nome ou telefone..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar space-y-3">
        {filteredClients.map(client => (
          <div key={client.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{client.name}</h3>
                  <p className="text-xs text-gray-500">Última visita: {new Date(client.lastVisit).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDeleteClick(client.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                aria-label="Excluir cliente"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="bg-gray-50 p-2 rounded-lg mb-4 text-xs text-gray-600">
              <span className="font-semibold text-gray-700">Preferências:</span> {client.preferences}
            </div>

            <div className="flex gap-2">
              <a href={`tel:${client.phone}`} className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                <Phone size={16} />
                Ligar
              </a>
              <button 
                onClick={() => handleGenerateMessage(client)}
                disabled={generatingFor === client.id}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-50 text-green-700 border border-green-100 rounded-lg text-sm font-medium hover:bg-green-100 shadow-sm transition-all active:scale-95"
              >
                {generatingFor === client.id ? (
                  <Sparkles size={16} className="animate-spin" />
                ) : (
                  <MessageCircle size={16} />
                )}
                WhatsApp AI
              </button>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <User size={48} className="mx-auto mb-2 opacity-20" />
            <p>Nenhum cliente encontrado</p>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-fade-in shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-xl font-bold mb-4">Novo Cliente</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  value={newClient.name}
                  onChange={e => setNewClient({...newClient, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                <input 
                  type="tel" 
                  required
                  placeholder="(00) 00000-0000"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  value={newClient.phone}
                  onChange={e => setNewClient({...newClient, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferências / Notas</label>
                <textarea 
                  rows={3}
                  placeholder="Ex: Gosta de corte navalhado, torcedor do Santos..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  value={newClient.preferences}
                  onChange={e => setNewClient({...newClient, preferences: e.target.value})}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-gray-600 font-medium bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 text-white font-bold bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/30"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};