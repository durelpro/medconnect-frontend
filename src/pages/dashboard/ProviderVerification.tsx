import { useState } from 'react';
import { Shield, UploadCloud, CheckCircle, AlertCircle, FileText, Image as ImageIcon, Send, Clock } from 'lucide-react';

export const ProviderVerification = () => {
  // Simulation de l'état (normalement géré par le backend: 'pending', 'reviewing', 'approved', 'rejected')
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'reviewing' | 'approved' | 'rejected'>('pending');

  const handleUploadSubmit = () => {
    // Simulation de l'envoi
    setVerificationStatus('reviewing');
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center">
          <Shield className="h-7 w-7 mr-3 text-primary" /> 
          Vérification d'Identité & Compétences
        </h1>
        <p className="text-slate-500 mt-1.5 text-[15px] font-medium">Conformément à la réglementation médicale, vos documents doivent être validés par notre administration avant que votre boutique ne soit rendue publique.</p>
      </div>

      {verificationStatus === 'reviewing' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="h-16 w-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
            <Clock className="h-8 w-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-amber-800 mb-2">Dossier en cours d'analyse</h2>
            <p className="text-amber-700 font-medium">Vos documents ont bien été transmis à l'administrateur MED-CONNECT. Le processus de validation prend généralement entre 24h et 48h. Vous serez notifié du résultat par email.</p>
          </div>
          <div className="opacity-50">
            <Shield className="h-20 w-20 text-amber-200" />
          </div>
        </div>
      )}

      {verificationStatus === 'approved' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-6 shadow-sm">
          <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-emerald-800 mb-2">Félicitations, votre compte est certifié !</h2>
            <p className="text-emerald-700 font-medium">Votre diplôme et votre identité ont été vérifiés par l'administration. Votre boutique est désormais officiellement visible par les patients de MED-CONNECT.</p>
          </div>
        </div>
      )}

      {verificationStatus === 'pending' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <div className="flex items-start gap-4 mb-8 bg-blue-50/50 p-4 rounded-xl border border-blue-100 hidden md:flex">
            <AlertCircle className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-blue-800">
              Même si vous configurez votre <span className="font-bold">Boutique</span>, elle n'apparaîtra pas dans les résultats de recherche des patients tant que l'administration n'aura pas validé les documents ci-dessous.
            </p>
          </div>

          <div className="space-y-8">
            {/* Pièce d'identité */}
            <div className="border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden transition-colors hover:border-slate-300">
              <div className="bg-slate-50 p-4 rounded-xl shrink-0 flex items-center justify-center h-20 w-20 md:h-auto md:w-24">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-2">1. Pièce d'identité officielle</h3>
                <p className="text-sm text-slate-500 font-medium mb-4">Une copie claire de votre Carte Nationale d'Identité (recto/verso) ou de votre Passeport en cours de validité.</p>
                <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary hover:border-primary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center transition-all shadow-sm">
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Importer l'ID (.pdf, .jpg)
                </button>
              </div>
            </div>

            {/* Certificat de compétences */}
            <div className="border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden transition-colors hover:border-slate-300">
              <div className="bg-slate-50 p-4 rounded-xl shrink-0 flex items-center justify-center h-20 w-20 md:h-auto md:w-24">
                <Shield className="h-8 w-8 text-slate-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-2">2. Preuve d'exercice (Diplôme / Agrément)</h3>
                <p className="text-sm text-slate-500 font-medium mb-4">Votre diplôme de Médecin, votre licence d'ouverture de Pharmacie ou l'agrément ministériel de votre Hôpital/Clinique.</p>
                <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary hover:border-primary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center transition-all shadow-sm">
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Importer le Diplôme (.pdf)
                </button>
              </div>
            </div>

            {/* Photo d'identité */}
            <div className="border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden transition-colors hover:border-slate-300">
              <div className="bg-slate-50 p-4 rounded-xl shrink-0 flex items-center justify-center h-20 w-20 md:h-auto md:w-24">
                <ImageIcon className="h-8 w-8 text-slate-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-2">3. Photo d'identité récente</h3>
                <p className="text-sm text-slate-500 font-medium mb-4">Une photo d'identité claire (format portrait) pour votre dossier professionnel interne.</p>
                <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary hover:border-primary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center transition-all shadow-sm">
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Importer la Photo (.jpg)
                </button>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={handleUploadSubmit}
                className="bg-primary text-white hover:bg-primary-dark px-8 py-3.5 rounded-xl font-bold flex items-center transition-all shadow-lg shadow-primary/30"
              >
                <Send className="h-5 w-5 mr-2" />
                Soumettre le dossier à l'Administrateur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
