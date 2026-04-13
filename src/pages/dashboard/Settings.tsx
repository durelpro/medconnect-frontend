import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, Bell, Mail, Phone, Shield, Save, Loader2, CheckCircle, X, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';

export const Settings = () => {
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: (user as any)?.bio || '',
    expertises: (user as any)?.expertises || [],
    consultationFee: (user as any)?.consultationFee || 0,
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);

  // Sync form data quando user context is refreshed
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: (user as any).bio || '',
        expertises: (user as any).expertises || [],
        consultationFee: (user as any).consultationFee || 0,
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await api.put('/users/profile', formData);
      await checkAuth(); // Refresh user context
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la mise à jour.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await api.put('/users/update-password', {
        currentPassword: passwordState.currentPassword,
        newPassword: passwordState.newPassword,
      });
      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès.' });
      setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors du changement de mot de passe.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
          <Shield className="h-7 w-7 mr-3 text-primary" /> 
          Paramètres du compte
        </h1>
        <p className="text-slate-500 mt-1 font-medium">Gérez vos informations personnelles et votre sécurité.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
          <span className="font-bold text-sm">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" /> Informations personnelles
            </h2>
          </div>
          <form onSubmit={handleUpdateProfile} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Prénom</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nom</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <input 
                    type="email" 
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-500 font-medium cursor-not-allowed"
                    value={formData.email}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <input 
                    type="tel" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Bio / Description (Professionnels)</label>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium resize-none"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Présentez-vous brièvement..."
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-2.5 rounded-xl shadow-lg shadow-primary/20 flex items-center transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                Enregistrer le profil
              </button>
            </div>
          </form>
        </section>

        {/* Professional Medical Section (Doctors Only) */}
        {user?.role === 'doctor' && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 flex items-center">
                 🧬 Expertise Médicale & Tarifs
              </h2>
              <button 
                type="button"
                onClick={() => setFormData({
                  ...formData, 
                  expertises: [...formData.expertises, { name: '', description: '', isMain: false }]
                })}
                className="text-[10px] font-black bg-emerald-500 text-white px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 transition-transform uppercase tracking-widest"
              >
                + Ajouter une expertise
              </button>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-50">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Prix Consultation (FCFA)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-primary"
                      value={formData.consultationFee}
                      onChange={(e) => setFormData({...formData, consultationFee: parseInt(e.target.value) || 0})}
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="block text-xs font-bold text-slate-400 uppercase">Mes Actes & Spécialités précises</label>
                 {formData.expertises.length === 0 ? (
                   <p className="text-xs italic text-slate-400">Aucune expertise spécifique ajoutée. L'IA utilisera votre bio générale.</p>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formData.expertises.map((exp: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 relative group">
                           <input 
                            type="text" 
                            placeholder="Ex: Chirurgie Lasik"
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-bold outline-none focus:border-primary"
                            value={exp.name}
                            onChange={(e) => {
                              const newExp = [...formData.expertises];
                              newExp[idx].name = e.target.value;
                              setFormData({...formData, expertises: newExp});
                            }}
                           />
                           <button 
                            type="button"
                            onClick={() => {
                              const newExp = [...formData.expertises];
                              newExp.splice(idx, 1);
                              setFormData({...formData, expertises: newExp});
                            }}
                            className="p-1.5 text-slate-300 hover:text-red-500 bg-white rounded-lg border border-slate-100 shadow-sm transition-colors"
                           >
                              <X className="h-4 w-4" />
                           </button>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
            </div>
          </section>
        )}

        {/* Security Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center">
            <h2 className="font-bold text-slate-800 flex items-center text-red-600">
              <Lock className="h-5 w-5 mr-2" /> Sécurité du compte
            </h2>
          </div>
          <form onSubmit={handleUpdatePassword} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
               <div className="md:col-span-2">
                  <p className="text-sm text-slate-500 font-medium mb-4">Pour changer votre mot de passe, veuillez remplir les champs ci-dessous.</p>
               </div>
               
               <div className="md:col-span-2 relative">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mot de passe actuel</label>
                <div className="relative">
                  <input 
                    type={showPasswords ? 'text' : 'password'}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium pr-12"
                    value={passwordState.currentPassword}
                    onChange={(e) => setPasswordState({...passwordState, currentPassword: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPasswords ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

               <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nouveau mot de passe</label>
                <input 
                  type={showPasswords ? 'text' : 'password'}
                  required
                  minLength={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                  value={passwordState.newPassword}
                  onChange={(e) => setPasswordState({...passwordState, newPassword: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Confirmer le mot de passe</label>
                <input 
                  type={showPasswords ? 'text' : 'password'}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                  value={passwordState.confirmPassword}
                  onChange={(e) => setPasswordState({...passwordState, confirmPassword: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-8 py-2.5 rounded-xl shadow-lg shadow-slate-200 flex items-center transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Lock className="h-5 w-5 mr-2" />}
                Mettre à jour la sécurité
              </button>
            </div>
          </form>
        </section>

        {/* Notifications Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30">
            <h2 className="font-bold text-slate-800 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-amber-500" /> Préférences de notifications
            </h2>
          </div>
          <div className="p-6 md:p-8 space-y-4">
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                   <div className="font-bold text-slate-700">Notifications Email</div>
                   <div className="text-xs text-slate-500 font-medium">Recevez des mises à jour sur vos rendez-vous par email.</div>
                </div>
                <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                   <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                </div>
             </div>
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                   <div className="font-bold text-slate-700">Notifications Push Browser</div>
                   <div className="text-xs text-slate-500 font-medium">Alertes instantanées sur votre navigateur.</div>
                </div>
                <div className="h-6 w-11 bg-slate-200 rounded-full relative cursor-pointer">
                   <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                </div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};
