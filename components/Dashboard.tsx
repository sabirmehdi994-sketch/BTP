
import React from 'react';
import { Mail, Factory, Sparkles, ArrowRight, Zap, Clock, Star, HardHat } from 'lucide-react';
import { ViewType } from '../types';

interface DashboardProps {
  setView: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const stats = [
    { label: 'Offres Émises', value: '42', icon: Mail, color: 'text-orange-400' },
    { label: 'Visuels Produits', value: '156', icon: Factory, color: 'text-blue-400' },
    { label: 'Taux de Closing', value: '74%', icon: Zap, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-orange-900/10 rounded-3xl p-8 border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 tracking-widest border border-orange-500/20">
            <HardHat size={14} /> BTP Expert System
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Console de Ventes & Opérations</h1>
          <p className="text-slate-400 text-lg mb-6 leading-relaxed">
            Optimisez vos réponses commerciales et vos visuels techniques pour les réseaux d'assainissement, VRD et adduction d'eau.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setView(ViewType.EMAIL_ASSISTANT)}
              className="bg-orange-500 text-slate-950 px-6 py-3 rounded-xl font-bold hover:bg-orange-400 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
            >
              Gérer les Demandes <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => setView(ViewType.IMAGE_STUDIO)}
              className="bg-slate-800 text-white border border-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-700 transition-all"
            >
              Optimisation Produit
            </button>
          </div>
        </div>
        <div className="absolute right-[-10%] top-[-10%] opacity-5 pointer-events-none">
          <Factory size={400} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-slate-800 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-slate-500 text-sm flex items-center gap-1">
                <Clock size={14} /> Temps Réel
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-slate-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Star size={20} className="text-orange-400" /> Activité Récente
          </h2>
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
            {[
              { text: 'Devis généré pour Tube PEHD PN16', time: '5m', type: 'email' },
              { text: 'Correction photo : Raccord PVC Ø200', time: '42m', type: 'image' },
              { text: 'Relance client : Chantier VRD Casablanca', time: '2h', type: 'email' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 border-b border-slate-800 last:border-0 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.type === 'email' ? 'bg-orange-400' : 'bg-blue-400'}`} />
                  <span className="text-slate-300 text-sm">{item.text}</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-6 flex flex-col justify-center">
          <div className="bg-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-slate-950 shadow-lg shadow-orange-500/10">
             <Zap size={24} />
          </div>
          <h3 className="text-lg font-bold text-orange-500 mb-2">Objectif Closing</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Rappel : Pour chaque demande de prix, demandez systématiquement le lieu de livraison pour anticiper les frais logistiques.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
