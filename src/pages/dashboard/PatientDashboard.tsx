import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, ShoppingBag, FileText, Bell, Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ appointments: 0, orders: 0, notifications: 0 });
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, orderRes, notifRes] = await Promise.all([
          api.get('/appointments?status=confirmed'),
          api.get('/orders?status=pending'),
          api.get('/notifications')
        ]);
        
        const unreadNotifs = notifRes.data.data.filter((n: any) => !n.read).length;

        setStats({
          appointments: apptRes.data.data.pagination.total,
          orders: orderRes.data.data.pagination.total,
          notifications: unreadNotifs
        });
        
        setUpcomingAppointments(apptRes.data.data.appointments.slice(0, 2));
      } catch (err) {
        console.error("Failed to fetch patient dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          Bonjour, {user?.firstName} 👋
        </motion.h1>
        <p className="text-slate-500 mt-2 text-lg">Voici le résumé de votre activité de santé.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
      >
        {[
          { title: "Rendez-vous à venir", value: stats.appointments, icon: Calendar, color: "text-blue-600", bg: "bg-blue-100" },
          { title: "Ordonnances actives", value: "0", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-100" },
          { title: "Commandes en cours", value: stats.orders, icon: ShoppingBag, color: "text-purple-600", bg: "bg-purple-100" },
          { title: "Nouvelles alertes", value: stats.notifications, icon: Bell, color: "text-amber-600", bg: "bg-amber-100" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition-shadow">
            <div className={`h-14 w-14 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mr-4`}>
              <stat.icon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </motion.div>
      
      {/* Quick Search Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.1 }}
        className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-primary/30"
      >
        <div className="relative z-10 w-full md:w-2/3">
          <h2 className="text-2xl font-extrabold mb-4">Besoin d'un praticien ou d'un médicament ?</h2>
          <p className="text-primary-light mb-6 font-medium">Trouvez instantanément ce qu'il vous faut près de chez vous.</p>
          <div className="flex bg-white rounded-xl p-2 w-full shadow-lg">
            <div className="flex-1 flex items-center px-4 border-r border-slate-100">
              <Search className="h-5 w-5 text-slate-400 mr-2" />
              <input type="text" placeholder="Spécialité, nom..." className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-medium" />
            </div>
            <Link to="/search" className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-bold transition-colors ml-2">
              Lancer la recherche
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 bg-white/10 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Appointment Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Prochains Rendez-vous</h2>
          <Link to="/dashboard/appointments" className="text-primary font-bold hover:underline">Voir tout</Link>
        </div>
        
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Calendar className="h-8 w-8" />
            </div>
            <p className="text-slate-500 mb-4 font-bold">Vous n'avez aucun rendez-vous prochainement.</p>
            <Link to="/search" className="inline-flex bg-primary text-white px-6 py-2 rounded-lg font-bold">Trouver un médecin</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appt) => (
              <div key={appt._id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold overflow-hidden">
                    {appt.doctor?.avatar ? <img src={appt.doctor.avatar} /> : appt.doctor?.firstName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}</h3>
                    <p className="text-sm text-slate-500 font-medium">{appt.doctor?.specialty} • {new Date(appt.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <Link to="/dashboard/chat" className="text-slate-400 hover:text-primary p-2">
                   <Bell className="h-5 w-5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
