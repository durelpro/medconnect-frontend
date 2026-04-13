import { useState, useEffect } from 'react';
import { User, CheckCircle, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const ProviderSchedule = () => {
  const { user } = useAuth();
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments');
        setAppointments(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch provider schedule", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Mon Planning</h1>
        <div className="flex gap-2">
          <input 
            type="date" 
            className="border border-slate-200 rounded-lg px-4 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
            defaultValue={new Date().toISOString().substring(0, 10)} 
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-slate-100 gap-4">
          <h2 className="text-xl font-bold text-slate-800">Aujourd'hui</h2>
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold">{appointments.length} Rendez-vous planifiés</span>
        </div>

        <div className="space-y-4">
          {appointments.map((apt) => (
            <div key={apt._id} className="border border-slate-100 rounded-xl p-5 flex flex-col lg:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-center gap-5 w-full lg:w-auto">
                <div className="bg-slate-50 border border-slate-200 h-16 w-16 rounded-2xl flex flex-col items-center justify-center text-slate-700 shrink-0">
                  <span className="font-bold text-lg">
                    {new Date(apt.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{apt.patient?.firstName || 'Patient'}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center">
                      <User className="h-3 w-3 mr-1" /> {apt.reason || 'Consultation'}
                    </span>
                    <span className="text-sm font-medium text-primary bg-primary-light px-2 py-0.5 rounded-md">
                      {apt.type || 'Standard'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {apt.status === 'pending' ? (
                  <button className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto text-center shadow-sm">
                     Confirmer RDV
                  </button>
                ) : (
                  <div className="flex items-center justify-center sm:justify-start text-emerald-600 bg-emerald-50 px-6 py-2.5 rounded-lg text-sm font-bold w-full sm:w-auto border border-emerald-100">
                    <CheckCircle className="h-5 w-5 mr-2" /> Confirmé
                  </div>
                )}
                <button className="flex items-center justify-center text-sm font-bold text-slate-600 hover:text-primary bg-white hover:bg-slate-50 px-6 py-2.5 rounded-lg transition-colors border border-slate-200 shadow-sm w-full sm:w-auto">
                  <FileText className="h-4 w-4 mr-2" /> Dossier patient
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
