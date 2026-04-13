import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Info, Phone, AlertCircle, ShoppingBag } from 'lucide-react';
import api from '../services/api';

export const ProviderDetail = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await api.get(`/shops/${id}`);
        setProvider(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProvider();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-40 bg-slate-50 min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-slate-500 font-bold animate-pulse">Chargement de votre dossier...</p>
    </div>
  );
  
  if (error || !provider) return (
    <div className="flex flex-col justify-center items-center py-40 text-slate-500 bg-white min-h-screen">
      <AlertCircle className="h-16 w-16 mb-4 text-slate-300" />
      <h2 className="text-xl font-bold text-slate-800">{String(error || 'Établissement introuvable')}</h2>
      <Link to="/" className="mt-8 px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Retour à l'accueil</Link>
    </div>
  );

  const name = String(provider.name || 'Établissement');

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* Header Banner */}
          <div className="h-60 bg-gradient-to-r from-primary to-secondary relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 opacity-10 blur-3xl scale-150 rotate-12 overflow-hidden pointer-events-none">
              <ShoppingBag className="h-full w-full text-white" />
            </div>
            {provider.banner && <img src={provider.banner} alt="Bannière" className="absolute inset-0 w-full h-full object-cover" />}
          </div>
          
          <div className="px-10 pb-12 relative">
            {/* Logo Badge */}
            <div className="h-32 w-32 bg-white rounded-3xl p-2 absolute -top-16 shadow-2xl border border-slate-50 overflow-hidden flex items-center justify-center">
              <div className="h-full w-full bg-slate-50 rounded-2xl flex items-center justify-center text-5xl text-slate-300 font-black border border-slate-100 overflow-hidden group">
                {provider.logo ? <img src={provider.logo} className="w-full h-full object-cover" alt="Logo"/> : name.charAt(0)}
              </div>
            </div>
            
            <div className="pt-24 flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="flex-1 min-w-0">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
                  {String(provider.type || 'Établissement Médical')}
                </span>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">{name}</h1>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-slate-100/50 transition-colors">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Localisation</p>
                        <p className="text-sm font-bold text-slate-700 leading-snug">{String(provider.address || 'Adresse en cours...')}, {String(provider.city || '')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-slate-100/50 transition-colors">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Contact Direct</p>
                        <p className="text-sm font-bold text-slate-700">{String(provider.phone || 'Non disponible')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Sidebar Piece */}
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 w-full md:w-80 flex-shrink-0 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none scale-150">
                  <Info className="h-full w-full text-white" />
                </div>
                <h3 className="font-black text-white mb-6 text-xl tracking-wide">Prendre rendez-vous</h3>
                <button className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-sm mb-6">
                  Accéder à l'agenda
                </button>
                <div className="pt-6 border-t border-white/10 text-xs font-bold text-white/40 uppercase tracking-tighter w-full">
                  <div className="flex items-center justify-center gap-2 mb-4 text-white/60">
                     <Info className="h-4 w-4" />
                     <span>Horaires d'ouverture</span>
                  </div>
                  {provider.openingHours && typeof provider.openingHours === 'object' ? (
                    <div className="space-y-3">
                       {Object.entries(provider.openingHours).map(([day, hours]: any) => (
                         <div key={day} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                           <span className="capitalize text-white/40">{day}</span>
                           <span className="text-primary font-black">{String(hours || 'Fermé')}</span>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <p className="py-8 italic opacity-30 text-xs">Veuillez contacter l'établissement.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-100 px-10 py-12 bg-slate-50/30">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              Présentation & Services
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 space-y-4">
                  <p className="text-slate-600 leading-relaxed font-bold text-lg italic bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    "{String(provider.description || `${name} est un établissement de référence dédié à votre santé.`)}"
                  </p>
               </div>
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Spécialités</h3>
                  <div className="flex flex-wrap gap-2">
                     {Array.isArray(provider.services) ? provider.services.map((s: string, i: number) => (
                       <span key={i} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-700 shadow-sm">
                         {String(s)}
                       </span>
                     )) : <p className="text-xs font-bold text-slate-400 italic">Services en cours de listing...</p>}
                  </div>
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
