import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Star, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (searchQuery: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
      setResults(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch search results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(initialQuery);
  }, [initialQuery]);

  const handleSearch = () => {
    setSearchParams({ q: query });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-8 flex flex-col md:flex-row gap-4 z-10 relative">
          <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
            <SearchIcon className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
            <input 
              type="text" 
              placeholder="Spécialité, nom du médecin, médicament..."
              className="bg-transparent border-none outline-none w-full text-slate-700 placeholder:text-slate-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex-1 flex items-center bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
            <MapPin className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
            <input 
              type="text" 
              placeholder="Où cherchez-vous ?"
              className="bg-transparent border-none outline-none w-full text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <button onClick={handleSearch} className="btn-primary py-3 px-8 text-lg w-full md:w-auto font-semibold hover:shadow-lg transition-all">
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <div className="flex items-center mb-6">
                <Filter className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-bold text-slate-800">Filtres</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm text-slate-800 mb-3 uppercase tracking-wider">Disponibilité</h4>
                  <div className="space-y-3">
                    <label className="flex items-center text-sm text-slate-600 cursor-pointer group"><input type="checkbox" className="mr-3 rounded text-primary focus:ring-primary cursor-pointer" /><span className="group-hover:text-primary transition-colors">Aujourd'hui</span></label>
                    <label className="flex items-center text-sm text-slate-600 cursor-pointer group"><input type="checkbox" className="mr-3 rounded text-primary focus:ring-primary cursor-pointer" /><span className="group-hover:text-primary transition-colors">Dans les 3 jours</span></label>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-semibold text-sm text-slate-800 mb-3 uppercase tracking-wider">Établissement</h4>
                  <div className="space-y-3">
                    <label className="flex items-center text-sm text-slate-600 cursor-pointer group"><input type="checkbox" className="mr-3 rounded text-primary focus:ring-primary cursor-pointer" /><span className="group-hover:text-primary transition-colors">Cabinet médical</span></label>
                    <label className="flex items-center text-sm text-slate-600 cursor-pointer group"><input type="checkbox" className="mr-3 rounded text-primary focus:ring-primary cursor-pointer" /><span className="group-hover:text-primary transition-colors">Hôpital / Clinique</span></label>
                    <label className="flex items-center text-sm text-slate-600 cursor-pointer group"><input type="checkbox" className="mr-3 rounded text-primary focus:ring-primary cursor-pointer" /><span className="group-hover:text-primary transition-colors">Pharmacie</span></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results List */}
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-4">{results.length} praticiens ou établissements trouvés</h2>
            
            {results.length === 0 && !loading && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center text-slate-500 font-medium">
                Aucun résultat ne correspond à votre recherche.
              </div>
            )}
            
            {results.map((result, i) => (
              <motion.div 
                key={result._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 cursor-pointer"
              >
                {/* Avatar / Picture */}
                <div className="h-24 w-24 bg-slate-100 rounded-full sm:rounded-xl flex-shrink-0 flex items-center justify-center text-2xl font-bold text-slate-300 overflow-hidden">
                  {result.logo ? (
                    <img src={result.logo} alt={result.name} className="w-full h-full object-cover" />
                  ) : (
                    result.name.charAt(0)
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 max-w-full">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 hover:text-primary transition-colors"><Link to={`/provider/${result._id}`}>{result.name}</Link></h3>
                      <p className="text-primary font-medium mt-1 capitalize">{result.type === 'doctor' ? 'Médecin' : result.type === 'pharmacy' ? 'Pharmacie' : 'Hôpital / Clinique'}</p>
                    </div>
                    {(result.rating > 0) && (
                      <div className="flex items-center bg-yellow-50 px-2.5 py-1.5 rounded-lg border border-yellow-100">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1.5" />
                        <span className="font-bold text-sm text-yellow-700">{result.rating.toFixed(1)} <span className="text-yellow-600/60 font-medium">({result.reviewCount || 0} avis)</span></span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex flex-col sm:flex-row gap-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-slate-400 shrink-0" />
                      {result.address}, {result.city}
                    </div>
                    {/* Could optionally show available date here if mapped */}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 justify-center sm:min-w-[140px] mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-6">
                  <Link to={`/provider/${result._id}`} className="btn-primary w-full text-center">
                    Voir profil
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
