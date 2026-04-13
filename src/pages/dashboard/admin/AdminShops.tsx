import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, CheckCircle, AlertCircle, Search, FileText, Loader2, ExternalLink, Eye, X, MapPin, Phone, Mail } from 'lucide-react';
import api from '../../../services/api';

export const AdminShops = () => {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedShop, setSelectedShop] = useState<any>(null);

  const fetchShops = async () => {
    setLoading(true);
    try {
      const res = await api.get('/shops'); 
      if (res.data && res.data.data) {
        setShops(res.data.data.shops || []);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const filteredShops = Array.isArray(shops) ? shops.filter(shop => {
    const name = String(shop.name || '');
    const city = String(shop.city || '');
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                         city.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'validated' && shop.isValidated) || 
                         (filter === 'pending' && !shop.isValidated);
    return matchesSearch && matchesFilter;
  }) : [];

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-40">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <p className="text-slate-500 font-bold">Chargement du registre...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center tracking-tight">
            <ShoppingBag className="h-7 w-7 mr-3 text-primary" /> 
            Registre des Établissements
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-bold">Contrôle complet des boutiques et de leur dossier administratif.</p>
        </div>
        <div className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">
           Total : {shops.length} unités
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
            <input 
              type="text" 
              placeholder="Nom, ville, spécialité..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-4 focus:ring-primary/10 text-sm font-bold transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
            {['all', 'pending', 'validated'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)} 
                className={`px-5 py-2 rounded-lg text-xs font-black transition-all uppercase tracking-tighter ${filter === f ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : 'Validés'}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {filteredShops.length === 0 ? (
            <div className="p-24 text-center">
               <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="h-10 w-10 text-slate-200" />
               </div>
               <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Aucune donnée correspondante</p>
            </div>
          ) : filteredShops.map(shop => (
            <div key={shop._id} className="p-6 hover:bg-slate-50 transition-all group">
              <div className="flex flex-col md:flex-row justify-between gap-6 items-center">
                <div className="flex gap-5 w-full md:w-auto">
                   <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 shadow-sm overflow-hidden group-hover:bg-white transition-colors">
                      {shop.logo ? <img src={shop.logo} className="w-full h-full object-contain" alt="Logo"/> : <ShoppingBag className="h-8 w-8 text-slate-200" />}
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">{String(shop.name || 'Sans Nom')}</h2>
                        {shop.isValidated ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-amber-500" />}
                      </div>
                      <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
                        <MapPin className="h-4 w-4 opacity-30" />
                        {String(shop.address || 'Adresse à confirmer')}, {String(shop.city || '')}
                      </p>
                      <div className="flex items-center gap-3 mt-4">
                         <span className="text-[10px] font-black uppercase bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/5 shadow-sm">{String(shop.type)}</span>
                         <span className="text-[10px] font-black text-slate-400 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {String(shop.phone)}
                         </span>
                      </div>
                   </div>
                </div>

                   <div className="hidden lg:flex gap-2 mx-6 flex-1 overflow-hidden">
                      {Array.isArray(shop.documents) && shop.documents.length > 0 ? shop.documents.slice(0, 3).map((doc: any, idx: number) => (
                        <a 
                          key={idx} 
                          href={doc.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-blue-50/50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-black border border-blue-100 transition-all truncate max-w-[120px]"
                          title={`Ouvrir ${doc.name}`}
                        >
                          <FileText className="h-3 w-3 shrink-0" />
                          <span className="truncate">{String(doc.name || 'Fichier')}</span>
                        </a>
                      )) : (
                        <span className="text-[10px] font-bold text-slate-300 italic">Aucun fichier fourni</span>
                      )}
                   </div>

                   <div className="flex items-center gap-2 border-l border-slate-200 pl-4 shrink-0">
                      <button 
                        onClick={() => setSelectedShop(shop)}
                        className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm border border-blue-100"
                        title="Vérifier tous les documents et informations"
                      >
                        <Eye className="h-5 w-5" />
                      </button>

                      <Link 
                        to={`/provider/${shop._id}`} 
                        target="_blank"
                        className="p-3 bg-slate-50 text-slate-300 hover:bg-slate-900 hover:text-white rounded-2xl transition-all border border-slate-100 shadow-sm"
                        title="Voir la vitrine publique"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </Link>
                   </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Modal */}
      {selectedShop && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-6 duration-300 border border-white/20">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 sticky top-0 z-10">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-200 overflow-hidden">
                   {selectedShop.logo ? <img src={selectedShop.logo} className="w-full h-full object-contain" alt="Logo"/> : <ShoppingBag className="h-8 w-8 text-slate-300" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">{String(selectedShop.name)}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black uppercase bg-primary text-white px-3 py-1 rounded-full shadow-md">{String(selectedShop.type)}</span>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md ${selectedShop.isValidated ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                      {selectedShop.isValidated ? 'Dossier Conforme' : 'Dossier à Valider'}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedShop(null)} className="p-4 bg-white hover:bg-red-50 hover:text-red-500 text-slate-300 rounded-3xl shadow-sm border border-slate-100 transition-all">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-10 lg:p-14 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Information Segment */}
                <div className="space-y-6">
                   <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center italic">
                     <div className="h-2 w-2 rounded-full bg-primary mr-3"></div> Contact & Localisation
                   </h3>
                   <div className="space-y-6">
                      <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100/50 shadow-sm">
                         <MapPin className="h-6 w-6 text-primary mt-1" />
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 leading-none">Emplacement Précis</p>
                            <p className="text-sm font-bold text-slate-700 leading-relaxed">{String(selectedShop.address || 'Non spécifiée')}, {String(selectedShop.city || '')}</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100/50 shadow-sm">
                            <Phone className="h-5 w-5 text-primary mb-3" />
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 leading-none">Téléphone</p>
                            <p className="text-sm font-bold text-slate-700">{String(selectedShop.phone || 'N/A')}</p>
                         </div>
                         <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100/50 shadow-sm overflow-hidden">
                            <Mail className="h-5 w-5 text-primary mb-3" />
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 leading-none">Email</p>
                            <p className="text-sm font-bold text-slate-700 truncate">{String(selectedShop.email || 'N/A')}</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Documents Segment */}
                <div className="space-y-6">
                   <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center italic">
                     <div className="h-2 w-2 rounded-full bg-blue-500 mr-3"></div> Dossier de Pièces Jointes
                   </h3>
                   <div className="space-y-3">
                      {Array.isArray(selectedShop.documents) && selectedShop.documents.length > 0 ? selectedShop.documents.map((doc: any, i: number) => (
                        <a 
                          key={i} 
                          href={doc.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-3xl hover:border-blue-500 hover:shadow-xl transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-all group-hover:bg-blue-600 group-hover:text-white">
                               <FileText className="h-6 w-6" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-800 leading-none mb-1">{String(doc.name || 'Fichier')}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase">Consultation Autorisée</p>
                            </div>
                          </div>
                          <ExternalLink className="h-5 w-5 text-slate-100 group-hover:text-primary transition-colors" />
                        </a>
                      )) : <p className="text-sm italic text-slate-300 p-12 border-2 border-dashed border-slate-50 rounded-[2rem] text-center font-bold">Dossier vide pour cet établissement.</p>}
                   </div>
                </div>
              </div>

              {/* Hours & Description */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-6">
                 <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center italic">
                      <div className="h-2 w-2 rounded-full bg-slate-800 mr-3"></div> Horaires de Service
                    </h3>
                    <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 shadow-inner">
                       {selectedShop.openingHours && typeof selectedShop.openingHours === 'object' ? (
                         <div className="space-y-3">
                           {Object.entries(selectedShop.openingHours).map(([day, hours]: any) => (
                             <div key={day} className="flex justify-between items-center text-xs border-b border-slate-200/50 pb-2 last:border-0 last:pb-0 font-bold uppercase tracking-tight">
                               <span className="text-slate-400">{String(day)}</span>
                               <span className={hours ? 'text-slate-800' : 'text-red-400'}>{String(hours || 'Fermé')}</span>
                             </div>
                           ))}
                         </div>
                       ) : <p className="text-xs font-bold text-slate-300 italic py-10 text-center">Données horaires indisponibles.</p>}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center italic">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 mr-3"></div> Présentation & Services
                    </h3>
                    <div className="flex flex-wrap gap-2">
                       {Array.isArray(selectedShop.services) && selectedShop.services.length > 0 ? selectedShop.services.map((s: string, i: number) => (
                         <span key={i} className="px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100/50 rounded-2xl text-[10px] font-black uppercase shadow-sm">
                           {String(s)}
                         </span>
                       )) : <p className="text-xs font-bold text-slate-300 p-8 bg-slate-50 rounded-3xl w-full text-center">Aucun service listé.</p>}
                    </div>
                    {selectedShop.description && (
                      <div className="mt-8 p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm relative italic text-slate-600 text-sm leading-relaxed font-bold">
                        <div className="absolute -top-4 left-8 px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest not-italic shadow-lg shadow-slate-200">Bio</div>
                        "{String(selectedShop.description)}"
                      </div>
                    )}
                 </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-slate-100 flex justify-end bg-white shrink-0 sticky bottom-0 z-10 shadow-up">
               <button 
                onClick={() => setSelectedShop(null)}
                className="px-12 py-4 rounded-3xl bg-slate-900 text-white hover:bg-black transition-all font-black text-sm uppercase tracking-widest shadow-2xl shadow-slate-400"
              >
                Fermer l'audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
