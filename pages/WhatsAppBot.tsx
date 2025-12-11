import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Service, Barber, Appointment, AppointmentStatus } from '../types';

interface WhatsAppBotProps {
  services: Service[];
  barbers: Barber[];
  appointments: Appointment[];
  onAddAppointment: (appt: Appointment) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  options?: string[]; // For quick reply simulation
}

type BotStep = 'WELCOME' | 'SELECT_SERVICE' | 'SELECT_BARBER' | 'SELECT_DATE' | 'SELECT_TIME' | 'CONFIRMATION';

export const WhatsAppBot: React.FC<WhatsAppBotProps> = ({ services, barbers, appointments, onAddAppointment }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<BotStep>('WELCOME');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Temporary state for the booking in progress
  const [bookingData, setBookingData] = useState<{
    serviceId?: string;
    barberId?: string;
    date?: string; // YYYY-MM-DD
    time?: string;
  }>({});

  useEffect(() => {
    // Initial greeting
    addBotMessage("Olá! Bem-vindo ao autoatendimento da BarberPro. 💈\nComo posso ajudar hoje? Digite 'agendar' para marcar um horário.");
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addBotMessage = (text: string, options?: string[]) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender: 'bot', options }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender: 'user' }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    addUserMessage(text);
    setInput('');
    
    // Simulate network delay for bot thinking
    setTimeout(() => {
      processBotLogic(text);
    }, 800);
  };

  const handleOptionClick = (option: string) => {
    addUserMessage(option);
    setTimeout(() => {
      processBotLogic(option);
    }, 800);
  };

  // Helper to parse date inputs like "Hoje", "Amanhã", "25/10"
  const parseDateInput = (text: string): string | null => {
    const lower = text.toLowerCase().trim();
    const today = new Date();
    
    if (lower === 'hoje') {
      return today.toISOString().split('T')[0];
    }
    
    if (lower === 'amanhã' || lower === 'amanha') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }

    // Regex for DD/MM or DD/MM/YYYY
    const dateRegex = /^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/;
    const match = lower.match(dateRegex);

    if (match) {
      const day = parseInt(match[1]);
      const month = parseInt(match[2]) - 1; // Month is 0-indexed
      let year = match[3] ? parseInt(match[3]) : today.getFullYear();

      // Simple validation
      if (month < 0 || month > 11 || day < 1 || day > 31) return null;

      const inputDate = new Date(year, month, day);
      
      // If no year provided and date has passed this year, assume next year? 
      // For simplicity, we assume current year. If date is in past, we return null or handle in logic.
      if (inputDate < new Date(today.setHours(0,0,0,0)) && !match[3]) {
         // Optionally assume next year: inputDate.setFullYear(year + 1);
         // But let's just allow it for now or return null if strict future only.
      }
      
      // Format to YYYY-MM-DD manually to avoid timezone issues with toISOString
      const y = inputDate.getFullYear();
      const m = String(inputDate.getMonth() + 1).padStart(2, '0');
      const d = String(inputDate.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    return null;
  };

  const processBotLogic = (text: string) => {
    const lowerText = text.toLowerCase();

    // Reset flow
    if (lowerText === 'cancelar' || lowerText === 'inicio') {
      setStep('WELCOME');
      setBookingData({});
      addBotMessage("Operação cancelada. Como posso ajudar? Digite 'agendar'.");
      return;
    }

    switch (step) {
      case 'WELCOME':
        if (lowerText.includes('agendar') || lowerText.includes('marcar')) {
          setStep('SELECT_SERVICE');
          const serviceList = services.map((s, i) => `${i + 1}. ${s.name} (R$ ${s.price})`).join('\n');
          addBotMessage(`Ótimo! Escolha um serviço digitando o número:\n\n${serviceList}`, services.map((_, i) => (i + 1).toString()));
        } else {
          addBotMessage("Desculpe, não entendi. Digite 'agendar' para começar.");
        }
        break;

      case 'SELECT_SERVICE':
        const serviceIndex = parseInt(text) - 1;
        if (!isNaN(serviceIndex) && services[serviceIndex]) {
          const selectedService = services[serviceIndex];
          setBookingData(prev => ({ ...prev, serviceId: selectedService.id }));
          setStep('SELECT_BARBER');
          
          const barberList = barbers.map((b, i) => `${i + 1}. ${b.name}`).join('\n');
          addBotMessage(`Você escolheu: *${selectedService.name}*.\n\nCom qual barbeiro deseja cortar?\n${barberList}`, barbers.map((_, i) => (i + 1).toString()));
        } else {
          addBotMessage("Opção inválida. Digite o número do serviço correspondente.");
        }
        break;

      case 'SELECT_BARBER':
        const barberIndex = parseInt(text) - 1;
        if (!isNaN(barberIndex) && barbers[barberIndex]) {
          const selectedBarber = barbers[barberIndex];
          setBookingData(prev => ({ ...prev, barberId: selectedBarber.id }));
          setStep('SELECT_DATE');
          
          addBotMessage(
            `Certo, com ${selectedBarber.name}.\n\nPara qual dia você gostaria de agendar?`,
            ['Hoje', 'Amanhã']
          );
        } else {
          addBotMessage("Barbeiro inválido. Tente novamente.");
        }
        break;

      case 'SELECT_DATE':
        const selectedDate = parseDateInput(text);
        
        if (selectedDate) {
          // Validate if date is not in the past (allow today)
          const todayStr = new Date().toISOString().split('T')[0];
          if (selectedDate < todayStr) {
            addBotMessage("Essa data já passou. Por favor, escolha uma data futura (ex: 25/12).");
            return;
          }

          setBookingData(prev => ({ ...prev, date: selectedDate }));
          setStep('SELECT_TIME');

          // Check Availability for Specific Date
          const workingHours = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
          
          const takenSlots = appointments
            .filter(a => 
              a.date === selectedDate && 
              a.barberId === bookingData.barberId && 
              a.status !== AppointmentStatus.CANCELLED
            )
            .map(a => a.time);
            
          const freeSlots = workingHours.filter(h => !takenSlots.includes(h));

          const dateDisplay = new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR');

          if (freeSlots.length > 0) {
            addBotMessage(
              `Perfeito. Para o dia ${dateDisplay}, temos estes horários:\n\n${freeSlots.join(', ')}\n\nQual horário prefere?`, 
              freeSlots.slice(0, 6)
            );
          } else {
            addBotMessage(`Poxa, a agenda para o dia ${dateDisplay} está lotada. 😕\n\nPor favor, escolha outra data ou digite 'cancelar'.`, ['Hoje', 'Amanhã']);
            setStep('SELECT_DATE'); // Go back to date selection
          }

        } else {
          addBotMessage("Data inválida. Tente 'Hoje', 'Amanhã' ou formato dia/mês (ex: 15/08).");
        }
        break;

      case 'SELECT_TIME':
        // Basic time validation regex
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (timeRegex.test(text)) {
          checkAvailabilityAndBook(text);
        } else {
          addBotMessage("Formato de hora inválido. Use HH:MM (Ex: 14:30).");
        }
        break;
        
      case 'CONFIRMATION':
        addBotMessage("Se deseja realizar outro agendamento, digite 'agendar'.");
        if (lowerText.includes('agendar')) {
            setStep('SELECT_SERVICE');
            const serviceList = services.map((s, i) => `${i + 1}. ${s.name} (R$ ${s.price})`).join('\n');
            addBotMessage(`Escolha um serviço:\n\n${serviceList}`, services.map((_, i) => (i + 1).toString()));
        }
        break;
    }
  };

  const checkAvailabilityAndBook = (time: string) => {
    // Ensure we have a date, otherwise fallback to today
    const date = bookingData.date || new Date().toISOString().split('T')[0];
    
    // Double Check Conflict
    const isBusy = appointments.some(app => 
      app.date === date && 
      app.time === time && 
      app.status !== AppointmentStatus.CANCELLED &&
      (app.barberId ? app.barberId === bookingData.barberId : true) 
    );

    if (isBusy) {
      addBotMessage(`⚠️ Opa! O horário das ${time} acabou de ser ocupado. Por favor, escolha outro.`);
      return;
    }

    // Create Appointment
    const service = services.find(s => s.id === bookingData.serviceId);
    const barber = barbers.find(b => b.id === bookingData.barberId);

    if (service && barber) {
      const dateDisplay = new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');

      const newAppt: Appointment = {
        id: Date.now().toString(),
        clientId: 'whatsapp-guest',
        clientName: 'Cliente WhatsApp', // In a real bot, we'd get this from the profile
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        date: date,
        time: time,
        status: AppointmentStatus.CONFIRMED,
        barberId: barber.id,
        barberName: barber.name
      };

      onAddAppointment(newAppt);
      setStep('CONFIRMATION');
      addBotMessage(`✅ Agendamento Confirmado!\n\nServiço: ${service.name}\nBarbeiro: ${barber.name}\nData: ${dateDisplay}\nHorário: ${time}\n\nCaso precise cancelar, é só responder por aqui. Te esperamos lá!`);
    }
  };

  return (
    <div className="h-screen bg-[#e5ddd5] flex flex-col relative">
      {/* WhatsApp Header */}
      <div className="bg-[#075e54] text-white p-4 flex items-center gap-3 shadow-md z-10">
        <button onClick={() => navigate('/app/settings')}>
          <ArrowLeft size={24} />
        </button>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
             <Bot className="text-gray-600" size={24} />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-lg">BarberPro Bot</h2>
          <p className="text-xs opacity-80">online</p>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4" 
        ref={scrollRef}
        style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat' }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm relative ${
                msg.sender === 'user' 
                  ? 'bg-[#dcf8c6] text-gray-800 rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
              <span className="text-[10px] text-gray-500 block text-right mt-1">
                {new Date(parseInt(msg.id)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            
            {/* Quick Reply Options */}
            {msg.options && (
              <div className="flex flex-wrap gap-2 mt-2 max-w-[80%]">
                {msg.options.map((opt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleOptionClick(opt)}
                    className="bg-white border border-gray-200 text-primary-600 px-3 py-2 rounded-full text-xs font-bold shadow-sm hover:bg-gray-50 active:scale-95 transition-transform"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white p-2 flex items-center gap-2">
        <div className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center">
            <input 
              type="text" 
              className="w-full outline-none text-gray-700"
              placeholder="Digite uma mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
        </div>
        <button 
          onClick={handleSend}
          className="bg-[#075e54] text-white p-3 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};