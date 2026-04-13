import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Calendar, ShoppingBag, Heart, MessageSquare, Bell, LogOut, Settings, HeartPulse, Users, CheckCircle, AlertCircle, Package, FileText } from 'lucide-react';
import { Chatbot } from '../Chatbot';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  
  // Navigation links based on role
  const patientLinks = [
    { name: 'Tableau de bord', path: '/dashboard', icon: Home },
    { name: 'Mes Rendez-vous', path: '/dashboard/appointments', icon: Calendar },
    { name: 'Mes Commandes', path: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Mes Favoris', path: '/dashboard/favorites', icon: Heart },
    { name: 'Messages', path: '/dashboard/chat', icon: MessageSquare },
  ];

  const providerLinks = [
    { name: 'Aperçu', path: '/provider', icon: Home },
    { name: 'Ma Boutique', path: '/provider/boutique', icon: ShoppingBag },
    { name: 'Vérification', path: '/provider/verification', icon: FileText },
    { name: 'Planning', path: '/provider/schedule', icon: Calendar },
    { name: 'Catalogue', path: '/provider/products', icon: ShoppingBag },
    { name: 'Commandes', path: '/provider/orders', icon: Package }, 
    { name: 'Messages', path: '/provider/chat', icon: MessageSquare },
  ];

  const adminLinks = [
    { name: 'Vue Globale', path: '/admin', icon: Home },
    { name: 'Utilisateurs', path: '/admin/users', icon: Users },
    { name: 'Établissements', path: '/admin/shops', icon: ShoppingBag },
    { name: 'Validations', path: '/admin/validations', icon: CheckCircle },
    { name: 'Modération', path: '/admin/moderation', icon: AlertCircle },
    { name: 'Messages', path: '/admin/chat', icon: MessageSquare },
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'patient' ? patientLinks : providerLinks;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <HeartPulse className="h-8 w-8 text-primary mr-2" />
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Mon Espace</span>
        </div>
        
        <div className="p-4 flex-grow">
          <div className="mb-4 px-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menu principal</p>
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center px-4 py-3 text-slate-600 hover:bg-primary-light hover:text-primary rounded-xl transition-all font-medium"
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <Link 
            to={user?.role === 'admin' ? '/admin/settings' : user?.role === 'patient' ? '/dashboard/settings' : '/provider/settings'} 
            className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all font-medium"
          >
            <Settings className="h-5 w-5 mr-3" />
            Paramètres
          </Link>
          <button 
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium mt-1"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 relative z-10 shadow-sm">
          <div className="md:hidden flex items-center text-primary font-bold text-lg">
            <HeartPulse className="h-6 w-6 mr-2" />
            MED-CONNECT
          </div>
          <div className="hidden md:block flex-1" />
          <div className="flex items-center space-x-4">
            <Link 
              to={user?.role === 'admin' ? '/admin/notifications' : user?.role === 'patient' ? '/dashboard/notifications' : '/provider/notifications'} 
              className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>
            <Link 
              to={user?.role === 'admin' ? '/admin/settings' : user?.role === 'patient' ? '/dashboard/settings' : '/provider/settings'}
              className="h-10 w-10 bg-gradient-to-tr from-primary to-secondary rounded-full shadow flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity"
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Link>
          </div>
        </header>
        
        <div className="p-6 lg:p-8 flex-1 overflow-auto bg-slate-50/50">
          <Outlet />
        </div>
        <Chatbot />
      </main>
    </div>
  );
};

