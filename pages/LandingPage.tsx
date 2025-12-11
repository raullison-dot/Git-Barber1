import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Calendar, TrendingUp, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary-500 p-1.5 rounded-lg text-white">
              <Scissors size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">BarberPro</span>
          </div>
          <div className="flex gap-4">
             <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-primary-600 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-5 py-2 text-sm font-bold bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-transform active:scale-95 shadow-lg"
            >
              Testar Grátis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop" 
            alt="Barbershop" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-gray-50/50 to-gray-50"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
            <Sparkles size={14} />
            Novo: Consultor de Estilo com IA
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            A gestão da sua barbearia <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">em outro nível.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Abandone o papel e caneta. Tenha agenda inteligente, controle financeiro e fidelização de clientes na palma da sua mão.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-primary-500 text-white font-bold rounded-xl text-lg shadow-xl shadow-primary-500/30 hover:bg-primary-600 transition-all flex items-center justify-center gap-2"
            >
              Acessar Sistema <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 font-bold rounded-xl text-lg hover:bg-gray-50 transition-colors">
              Ver Vídeo Demo
            </button>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary-200 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-500 mb-6 group-hover:scale-110 transition-transform">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Agenda Inteligente</h3>
              <p className="text-gray-600 leading-relaxed">Organize seus horários com facilidade, evite conflitos e reduza faltas com confirmações automáticas.</p>
            </div>
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary-200 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-500 mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Controle Financeiro</h3>
              <p className="text-gray-600 leading-relaxed">Visualize seu faturamento diário, semanal e mensal com gráficos claros e relatórios detalhados.</p>
            </div>
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary-200 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-500 mb-6 group-hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">IA Stylist</h3>
              <p className="text-gray-600 leading-relaxed">Surpreenda seus clientes com recomendações de cortes personalizadas baseadas no formato do rosto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* App Showcase */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Leve sua barbearia no bolso</h2>
            <div className="space-y-4">
              {[
                'Acesso de qualquer lugar',
                'Cadastro ilimitado de clientes',
                'Histórico de atendimentos',
                'Marketing automático via WhatsApp'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="text-primary-500" size={20} />
                  <span className="text-gray-300 font-medium">{item}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="mt-8 px-8 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Começar Agora
            </button>
          </div>
          <div className="flex-1 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
             {/* Mockup visual representation using CSS */}
            <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl flex flex-col overflow-hidden">
                <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800">
                  <img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg m-4 text-center">
                        <Scissors className="mx-auto text-primary-500 mb-2" size={32} />
                        <p className="text-gray-900 font-bold text-lg">BarberPro Mobile</p>
                        <p className="text-gray-500 text-xs mt-1">Sua agenda organizada</p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary-500 p-1.5 rounded-lg text-white">
                  <Scissors size={18} />
                </div>
                <span className="font-bold text-lg">BarberPro</span>
              </div>
              <p className="text-gray-500 text-sm">Tecnologia de ponta para barbearias modernas.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-900">Produto</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Funcionalidades</li>
                <li>Preços</li>
                <li>Atualizações</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-900">Suporte</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Ajuda</li>
                <li>Comunidade</li>
                <li>Contato</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-900">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Privacidade</li>
                <li>Termos</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm pt-8 border-t border-gray-200">
            © 2024 BarberPro Mobile. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};