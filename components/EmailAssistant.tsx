
import React, { useState } from 'react';
import { 
  Search, 
  Mail, 
  Send, 
  Archive, 
  Trash, 
  Sparkles, 
  RefreshCw,
  Clock,
  User,
  CheckCircle,
  Copy,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { generateEmailDraft } from '../services/geminiService';
import { Email } from '../types';

const MOCK_EMAILS: Email[] = [
  {
    id: '1',
    sender: 'SOUFIANE - Entreprise VRD',
    subject: 'Demande de prix : Tubes PEHD DN200 PN16',
    body: 'Bonjour, Pouvez-vous nous envoyer une offre de prix pour 450 mètres de tubes PEHD DN200 PN16 pour notre chantier à El Jadida ? Quel est votre délai de livraison actuel ? Cordialement.',
    timestamp: '10:45',
    status: 'unread'
  },
  {
    id: '2',
    sender: 'Bureau d\'études ODA',
    subject: 'Fiche technique : Regard de visite assainissement',
    body: 'Bonjour, Pourriez-vous nous transmettre les fiches techniques de vos regards de visite en béton pré-fabriqué ? Nous en avons besoin pour validation par le maître d\'ouvrage. Merci.',
    timestamp: '09:12',
    status: 'unread'
  },
  {
    id: '3',
    sender: 'Directeur Achats - Grands Chantiers',
    subject: 'Négociation projet Autoroute 4',
    body: 'Suite à notre réunion, nous sommes prêts à valider la commande pour les gaines de fibre optique si vous faites un effort supplémentaire de 5% sur le prix unitaire. Qu\'en pensez-vous ?',
    timestamp: 'Hier',
    status: 'replied',
    aiDraft: "Bonjour,\n\nMerci pour votre retour. Concernant le projet Autoroute 4, nous avons bien pris note de votre demande de remise. \n\nSeriez-vous disponible pour un court appel demain à 10h afin de finaliser les termes de ce partenariat ?\n\nCordialement,\nVotre Assistant Ventes"
  }
];

const EmailAssistant: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [currentDraft, setCurrentDraft] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateDraft = async () => {
    if (!selectedEmail) return;
    setIsDrafting(true);
    const draft = await generateEmailDraft(selectedEmail.body);
    setCurrentDraft(draft);
    setIsDrafting(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const markAsReplied = () => {
    if (!selectedEmail) return;
    setEmails(prev => prev.map(e => 
      e.id === selectedEmail.id ? { ...e, status: 'replied', aiDraft: currentDraft } : e
    ));
    setSelectedEmail(null);
    setCurrentDraft('');
  };

  return (
    <div className="flex bg-slate-900 rounded-3xl border border-slate-800 h-[calc(100vh-12rem)] overflow-hidden animate-in fade-in duration-500">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-900/50">
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher clients/chantiers..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-orange-500/50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {emails.map(email => (
            <button
              key={email.id}
              onClick={() => {
                setSelectedEmail(email);
                setCurrentDraft(email.aiDraft || '');
              }}
              className={`w-full p-4 border-b border-slate-800 text-left hover:bg-slate-800/50 transition-colors relative ${selectedEmail?.id === email.id ? 'bg-slate-800' : ''}`}
            >
              {email.status === 'unread' && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full" />
              )}
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm truncate pr-2 text-slate-200">{email.sender}</span>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">{email.timestamp}</span>
              </div>
              <div className="text-xs font-semibold text-orange-400/80 truncate mb-1">{email.subject}</div>
              <div className="text-xs text-slate-500 line-clamp-2">{email.body}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Reader / Drafter */}
      <div className="flex-1 flex flex-col bg-slate-950">
        {selectedEmail ? (
          <>
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-orange-500 border border-slate-700">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">{selectedEmail.sender}</h3>
                  <p className="text-xs text-slate-500">Classification : B2B Demande</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-500 hover:text-slate-100 transition-colors"><Archive size={18} /></button>
                <button className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash size={18} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-100">{selectedEmail.subject}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock size={12} /> Reçu à {selectedEmail.timestamp}
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
                {selectedEmail.body}
              </p>

              {/* AI Interaction Area */}
              <div className="border-t border-slate-800 pt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-orange-500">
                    <TrendingUp size={18} />
                    <span className="font-bold uppercase tracking-widest text-xs">Assistant Closing AI</span>
                  </div>
                  <div className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase">
                    Mode Professionnel Français
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative group shadow-inner">
                  <textarea
                    value={currentDraft}
                    onChange={(e) => setCurrentDraft(e.target.value)}
                    className="w-full h-48 bg-transparent p-6 text-sm text-slate-300 outline-none resize-none placeholder:text-slate-700 leading-relaxed"
                    placeholder="Générez un brouillon pour répondre professionnellement..."
                  />
                  {!currentDraft && !isDrafting && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                       <p className="text-sm italic">Prêt pour la génération d'offre</p>
                    </div>
                  )}
                  {isDrafting && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                      <RefreshCw className="animate-spin text-orange-500" size={24} />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Analyse Techniques & Closing...</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleGenerateDraft}
                    disabled={isDrafting}
                    className="flex-1 bg-orange-500 text-slate-950 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-400 transition-all shadow-xl shadow-orange-500/10 disabled:opacity-50"
                  >
                    <Sparkles size={18} /> {currentDraft ? 'Régénérer Brouillon' : 'Générer Réponse B2B'}
                  </button>
                  {currentDraft && (
                    <>
                      <button
                        onClick={copyToClipboard}
                        className="px-6 bg-slate-800 text-slate-100 rounded-xl hover:bg-slate-700 transition-all flex items-center gap-2 border border-slate-700"
                      >
                        {copied ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} />}
                        {copied ? 'Copié' : 'Copier'}
                      </button>
                      <button
                        onClick={markAsReplied}
                        className="px-6 bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-xl hover:bg-orange-600/30 transition-all flex items-center gap-2 font-bold"
                      >
                        <Send size={18} /> Marquer Envoyé
                      </button>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[11px] text-blue-400/80">
                  <AlertCircle size={14} />
                  <span>Le modèle a été configuré pour ne jamais inventer de stocks ou de prix sans validation.</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 space-y-4">
            <div className="w-20 h-20 rounded-3xl border-2 border-dashed border-slate-800 flex items-center justify-center">
              <Mail size={32} />
            </div>
            <p className="text-lg font-medium">Sélectionnez une demande client pour commencer</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailAssistant;
