import { useState, useEffect } from 'react';
import { DollarSign, MessageSquare, Check, X, ShieldAlert, Loader2, Star } from 'lucide-react';
import api from '../../../services/api';

export const AdminModeration = () => {
  const [activeTab, setActiveTab] = useState<'payments' | 'reviews'>('reviews');
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reviews?page=${pagination.page}`);
      setReviews(res.data.data.reviews);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [activeTab, pagination.page]);

  const handleDeleteReview = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet avis ?")) {
      try {
        await api.delete(`/reviews/${id}`); // Assuming this exists or using admin toggle
        setReviews(prev => prev.filter(r => r._id !== id));
      } catch (err) {
        console.error("Failed to delete review:", err);
      }
    }
  };

  const pendingPayments = [
    { id: "PAY-992", provider: "Clinique des Champs", amount: "4,500.00 €", date: "25 Mar 2026", reason: "Seuil de sécurité anti-fraude dépassé (> 3000€/jour)", status: "held" },
    { id: "PAY-993", provider: "Dr. Sophie Leroux", amount: "120.00 €", date: "24 Mar 2026", reason: "Litige patient ouvert (Remboursement suite annulation non respectée)", status: "held" }
  ];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Modération & Litiges</h1>
        <p className="text-slate-500 mt-1 text-sm font-medium">Gérez les avis signalés et les retenues de paiements de la marketplace.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="border-b border-slate-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`${
                activeTab === 'reviews'
                  ? 'border-primary text-primary border-b-2'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 border-b-2'
              } whitespace-nowrap pb-4 px-1 font-extrabold transition-colors flex items-center`}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Avis Signalés {activeTab === 'reviews' && reviews.length > 0 && `(${reviews.length})`}
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`${
                activeTab === 'payments'
                  ? 'border-primary text-primary border-b-2'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 border-b-2'
              } whitespace-nowrap pb-4 px-1 font-extrabold transition-colors flex items-center`}
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Paiements Bloqués ({pendingPayments.length})
            </button>
          </nav>
        </div>

        {activeTab === 'reviews' ? (
          loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-5">
              {reviews.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-medium font-sans italic">Aucun avis signalé pour le moment.</div>
              ) : reviews.map(rev => (
                <div key={rev._id} className="border border-slate-100 rounded-xl p-5 hover:bg-slate-50 transition-colors bg-white shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
                    <div>
                      <span className="font-bold text-slate-800 text-lg mr-2">{rev.author?.firstName} {rev.author?.lastName}</span>
                      <span className="text-sm font-medium text-slate-500">Note:</span>
                      <div className="inline-flex ml-2 text-amber-500">
                         {Array.from({ length: 5 }).map((_, i) => (
                           <Star key={i} className={`h-4 w-4 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`} />
                         ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 border-l-4 border-l-slate-300 p-4 rounded-r-lg text-slate-700 text-[15px] italic mb-5 font-medium">
                    "{rev.comment}"
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100 pt-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{new Date(rev.createdAt).toLocaleDateString()} • Réf: {rev._id.substring(0, 8)}</span>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => handleDeleteReview(rev._id)}
                        className="flex-1 sm:flex-none justify-center bg-white border border-red-200 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center"
                      >
                        <X className="h-4 w-4 mr-1.5" /> Supprimer l'avis
                      </button>
                      <button className="flex-1 sm:flex-none justify-center bg-slate-900 text-white hover:bg-slate-800 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center">
                        <Check className="h-4 w-4 mr-1.5" /> Ignorer (Garder)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                      className={`h-8 w-8 rounded-lg text-sm font-bold transition-all ${pagination.page === p ? 'bg-primary text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        ) : (
          <div className="space-y-5">
            {pendingPayments.map(pay => (
              <div key={pay.id} className="border border-slate-100 rounded-xl p-5 hover:bg-slate-50 transition-colors bg-white shadow-sm">
                 <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <div className="font-bold text-slate-800 text-xl">{pay.provider}</div>
                    <div className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Programme: {pay.date} • Réf: {pay.id}</div>
                  </div>
                  <div className="text-2xl font-black text-slate-800 shrink-0">
                    {pay.amount}
                  </div>
                </div>
                
                <div className="flex bg-red-50/80 border border-red-100 p-4 rounded-xl items-start sm:items-center gap-4 mb-5">
                  <div className="bg-red-100 p-2 rounded-lg shrink-0">
                    <ShieldAlert className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="font-medium text-red-800 text-[15px]">
                    <span className="font-extrabold uppercase tracking-wide text-xs block text-red-700 mb-0.5">Motif du blocage sécurité</span>
                    {pay.reason}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-100 pt-4">
                    <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm w-full sm:w-auto text-center">
                      Examiner le litige
                    </button>
                    <button className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm w-full sm:w-auto text-center flex items-center justify-center">
                      <Check className="h-4 w-4 mr-2" /> Débloquer les fonds
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
