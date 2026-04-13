import { useState, useEffect } from 'react';
import { Heart, Star, MapPin, Loader2, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

export const PatientFavorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/users/favorites');
      setFavorites(res.data.data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (shopId: string) => {
    try {
      await api.delete(`/users/favorites/${shopId}`);
      setFavorites(prev => prev.filter(f => f._id !== shopId));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="h-7 w-7 text-red-500 fill-current" />
        <h1 className="text-2xl font-bold text-slate-800">Mes Favoris</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((fav, i) => (
          <motion.div 
            key={fav._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative group hover:shadow-md transition-shadow"
          >
            <button 
              onClick={() => toggleFavorite(fav._id)}
              className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors group-hover:scale-110"
            >
              <Heart className="h-5 w-5 fill-current" />
            </button>
            <div className="h-16 w-16 bg-primary-light rounded-full mb-4 flex items-center justify-center font-bold text-primary text-xl border-2 border-white shadow-sm overflow-hidden">
              {fav.images?.[0] ? (
                <img src={fav.images[0]} alt={fav.name} className="h-full w-full object-cover" />
              ) : (
                <Store className="h-8 w-8" />
              )}
            </div>
            <h3 className="font-bold text-slate-800 text-lg truncate pr-8">{fav.name}</h3>
            <p className="text-primary font-medium mb-3 capitalize">{fav.type === 'pharmacy' ? 'Pharmacie' : fav.type}</p>
            <div className="flex items-center text-sm text-slate-500 mb-2 font-medium">
              <MapPin className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">{fav.address}, {fav.city}</span>
            </div>
            <div className="flex items-center text-sm text-yellow-600 font-bold mb-5 bg-yellow-50 w-fit px-2 py-1 rounded-md">
              <Star className="h-4 w-4 mr-1 fill-current" />
              {fav.rating || 'N/A'}
            </div>
            <button className="w-full btn-outline py-2.5 font-bold shadow-sm">
              Voir la boutique
            </button>
          </motion.div>
        ))}
        {favorites.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
            <Heart className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium text-lg">Vous n'avez aucun favori pour le moment.</p>
            <p className="text-slate-400 text-sm mt-1">Explorez les services et cliquez sur le coeur pour les ajouter ici.</p>
          </div>
        )}
      </div>
    </div>
  );
};

