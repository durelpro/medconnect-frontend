import { useState, useEffect } from 'react';
import { Plus, Tag, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const ProviderProducts = () => {
  const { user } = useAuth();
  
  const isPharmacy = user?.role === 'pharmacy';
  const typeLabel = isPharmacy ? "Produits / Médicaments" : "Types de Consultations";

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products/mine');
        setItems(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch provider products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Catalogue des {typeLabel}</h1>
        <button className="btn-primary flex items-center shadow-md">
          <Plus className="h-5 w-5 mr-2" /> Ajouter
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-bold">Nom</th>
                <th className="px-6 py-4 font-bold">Catégorie</th>
                <th className="px-6 py-4 font-bold">Tarif</th>
                <th className="px-6 py-4 font-bold">{isPharmacy ? "Stock" : "Durée"}</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map(item => (
                <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 flex items-center gap-3">
                      {item.name}
                      {item.requirePrescription && <span className="bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Sur Ordo.</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center text-slate-500 text-sm font-medium bg-slate-100 w-fit px-2.5 py-1 rounded-lg">
                      <Tag className="h-3.5 w-3.5 mr-1.5" /> {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-slate-700">{item.price} Fcfa</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">{(item as any).stock || (item as any).duration || '-'}</td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button className="p-2 text-slate-500 hover:text-primary bg-white border border-slate-200 hover:border-primary rounded-lg transition-colors shadow-sm">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 rounded-lg transition-colors shadow-sm">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="text-center py-16 text-slate-500 font-medium">
            Aucun élément dans votre catalogue de {typeLabel.toLowerCase()}.
          </div>
        )}
      </div>
    </div>
  );
};
