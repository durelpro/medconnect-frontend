import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import api from '../../services/api';

export const PharmacyOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch pharmacy orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
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
        <h1 className="text-2xl font-bold text-slate-800">Gestion des Commandes</h1>
        <button className="btn-primary">Nouvelle commande au comptoir</button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
          <h2 className="text-xl font-bold text-slate-800">Commandes en cours</h2>
          <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border border-amber-200">
            2 en attente de préparation
          </span>
        </div>
        
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="border border-slate-100 rounded-xl p-5 hover:shadow-md transition-all flex flex-col lg:flex-row justify-between items-center gap-6 bg-white">
              <div className="flex items-center gap-5 w-full lg:w-auto">
                <div className="bg-slate-50 border border-slate-200 h-16 w-16 rounded-2xl flex shrink-0 items-center justify-center text-slate-700">
                  <Package className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{order.patient?.firstName || 'Patient'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-500 font-medium text-sm bg-slate-100 px-2 py-0.5 rounded-md">CMD-{order._id?.slice(-6).toUpperCase()}</span>
                    {order.prescription && <span className="text-xs bg-red-50 text-red-600 px-2.5 py-0.5 rounded-md border border-red-100 font-bold uppercase tracking-wider">Ordonnance</span>}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
                <div className="text-left sm:text-right w-full sm:w-auto sm:pr-6 sm:border-r border-slate-100 pb-2 sm:pb-0">
                  <div className="font-bold text-xl text-slate-800">{order.totalPrice || 0} Fcfa</div>
                  <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 sm:pt-0 w-full lg:w-auto">
                  {order.status === 'pending' ? (
                    <button className="w-full lg:w-auto bg-amber-100 text-amber-800 hover:bg-amber-200 px-6 py-2.5 rounded-lg font-bold transition-colors shadow-sm text-center">
                      Préparer
                    </button>
                  ) : order.status === 'ready' ? (
                    <button className="w-full lg:w-auto bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-6 py-2.5 rounded-lg font-bold transition-colors shadow-sm text-center">
                      Marquer Livré
                    </button>
                  ) : (
                    <div className="w-full lg:w-auto text-center px-6 py-2.5 rounded-lg font-bold text-slate-400 bg-slate-50 border border-slate-100">
                      Terminé
                    </div>
                  )}
                  <button className="w-full lg:w-auto text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2.5 rounded-lg transition-colors shadow-sm text-center">
                    Détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
