import { useState, useEffect } from 'react';
import { Users, Activity, DollarSign, ShieldCheck, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../../services/api';

export const AdminOverview = () => {
  const [stats, setStats] = useState<any>(null);
  const [pendingShops, setPendingShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, shopsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/shops/pending')
        ]);
        setStats(statsRes.data.data);
        setPendingShops(shopsRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleValidate = async (id: string) => {
    try {
      await api.put(`/admin/shops/${id}/validate`, { isValidated: true });
      setPendingShops(prev => prev.filter(s => s._id !== id));
      // Refresh stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data.data);
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
    </div>
  );

  const statCards = [
    { title: "Utilisateurs totaux", value: stats?.totalUsers || 0, change: "+12%", icon: <Users className="h-6 w-6" />, color: "bg-blue-500", trend: "up" },
    { title: "Boutiques totales", value: stats?.totalShops || 0, change: "+3%", icon: <ShieldCheck className="h-6 w-6" />, color: "bg-emerald-500", trend: "up" },
    { title: "Rendez-vous", value: stats?.totalAppointments || 0, change: "+18%", icon: <Activity className="h-6 w-6" />, color: "bg-indigo-500", trend: "up" },
    { title: "Revenus totaux", value: `${(stats?.totalRevenue || 0).toLocaleString()} €`, change: "Global", icon: <DollarSign className="h-6 w-6" />, color: "bg-amber-500", trend: "up" },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Vue d'ensemble Administrateur</h1>
        <p className="text-slate-500 mt-1 font-medium">Gérez la plateforme, les utilisateurs et visualisez les statistiques globales.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl text-white shadow-sm ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`flex items-center text-sm font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                {stat.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : null}
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-wider">{stat.title}</h3>
            <div className="text-2xl font-black text-slate-800">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approvals Widget */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Inscriptions à valider</h2>
            <Link to="/admin/validations" className="text-primary text-sm font-bold hover:underline">Voir tout ({pendingShops.length})</Link>
          </div>
          
          <div className="space-y-4">
            {pendingShops.length === 0 ? (
              <div className="text-center py-10 text-slate-400 font-medium">Bravos ! Aucune inscription en attente.</div>
            ) : pendingShops.slice(0, 3).map((shop) => (
              <div key={shop._id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold uppercase overflow-hidden">
                    {shop.logo ? <img src={shop.logo} className="w-full h-full object-cover" /> : shop.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{shop.name}</h3>
                    <p className="text-xs text-slate-500 font-medium capitalize">{shop.type} • {shop.city}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleValidate(shop._id)}
                    className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-emerald-100"
                  >
                    Valider
                  </button>
                  <Link to="/admin/validations" className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm">Dossier</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-800">Alertes système</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 border border-emerald-100 bg-emerald-50/50 rounded-xl relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400"></div>
              <h3 className="font-bold text-emerald-800 text-sm mb-1">Système Opérationnel</h3>
              <p className="text-xs text-emerald-700 font-medium">Tous les services (API, DB, Chat, Chatbot) fonctionnent normalement.</p>
            </div>
            
            <div className="p-4 border border-amber-100 bg-amber-50/50 rounded-xl relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
              <h3 className="font-bold text-amber-800 text-sm mb-1">Rapport hebdo disponible</h3>
              <p className="text-xs text-amber-700 font-medium">Le résumé d'activité de la semaine dernière a été généré avec succès.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
