import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export const PatientAppointments = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments');
        setAppointments(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const filtered = appointments.filter(a => {
    if (activeTab === 'upcoming') {
      return ['pending', 'confirmed'].includes(a.status);
    } else {
      return ['completed', 'cancelled'].includes(a.status);
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Mes Rendez-vous</h1>
        <button className="btn-primary">Prendre un nouveau RDV</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="border-b border-slate-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`${
                activeTab === 'upcoming'
                  ? 'border-primary text-primary border-b-2'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 border-b-2'
              } whitespace-nowrap pb-4 px-1 font-medium transition-colors`}
            >
              À venir
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`${
                activeTab === 'past'
                  ? 'border-primary text-primary border-b-2'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 border-b-2'
              } whitespace-nowrap pb-4 px-1 font-medium transition-colors`}
            >
              Historique
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <p>Aucun rendez-vous {activeTab === 'upcoming' ? 'à venir' : 'passé'}.</p>
            </div>
          ) : (
            filtered.map((apt) => (
              <div key={apt.id} className="border border-slate-100 rounded-xl p-5 hover:border-primary/30 transition-colors flex flex-col md:flex-row gap-4 items-center justify-between hover:shadow-md bg-white">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="bg-primary/10 h-14 w-14 rounded-full flex shrink-0 items-center justify-center text-primary">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {apt.provider?.name || apt.provider?.firstName || 'Professionnel'}
                    </h3>
                    <p className="text-slate-500 font-medium">Spécialiste • <span className="text-slate-400">{apt.type || 'Consultation'}</span></p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right w-full sm:w-auto">
                    <div className="flex items-center justify-center sm:justify-start text-slate-700 font-bold bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      {new Date(apt.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  {activeTab === 'upcoming' ? (
                    <div className="flex gap-2 w-full sm:w-auto justify-center">
                      <button className="text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary px-4 py-2 rounded-lg transition-colors flex-1 sm:flex-none">Modifier</button>
                      <button className="text-sm font-medium bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors flex-1 sm:flex-none">Annuler</button>
                    </div>
                  ) : (
                    <div className="flex items-center w-full sm:w-auto justify-center text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg font-medium">
                       <CheckCircle className="h-4 w-4 mr-2" />
                       Terminé
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
