import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Store, Camera, Save, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, FileText, X } from 'lucide-react';
import api from '../../services/api';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = {
  monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi', thursday: 'Jeudi',
  friday: 'Vendredi', saturday: 'Samedi', sunday: 'Dimanche'
};

export const ProviderBoutique = () => {
  const { user } = useAuth();
  
  const [shopId, setShopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({ logo: false, banner: false });
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const docInputRefs = useRef<any>({});

  const [formData, setFormData] = useState<any>({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
    type: 'pharmacy',
    specialty: '',
    description: '',
    address: '',
    city: '',
    phone: user?.phone || '',
    email: user?.email || '',
    website: '',
    logo: '',
    banner: '',
    openingHours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '13:00', closed: true },
      sunday: { open: '09:00', close: '13:00', closed: true },
    },
    detailedServices: []
  });

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await api.get('/shops/me');
        if (res.data.success && res.data.data) {
           const shop = res.data.data;
           setShopId(shop._id);
           setFormData({
             ...formData,
             ...shop,
             openingHours: shop.openingHours || formData.openingHours
           });
        }
      } catch (err) {
        console.log("No existing shop found or error");
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading({ ...uploading, [field]: true });
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, [field]: res.data.data });
      setMessage({ type: 'success', text: `${field === 'logo' ? 'Logo' : 'Bannière'} téléchargé avec succès.` });
    } catch (err) {
      setMessage({ type: 'error', text: 'Échec du téléchargement.' });
    } finally {
      setUploading({ ...uploading, [field]: false });
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, docName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newDocs = [
        ...(formData.documents || []).filter((d:any) => d.name !== docName),
        { name: docName, url: res.data.data }
      ];
      
      setFormData({ ...formData, documents: newDocs });
      setMessage({ type: 'success', text: `Document ${docName} téléchargé.` });
    } catch (err) {
      setMessage({ type: 'error', text: 'Échec du téléchargement du document.' });
    }
  };

  const handleSave = async () => {
    try {
      setMessage({ type: '', text: '' });
      const payload = { ...formData, coordinates: [0, 0] }; // Default coordinates to satisfy backend
      
      if (shopId) {
        await api.put(`/shops/${shopId}`, payload);
        setMessage({ type: 'success', text: 'Boutique mise à jour avec succès.' });
      } else {
        const res = await api.post('/shops', payload);
        setShopId(res.data.data._id);
        setMessage({ type: 'success', text: 'Boutique créée avec succès.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la sauvegarde.' });
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
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <Store className="h-7 w-7 mr-3 text-primary" /> 
            Configuration de ma Boutique
          </h1>
          <p className="text-slate-500 mt-1.5 text-[15px] font-medium">Gérez votre profil public et vos horaires.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSave}
            className="bg-primary text-white hover:bg-primary-dark px-6 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-primary/30 flex items-center transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Enregistrer les modifications
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="font-bold text-sm">{message.text}</span>
        </div>
      )}

      {shopId && (
        <div className={`p-4 rounded-xl flex items-center gap-3 shadow-sm border ${formData.isValidated ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
          {formData.isValidated ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />}
          <div>
            <span className="font-bold block">Statut de la boutique : {formData.isValidated ? 'Validée' : 'En attente de validation'}</span>
            <span className="text-xs font-medium opacity-80">
              {formData.isValidated 
                ? 'Votre établissement est maintenant visible publiquement par tous les patients.' 
                : 'Un administrateur doit vérifier et approuver vos informations avant qu\'elles ne soient publiques.'}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 mb-5 border-b pb-3">Images</h2>
            
            <div className="space-y-6">
              {/* Logo Upload */}
              <div onClick={() => logoInputRef.current?.click()} className="relative group cursor-pointer">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Logo</label>
                <div className="h-32 w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 overflow-hidden relative group-hover:border-primary transition-all">
                  {formData.logo ? (
                    <img src={formData.logo} className="h-full w-full object-contain" />
                  ) : (
                    <Camera className="h-8 w-8 text-slate-300 group-hover:text-primary transition-colors" />
                  )}
                  {uploading.logo && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}
                </div>
                <input type="file" ref={logoInputRef} onChange={(e) => handleFileUpload(e, 'logo')} className="hidden" accept="image/*" />
              </div>

              {/* Banner Upload */}
              <div onClick={() => bannerInputRef.current?.click()} className="relative group cursor-pointer">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Bannière</label>
                <div className="h-32 w-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 overflow-hidden relative group-hover:border-primary transition-all">
                  {formData.banner ? (
                    <img src={formData.banner} className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-slate-300 group-hover:text-primary transition-colors" />
                  )}
                  {uploading.banner && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}
                </div>
                <input type="file" ref={bannerInputRef} onChange={(e) => handleFileUpload(e, 'banner')} className="hidden" accept="image/*" />
              </div>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="font-bold text-slate-800 mb-6 border-b pb-3">Informations de base</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nom de l'établissement</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Type d'établissement</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium" 
                  value={formData.type} 
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="pharmacy">Pharmacie</option>
                  <option value="hospital">Hôpital</option>
                  <option value="clinic">Clinique</option>
                  <option value="doctor_office">Cabinet Médical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Ville</label>
                <input type="text" placeholder="Ex: Douala, Yaoundé..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Spécialité / Sous-titre</label>
                <input type="text" placeholder="Ex: Pharmacie de garde 24/7" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium" value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 font-medium resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="font-bold text-slate-800 mb-6 border-b pb-3 uppercase text-[10px] tracking-widest text-slate-400">Documents Officiels (Requis)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Document CNI */}
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                     <FileText className="h-5 w-5 text-blue-500 shrink-0" />
                     <div className="overflow-hidden">
                        <span className="text-sm font-bold text-slate-700 block truncate">Pièce d'identité (CNI)</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{formData.documents?.find((d:any) => d.name === 'CNI') ? 'Fichier envoyé ✅' : 'En attente'}</span>
                     </div>
                  </div>
                  <button onClick={() => docInputRefs.current['CNI']?.click()} className="text-[10px] font-bold bg-white border border-slate-200 hover:border-primary text-slate-500 hover:text-primary px-3 py-1.5 rounded-lg transition-all shadow-sm shrink-0 uppercase tracking-tighter">
                     Choisir
                  </button>
                  <input type="file" className="hidden" ref={el => { docInputRefs.current['CNI'] = el }} onChange={(e) => handleDocUpload(e, 'CNI')} />
               </div>

               {/* Document Licence */}
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                     <FileText className="h-5 w-5 text-emerald-500 shrink-0" />
                     <div className="overflow-hidden">
                        <span className="text-sm font-bold text-slate-700 block truncate">Licence / Diplôme</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{formData.documents?.find((d:any) => d.name === 'Licence') ? 'Fichier envoyé ✅' : 'En attente'}</span>
                     </div>
                  </div>
                  <button onClick={() => docInputRefs.current['Licence']?.click()} className="text-[10px] font-bold bg-white border border-slate-200 hover:border-primary text-slate-500 hover:text-primary px-3 py-1.5 rounded-lg transition-all shadow-sm shrink-0 uppercase tracking-tighter">
                     Choisir
                  </button>
                  <input type="file" className="hidden" ref={el => { docInputRefs.current['Licence'] = el }} onChange={(e) => handleDocUpload(e, 'Licence')} />
               </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="font-bold text-slate-800 mb-6 border-b pb-3 uppercase text-[10px] tracking-widest text-slate-400">Coordonnées de contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Adresse exacte (Rue, Quartier...)</label>
                <input type="text" placeholder="Ex: 123 Rue de la Santé, Akwa" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium text-primary shadow-sm" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Numéro de téléphone</label>
                <input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email de contact</label>
                <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Site Web / Réseaux sociaux</label>
                <input type="url" placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="font-bold text-slate-800 mb-6 border-b pb-3 flex justify-between items-center">
              <span>{formData.type === 'pharmacy' ? 'Inventaire des Médicaments & Produits' : 'Services & Actes Médicaux détaillés'}</span>
              <button 
                onClick={() => setFormData({
                  ...formData, 
                  detailedServices: [...(formData.detailedServices || []), { name: '', price: 0, description: '', category: formData.type === 'pharmacy' ? 'Pharmacie' : 'Consultation', isAvailable: true }]
                })}
                className="text-[10px] font-black bg-primary text-white px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 transition-transform uppercase tracking-widest"
              >
                {formData.type === 'pharmacy' ? '+ Ajouter un Produit' : '+ Ajouter un Service'}
              </button>
            </h2>
            
            <div className="space-y-4">
              {(formData.detailedServices || []).map((service: any, index: number) => (
                <div key={index} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group">
                  <button 
                    onClick={() => {
                      const newServices = [...formData.detailedServices];
                      newServices.splice(index, 1);
                      setFormData({ ...formData, detailedServices: newServices });
                    }}
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">
                        {formData.type === 'pharmacy' ? 'Nom du médicament / Dosage' : "Nom de l'acte / service"}
                      </label>
                      <input 
                        type="text" 
                        placeholder={formData.type === 'pharmacy' ? "Ex: Efferalgan 1g" : "Ex: Échographie"}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-primary shadow-sm"
                        value={service.name}
                        onChange={(e) => {
                          const newServices = [...formData.detailedServices];
                          newServices[index].name = e.target.value;
                          setFormData({ ...formData, detailedServices: newServices });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Prix (FCFA / Optionnel)</label>
                      <input 
                        type="number" 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-primary shadow-sm"
                        value={service.price}
                        onChange={(e) => {
                          const newServices = [...formData.detailedServices];
                          newServices[index].price = parseInt(e.target.value);
                          setFormData({ ...formData, detailedServices: newServices });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Catégorie / Détails</label>
                      <select 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-primary shadow-sm"
                        value={service.category}
                        onChange={(e) => {
                          const newServices = [...formData.detailedServices];
                          newServices[index].category = e.target.value;
                          setFormData({ ...formData, detailedServices: newServices });
                        }}
                      >
                        {formData.type === 'pharmacy' ? (
                          <>
                            <option value="Pharmacie">Médicament</option>
                            <option value="Para-Pharmacie">Para-Pharmacie</option>
                            <option value="Soin">Produit de Soin</option>
                            <option value="Urgent">Vite/Urgent</option>
                          </>
                        ) : (
                          <>
                            <option value="Consultation">Consultation</option>
                            <option value="Diagnostic">Diagnostic / Imagerie</option>
                            <option value="Laboratoire">Analyse Labo</option>
                            <option value="Chirurgie">Chirurgie</option>
                            <option value="Urgence">Soins d'urgence</option>
                          </>
                        )}
                      </select>
                    </div>
                    {formData.type === 'pharmacy' && (
                      <div className="md:col-span-3">
                         <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Détails supplémentaires (Utilisation, Dosage...)</label>
                         <input 
                            type="text" 
                            placeholder="Ex: 3 fois par jour après les repas"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium outline-none focus:border-primary italic text-slate-500"
                            value={service.description}
                            onChange={(e) => {
                              const newServices = [...formData.detailedServices];
                              newServices[index].description = e.target.value;
                              setFormData({ ...formData, detailedServices: newServices });
                            }}
                         />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {(!formData.detailedServices || formData.detailedServices.length === 0) && (
                <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                  <p className="text-slate-400 font-bold text-sm">
                    {formData.type === 'pharmacy' ? "Aucun médicament enregistré." : "Aucun service détaillé enregistré."}
                    <br/> Ajoutez-en pour aider l'IA à vous recommander !
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h2 className="font-bold text-slate-800 mb-6 border-b pb-3">Horaires d'ouverture</h2>
            <div className="space-y-4">
              {DAYS.map((day) => (
                <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 w-32">
                    <input 
                      type="checkbox" 
                      checked={!formData.openingHours[day].closed} 
                      onChange={(e) => setFormData({
                        ...formData, 
                        openingHours: {
                          ...formData.openingHours,
                          [day]: { ...formData.openingHours[day], closed: !e.target.checked }
                        }
                      })}
                      className="w-4 h-4 text-primary rounded cursor-pointer" 
                    />
                    <span className={`font-bold text-sm ${formData.openingHours[day].closed ? 'text-slate-400' : 'text-slate-700'}`}>
                      {(DAY_LABELS as any)[day]}
                    </span>
                  </div>
                  
                  {!formData.openingHours[day].closed ? (
                    <div className="flex items-center gap-3">
                      <input 
                        type="time" 
                        value={formData.openingHours[day].open} 
                        onChange={(e) => setFormData({
                          ...formData,
                          openingHours: {
                            ...formData.openingHours,
                            [day]: { ...formData.openingHours[day], open: e.target.value }
                          }
                        })}
                        className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-1.5 font-bold text-slate-700 outline-none focus:border-primary" 
                      />
                      <span className="text-slate-400 font-bold">-</span>
                      <input 
                        type="time" 
                        value={formData.openingHours[day].close} 
                        onChange={(e) => setFormData({
                          ...formData,
                          openingHours: {
                            ...formData.openingHours,
                            [day]: { ...formData.openingHours[day], close: e.target.value }
                          }
                        })}
                        className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-1.5 font-bold text-slate-700 outline-none focus:border-primary" 
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-lg">Fermé</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

