import { useState, useEffect } from 'react';
import { ShieldCheck, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../../services/api';

export const AdminValidations = () => {
  const [pendingShops, setPendingShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/shops/pending');
      setPendingShops(res.data.data);
    } catch (err) {
      console.error("Failed to fetch pending shops:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleValidate = async (id: string) => {
    try {
      await api.put(`/admin/shops/${id}/validate`, { isValidated: true });
      setPendingShops(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  const handleReject = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ? Cette action est irréversible.")) {
      try {
        await api.delete(`/admin/shops/${id}`);
        setPendingShops(prev => prev.filter(s => s._id !== id));
      } catch (err) {
        console.error("Rejection failed:", err);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Validations Prestataires</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Vérifiez les documents réglementaires des professionnels de santé.</p>
        </div>
        <div className="bg-amber-100 text-amber-800 font-bold px-4 py-2.5 rounded-lg text-sm flex items-center shadow-sm">
          <ShieldCheck className="h-5 w-5 mr-2" />
          {pendingShops.length} Dossiers en attente
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pendingShops.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-20 text-center">
            <div className="h-20 w-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Tout est à jour !</h2>
            <p className="text-slate-500 font-medium font-sans">Il n'y a actuellement aucune boutique en attente de validation.</p>
          </div>
        ) : pendingShops.map((prov) => (
          <div key={prov._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-6 mb-6">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center font-bold text-slate-500 shrink-0 text-2xl shadow-sm overflow-hidden">
                  {prov.logo ? <img src={prov.logo} className="w-full h-full object-cover" /> : prov.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800">{prov.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                    <span className="font-bold text-primary bg-primary-light px-3 py-1 rounded-md uppercase tracking-wider text-xs">{prov.type}</span>
                    <span className="text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">Propriétaire : {prov.owner?.firstName} {prov.owner?.lastName}</span>
                    <span className="text-slate-400 font-medium">Soumis : {new Date(prov.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button 
                  onClick={() => handleReject(prov._id)}
                  className="flex-1 md:flex-none flex items-center justify-center bg-white border border-red-200 text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm"
                >
                  <XCircle className="h-5 w-5 mr-2" /> Refuser
                </button>
                <button 
                  onClick={() => handleValidate(prov._id)}
                  className="flex-1 md:flex-none flex items-center justify-center bg-emerald-500 text-white hover:bg-emerald-600 px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm shadow-emerald-500/20"
                >
                  <CheckCircle className="h-5 w-5 mr-2" /> Valider le profil
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider relative inline-block">
                Informations de contact & Coordonnées
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-100"></div>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Email professionnel</div>
                  <div className="text-slate-700 font-bold">{prov.email || prov.owner?.email}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Téléphone</div>
                  <div className="text-slate-700 font-bold">{prov.phone || prov.owner?.phone}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Adresse / Ville</div>
                  <div className="text-slate-700 font-bold">{prov.address}, {prov.city}</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-bold text-slate-700 mb-3 text-sm">Documents justificatifs</h4>
                <div className="flex flex-wrap gap-3">
                   {(prov.documents && prov.documents.length > 0) ? prov.documents.map((doc: any, idx: number) => (
                      <a 
                        key={idx} 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-white border border-slate-200 rounded-xl hover:border-primary cursor-pointer transition-all group"
                      >
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-primary">{doc.name}</span>
                      </a>
                   )) : (
                     <div className="text-slate-400 text-xs font-bold uppercase italic">Aucun document numérique soumis</div>
                   )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
