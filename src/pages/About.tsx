import { HeartPulse, Mail, MessageSquare, Shield, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const About = () => {
  // Numéro WhatsApp fourni par l'utilisateur
  const whatsappNumber = "237657696567"; // Format international pour l'API wa.me
  const displayedNumber = "+237 6 57 69 65 67";

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
          <HeartPulse className="w-96 h-96" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
              Révolutionner l'accès aux <span className="text-primary">soins de santé</span>.
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
              MED-CONNECT est la marketplace médicale nouvelle génération qui connecte instantanément les patients avec les meilleurs hôpitaux, médecins et pharmacies. Notre mission est de simplifier et démocratiser le parcours de soin.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Valeurs / Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div className="mx-auto h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Accessible à tous</h3>
              <p className="text-slate-500 font-medium">Une plateforme unifiée qui garantit à chaque patient de trouver le soin ou le médicament adapté en quelques secondes.</p>
           </div>
           
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div className="mx-auto h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Digitalisation des flux</h3>
              <p className="text-slate-500 font-medium">De la prise de rendez-vous sécurisée à la transmission d'ordonnances en ligne, tout est instantané.</p>
           </div>
           
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div className="mx-auto h-16 w-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Données sécurisées</h3>
              <p className="text-slate-500 font-medium">Le secret médical est notre priorité absolue. Vos données et vos dossiers patients sont strictement confidentiels.</p>
           </div>
        </div>
      </div>

      {/* Contact Section avec WhatsApp */}
      <div className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-slate-800 mb-4">Besoin de plus de détails ?</h2>
            <p className="text-slate-500 text-lg mb-8 max-w-2xl mx-auto">
              Notre équipe d'assistance est disponible pour répondre à toutes vos questions, que vous soyez un patient cherchant de l'aide ou un professionnel de santé souhaitant rejoindre le réseau MED-CONNECT.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              {/* Le bouton WhatsApp demandé ! */}
              <a 
                href={`https://wa.me/${whatsappNumber}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#1ebe57] text-white px-8 py-4 rounded-xl font-bold flex items-center transition-transform hover:scale-105 shadow-lg shadow-[#25D366]/30 w-full sm:w-auto justify-center"
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                Contactez-nous sur WhatsApp
              </a>
              
              <a 
                href="mailto:donfackdurel1980@icloud.com"
                className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 px-8 py-4 rounded-xl font-bold flex items-center transition-colors w-full sm:w-auto justify-center"
              >
                <Mail className="h-5 w-5 mr-3" />
                Par Email
              </a>
            </div>
            
            <p className="mt-6 text-sm font-bold text-slate-400">
              Assistance en direct • Réponse rapide • {displayedNumber}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
