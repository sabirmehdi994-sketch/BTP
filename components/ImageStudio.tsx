
import React, { useState, useRef } from 'react';
import { 
  Download, 
  RefreshCw, 
  Trash2, 
  Upload, 
  Wand2,
  CheckCircle2,
  AlertCircle,
  Factory,
  Maximize2
} from 'lucide-react';
import { generateImage, editImage } from '../services/geminiService';

const ImageStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{url: string, prompt: string}[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    const url = await generateImage(prompt);
    if (url) {
      setGeneratedImages([{ url, prompt }, ...generatedImages]);
      setSelectedImage(url);
    }
    setIsLoading(false);
    setPrompt('');
  };

  const handleEdit = async () => {
    if (!selectedImage || !editPrompt.trim()) return;
    setIsEditing(true);
    const updatedUrl = await editImage(selectedImage, editPrompt);
    if (updatedUrl) {
      setSelectedImage(updatedUrl);
      setGeneratedImages(prev => prev.map(img => 
        img.url === selectedImage ? { ...img, url: updatedUrl, prompt: `Ops: ${editPrompt}` } : img
      ));
    }
    setIsEditing(false);
    setEditPrompt('');
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedImage(base64);
        setGeneratedImages([{ url: base64, prompt: 'Upload Produit' }, ...generatedImages]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Controls */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-xl font-bold flex items-center gap-2 text-orange-500">
            <Factory size={20} /> Optimisation Technique
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Description du produit / scène</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all resize-none leading-relaxed"
              placeholder="Ex: Tubes HDPE DN100 stockés sur un chantier VRD, lumière du jour, perspective technique..."
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-orange-500 text-slate-950 py-3 rounded-xl font-bold hover:bg-orange-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/10"
          >
            {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />}
            {isLoading ? 'Génération en cours...' : 'Générer Rendu Réaliste'}
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-800"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-slate-900 px-2 text-slate-500">Traitement Photo</span></div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-slate-800 text-slate-100 py-3 rounded-xl font-medium hover:bg-slate-700 transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            <Upload size={18} /> Charger Photo Produit
          </button>
          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-[10px] font-bold uppercase text-slate-500 tracking-widest mb-4">Bibliothèque Technique</h3>
          <div className="grid grid-cols-2 gap-3">
            {generatedImages.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl">
                Aucun visuel
              </div>
            ) : (
              generatedImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img.url ? 'border-orange-500' : 'border-transparent hover:border-slate-700'}`}
                >
                  <img src={img.url} className="w-full h-full object-cover" alt="History" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Preview/Editor Area */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative group min-h-[550px] flex items-center justify-center shadow-2xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/50 to-slate-950">
          {selectedImage ? (
            <div className="w-full h-full flex flex-col items-center p-6">
              <div className="relative max-w-full max-h-[600px] shadow-2xl rounded-2xl overflow-hidden border border-slate-800">
                <img src={selectedImage} alt="BTP Visual Output" className="max-w-full h-auto object-contain" />
              </div>
              
              <div className="mt-8 w-full max-w-xl bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
                <div className="flex items-center gap-2 text-orange-500 mb-1">
                  <Maximize2 size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Édition de Précision</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Ex: Corriger l'exposition, ajouter logo, recadrer..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 text-sm outline-none focus:border-orange-500/50 transition-all"
                  />
                  <button
                    onClick={handleEdit}
                    disabled={isEditing || !editPrompt.trim()}
                    className="bg-orange-500 text-slate-950 px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-400 transition-all disabled:opacity-50"
                  >
                    {isEditing ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-12 space-y-6">
              <div className="bg-slate-800 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto text-slate-500 border border-slate-700 rotate-3">
                <Factory size={48} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-200 tracking-tight">Poste d'Optimisation Visuelle</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">Prêt à traiter vos photos de chantier ou catalogues de produits industriels.</p>
              </div>
            </div>
          )}

          {selectedImage && (
            <div className="absolute top-6 right-6 flex gap-2">
               <a 
                href={selectedImage} 
                download="btp-flow-export.png"
                className="p-3 bg-slate-900/90 backdrop-blur rounded-2xl text-slate-100 hover:text-orange-500 transition-all border border-slate-800 hover:border-orange-500/30"
              >
                <Download size={20} />
              </a>
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-3 bg-slate-900/90 backdrop-blur rounded-2xl text-slate-100 hover:text-red-500 transition-all border border-slate-800 hover:border-red-500/30"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-2xl flex items-center gap-4 text-xs text-slate-400">
          <AlertCircle size={18} className="text-orange-500 shrink-0" />
          <p>
            Les visuels générés respectent les standards du secteur B2B. Utilisez des mots-clés techniques (PN16, DN100, Assainissement) pour une précision accrue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageStudio;
