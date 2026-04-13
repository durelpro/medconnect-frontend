import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Calendar, TrendingUp, AlertCircle, ShoppingCart, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export const ProviderDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ todayService: 0, newPatients: 0, revenue: 0, alerts: 0 });
  const [loading, setLoading] = useState(true);
  
  const isPharmacy = user?.role === 'pharmacy';
  const isHospital = user?.role === 'hospital';
  const prefix = isPharmacy || isHospital ? 'Dir. ' : 'Dr. ';
  const facilityName = isPharmacy ? 'pharmacie' : isHospital ? 'hôpital / centre' : 'cabinet';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, orderRes] = await Promise.all([
          api.get('/appointments'),
          api.get('/orders')
        ]);

        const appointments = apptRes.data.data.appointments;
        const orders = orderRes.data.data.orders;
        
        // Simple logic for "Today"
        const today = new Date().setHours(0,0,0,0);
        const todayAppts = appointments.filter((a: any) => new Date(a.date).setHours(0,0,0,0) === today);
        const todayOrders = orders.filter((o: any) => new Date(o.createdAt).setHours(0,0,0,0) === today);

        setStats({
          todayService: isPharmacy ? todayOrders.length : todayAppts.length,
          newPatients: 0, // Mock
          revenue: orders.reduce((acc: number, o: any) => acc + (o.grandTotal || 0), 0),
          alerts: 1
        });
      } catch (err) {
        console.error("Failed to fetch provider dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isPharmacy]);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
    </div>
  );
  
  return (
    <div className="space-y-8 pb-10">
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-3xl font-extrabold text-slate-800"
        >
          Bienvenue, {prefix}{user?.firstName || user?.name}
        </motion.h1>
        <p className="text-slate-500 mt-2 text-lg font-medium">Aperçu de l'activité de votre {facilityName}.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
      >
        {[
          { title: isPharmacy ? "Commandes totales" : "Consultations totales", value: stats.todayService, icon: isPharmacy ? ShoppingCart : Users, color: "text-blue-600", bg: "bg-blue-100" },
          { title: "Nouveaux Patients", value: stats.newPatients, icon: Users, color: "text-emerald-600", bg: "bg-emerald-100" },
          { title: "Chiffre d'Affaire", value: `${stats.revenue.toLocaleString()} €`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
          { title: "Alertes", value: stats.alerts, icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition-shadow">
            <div className={`h-14 w-14 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mr-4`}>
              <stat.icon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Schedule / Order overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mt-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {isPharmacy ? 'Dernières commandes à préparer' : isHospital ? 'Services demandés / Urgences' : 'Planning de consultations'}
          </h2>
          <Link to={isPharmacy ? "/provider/orders" : "/provider/schedule"} className="text-primary font-bold hover:underline">Voir tout le planning</Link>
        </div>
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Calendar className="h-8 w-8" />
          </div>
          <p className="text-slate-500 mb-4 font-bold italic">Aucun rendez-vous ou commande en attente pour le moment.</p>
          <Link to={isPharmacy ? "/provider/products" : "/provider/boutique"} className="btn-primary inline-flex">Gérer mon espace</Link>
        </div>
      </motion.div>
    </div>
  );
};
