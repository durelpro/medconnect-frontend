import { Search, MapPin, Activity, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8"
            >
              Votre santé, <span className="text-primary">connectée</span> et simplifiée.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Trouvez rapidement un médecin, réservez une consultation ou commandez vos médicaments dans la pharmacie la plus proche de chez vous.
            </motion.p>
            
            {/* Search Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-3xl mx-auto flex flex-col md:flex-row gap-4"
            >
              <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                <Search className="h-5 w-5 text-slate-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Spécialité, nom du médecin, médicament..."
                  className="bg-transparent border-none outline-none w-full text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                <MapPin className="h-5 w-5 text-slate-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Où cherchez-vous ?"
                  className="bg-transparent border-none outline-none w-full text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <button className="btn-primary py-3 px-8 text-lg w-full md:w-auto font-semibold">
                Rechercher
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card p-8 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="h-16 w-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Prise de rendez-vous</h3>
              <p className="text-slate-600">Prenez rendez-vous avec le praticien de votre choix en quelques clics, 24h/24 et 7j/7.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card p-8 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="h-16 w-16 bg-secondary-light rounded-2xl flex items-center justify-center mx-auto mb-6 text-secondary">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Pharmacie en ligne</h3>
              <p className="text-slate-600">Commandez vos médicaments dans la pharmacie la plus proche via notre plateforme sécurisée.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card p-8 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Dossier médical sécurisé</h3>
              <p className="text-slate-600">Vos données de santé sont cryptées et accessibles uniquement par vous et vos professionnels de santé.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
