import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export const PatientOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Mes Commandes Pharmacie</h1>
        <button className="btn-primary">Nouvelle commande avec ordonnance</button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border border-slate-100 rounded-xl p-5 hover:shadow-md transition-all flex flex-col lg:flex-row justify-between items-center gap-6 bg-white">
              <div className="flex items-center gap-5 w-full lg:w-auto">
                <div className="bg-primary/10 h-16 w-16 rounded-full flex shrink-0 items-center justify-center text-primary">
                  <Package className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{order.pharmacy?.firstName || 'Pharmacie'}</h3>
                  <p className="text-slate-500 font-medium">Commande #{order._id?.slice(-6).toUpperCase()} • <span className="text-slate-400">{order.items?.length || 0} article(s)</span></p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
                <div className="text-left sm:text-right w-full sm:w-auto sm:pr-4 border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0">
                  <div className="font-bold text-xl text-slate-800">{order.totalPrice || 0} Fcfa</div>
                  <div className="text-sm text-slate-500 font-medium mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  {order.status === 'processing' ? (
                    <div className="flex items-center justify-center w-full sm:w-auto bg-amber-50 text-amber-600 px-5 py-2.5 rounded-lg font-bold border border-amber-100">
                      <Clock className="h-5 w-5 mr-2" /> En préparation
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full sm:w-auto bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-lg font-bold border border-emerald-100">
                      <CheckCircle className="h-5 w-5 mr-2" /> Livrée
                    </div>
                  )}
                  
                  <button className="font-bold bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary px-5 py-2.5 rounded-lg transition-colors w-full sm:w-auto shadow-sm">
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
