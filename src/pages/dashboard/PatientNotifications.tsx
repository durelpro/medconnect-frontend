import { useState, useEffect } from 'react';
import { Bell, Calendar, Package, MessageSquare, Loader2, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export const PatientNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const markRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  const getIcon = (type: string) => {
    if (type.includes('appointment')) return <Calendar className="h-5 w-5 text-blue-600" />;
    if (type.includes('order')) return <Package className="h-5 w-5 text-emerald-600" />;
    return <MessageSquare className="h-5 w-5 text-primary" />;
  };

  const getBg = (type: string) => {
    if (type.includes('appointment')) return "bg-blue-100";
    if (type.includes('order')) return "bg-emerald-100";
    return "bg-primary-light";
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl pb-10">
      <div className="flex justify-between items-center text-wrap gap-4">
        <div className="flex items-center gap-3">
          <Bell className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
        </div>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllRead}
            className="text-sm font-bold text-primary hover:underline bg-primary/5 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">Vous n'avez aucune notification.</div>
        ) : (
          notifications.map((notif, i) => (
            <div 
              key={notif._id} 
              onClick={() => !notif.read && markRead(notif._id)}
              className={`p-5 flex gap-4 ${notif.read ? 'bg-white' : 'bg-slate-50 border-l-4 border-l-primary'} ${i !== notifications.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50/80 transition-colors cursor-pointer relative`}
            >
              <div className={`h-12 w-12 rounded-2xl flex shrink-0 items-center justify-center ${getBg(notif.type)} shadow-sm`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h3 className={`text-[15px] font-bold ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>{notif.title}</h3>
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-sm">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${notif.read ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>{notif.message}</p>
              </div>
              {!notif.read && (
                <div className="flex items-center justify-center pl-2">
                  <div className="h-2.5 w-2.5 bg-primary rounded-full shadow-sm shadow-primary/50"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

