import React, { useState } from 'react';
import { getStyleRecommendations } from '../services/geminiService';
import { AIRecommendation } from '../types';
import { Sparkles, Loader2, Info, Check } from 'lucide-react';

export const AIStylist: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    faceShape: 'Oval',
    hairType: 'Liso e Fino',
    lifestyle: 'Moderno e Prático'
  });
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    const results = await getStyleRecommendations(formData.faceShape, formData.hairType, formData.lifestyle);
    setRecommendations(results);
    setLoading(false);
    setStep(2);
  };

  const reset = () => {
    setStep(1);
    setRecommendations([]);
  };

  return (
    <div className="h-full pb-24 overflow-y-auto no-scrollbar">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="text-primary-500" fill="currentColor" />
          Consultor IA
        </h1>
        <p className="text-gray-500 text-sm">Descubra o estilo ideal para seu cliente</p>
      </header>

      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6 rounded-2xl text-white shadow-lg">
            <h2 className="font-bold text-lg mb-2">Assistente de Estilo</h2>
            <p className="opacity-90 text-sm">Use nossa inteligência artificial para sugerir cortes baseados no rosto e estilo do cliente.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Formato do Rosto</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                value={formData.faceShape}
                onChange={e => setFormData({...formData, faceShape: e.target.value})}
              >
                <option>Oval</option>
                <option>Quadrado</option>
                <option>Redondo</option>
                <option>Diamante</option>
                <option>Triangular</option>
                <option>Retangular</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Cabelo</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                value={formData.hairType}
                onChange={e => setFormData({...formData, hairType: e.target.value})}
              >
                <option>Liso e Fino</option>
                <option>Liso e Grosso</option>
                <option>Ondulado</option>
                <option>Cacheado</option>
                <option>Crespo</option>
                <option>Calvície inicial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estilo/Vibe</label>
              <input 
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                value={formData.lifestyle}
                onChange={e => setFormData({...formData, lifestyle: e.target.value})}
                placeholder="Ex: Executivo, Moderno, Clássico..."
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 mt-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Analisando...' : 'Gerar Recomendações'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <button onClick={reset} className="text-sm text-gray-500 hover:text-primary-600 mb-2">
            ← Voltar para filtros
          </button>
          
          {recommendations.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl">
              <Info className="mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Não foi possível gerar recomendações. Tente novamente.</p>
            </div>
          ) : (
            recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="bg-gray-50 p-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-900">{rec.styleName}</h3>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide
                      ${rec.maintenanceLevel.toLowerCase().includes('baixo') ? 'bg-green-100 text-green-700' : 
                        rec.maintenanceLevel.toLowerCase().includes('médio') ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'}`}>
                      Manutenção {rec.maintenanceLevel}
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{rec.description}</p>
                  
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Produtos Recomendados</h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.products.map((prod, pIdx) => (
                        <span key={pIdx} className="inline-flex items-center text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-md border border-primary-100">
                           <Check size={10} className="mr-1" /> {prod}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
