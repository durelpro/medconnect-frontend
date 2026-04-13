import { useState, useEffect } from 'react';
import { Search, Shield, UserX, UserCheck, MoreVertical, Loader2, Store, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

export const AdminUsers = () => {
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const roleParam = roleFilter === 'all' ? '' : `role=${roleFilter}`;
      const searchParam = search ? `search=${encodeURIComponent(search)}` : '';
      const query = [roleParam, searchParam, `page=${pagination.page}`].filter(Boolean).join('&');
      
      const res = await api.get(`/admin/users?${query}`);
      setUsers(res.data.data.users);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, pagination.page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const toggleUserStatus = async (id: string) => {
    try {
      await api.put(`/admin/users/${id}/toggle`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
    } catch (err) {
      console.error("Failed to toggle user status:", err);
    }
  };

  const goToChat = async (recipientId: string) => {
    try {
      const res = await api.post('/chat/start', { recipientId });
      navigate('/admin/chat', { state: { initialChat: res.data.data } });
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'patient': return <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-xs font-bold tracking-wider uppercase">Patient</span>;
      case 'doctor': return <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded text-xs font-bold tracking-wider uppercase">Médecin</span>;
      case 'pharmacy': return <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded text-xs font-bold tracking-wider uppercase">Pharmacie</span>;
      case 'hospital': return <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded text-xs font-bold tracking-wider uppercase">Hôpital</span>;
      default: return <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-xs font-bold uppercase">{role}</span>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="flex items-center text-xs font-bold text-emerald-600"><div className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5"></div> Actif</span>
    ) : (
      <span className="flex items-center text-xs font-bold text-red-600"><div className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></div> Suspendu</span>
    );
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestion des Utilisateurs</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Modération des comptes patients et professionnels.</p>
        </div>
        <button className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-lg font-bold shadow-sm flex items-center transition-colors">
          <Shield className="h-4 w-4 mr-2" /> Admin Supérieur
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher par nom, email..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['all', 'patient', 'doctor', 'pharmacy', 'hospital'].map(role => (
              <button 
                key={role}
                onClick={() => { setRoleFilter(role); setPagination(prev => ({ ...prev, page: 1 })); }}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${roleFilter === role ? 'bg-primary text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {role === 'all' ? 'Tous' : role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4 font-bold">Utilisateur</th>
                  <th className="px-6 py-4 font-bold">Rôle</th>
                  <th className="px-6 py-4 font-bold">Statut</th>
                  <th className="px-6 py-4 font-bold">Inscription</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400 font-medium">Aucun utilisateur trouvé.</td>
                  </tr>
                ) : users.map(user => (
                  <tr key={user._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 shrink-0 overflow-hidden">
                          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.firstName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="font-bold text-slate-800">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-slate-500 font-medium">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.isActive)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 relative">
                      <div className="flex justify-end gap-2">
                        {user.isActive ? (
                          <button 
                            onClick={() => toggleUserStatus(user._id)}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100" 
                            title="Suspendre"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => toggleUserStatus(user._id)}
                            className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-100" 
                            title="Réactiver"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                        
                        <div className="relative">
                          <button 
                            onClick={() => setActiveDropdown(activeDropdown === user._id ? null : user._id)}
                            className="p-2 text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-700 rounded-lg transition-colors shadow-sm"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          
                          {activeDropdown === user._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                              {user.shopId && (
                                <button 
                                  onClick={() => {
                                    window.open(`/provider/${user.shopId}`, '_blank');
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center"
                                >
                                  <Store className="h-4 w-4 mr-2 text-primary" /> Voir l'Établissement
                                </button>
                              )}
                              <button 
                                onClick={() => {
                                  goToChat(user._id);
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors flex items-center"
                              >
                                <MessageSquare className="h-4 w-4 mr-2" /> Envoyer un message
                              </button>
                              <button 
                                onClick={() => {
                                  if (window.confirm("Supprimer définitivement cet utilisateur ?")) {
                                    // API call to delete
                                    console.log("Delete user", user._id);
                                  }
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center"
                              >
                                <UserX className="h-4 w-4 mr-2" /> Supprimer définit.
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-6 border-t border-slate-100 flex justify-center gap-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                className={`h-8 w-8 rounded-lg text-sm font-bold transition-all ${pagination.page === p ? 'bg-primary text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
