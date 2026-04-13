import { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Clock, Pill, Navigation, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';

export const PharmaciesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPharmacies = async (query = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/search?type=pharmacy&q=${encodeURIComponent(query)}`);
      setPharmacies(res.data.data?.shops || []);
    } catch (err) {
      console.error('Failed to fetch pharmacies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies('');
  }, []);

  const handleSearch = () => {
    fetchPharmacies(searchTerm);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Pill className="h-8 w-8 text-emerald-300" />
              <h1 className="text-4xl font-black tracking-tight">Trouver une Pharmacie</h1>
            </div>
            <p className="text-emerald-100 text-lg mb-8">
              Localisez rapidement la pharmacie de garde ou l'officine la plus proche de chez vous pour vos médicaments et premiers soins.
            </p>

            <div className="bg-white p-2 rounded-2xl flex items-center shadow-lg">
              <div className="flex-1 flex items-center px-4">
                <Search className="h-5 w-5 text-emerald-500 mr-3" />
                <input 
                  type="text" 
                  placeholder="Rechercher par nom, ville ou quartier..." 
                  className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 py-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button onClick={handleSearch} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                {loading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Directory Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Pharmacies à proximité</h2>
          <div className="flex gap-2">
             <button className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-bold border border-emerald-200">
               Pharmacies de Garde
             </button>
             <button className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-50">
               Ouvertes actuellement
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && pharmacies.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-500">Chargement...</div>
          ) : pharmacies.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-100">Aucune pharmacie trouvée.</div>
          ) : pharmacies.map((pharma, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={pharma._id} 
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center overflow-hidden">
                  {pharma.logo ? <img src={pharma.logo} alt={pharma.name} className="w-full h-full object-cover"/> : <Pill className="h-6 w-6" />}
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${pharma.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                    {pharma.isActive ? 'Ouvert' : 'Fermé'}
                  </span>
                  {pharma.isPremium && (
                    <span className="text-[10px] font-black uppercase text-amber-500 mt-1 tracking-wider">De Garde</span>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">{pharma.name}</h3>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm font-medium text-slate-600 truncate">
                  <MapPin className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{pharma.address}, {pharma.city}</span>
                </div>
                <div className="flex items-center text-sm font-medium text-slate-600">
                  <Clock className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0" />
                  {pharma.openingHours || '08:00 - 20:00'}
                </div>
                <div className="flex items-center text-sm font-medium text-slate-600">
                  <Phone className="h-4 w-4 mr-2 text-slate-400 flex-shrink-0" />
                  {pharma.phone || 'Non renseigné'}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center">
                   <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
                   <span className="text-sm font-bold text-slate-700">{pharma.rating?.toFixed(1) || 0}</span>
                </div>
                <Link to={`/provider/${pharma._id}`} className="text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center">
                  Voir la vitrine <Navigation className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
