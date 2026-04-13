import { Link } from 'react-router-dom';
import { HeartPulse, Search, Menu } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <HeartPulse className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MED-CONNECT
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-slate-600 hover:text-primary font-medium transition-colors">Trouver un pro</Link>
            <Link to="/pharmacies" className="text-slate-600 hover:text-primary font-medium transition-colors">Pharmacies</Link>
            <Link to="/about" className="text-slate-600 hover:text-primary font-medium transition-colors">À propos</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-slate-600 hover:text-primary p-2">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/login" className="btn-outline">
              Se connecter
            </Link>
            <Link to="/register" className="btn-primary">
              S'inscrire
            </Link>
          </div>
          
          <div className="md:hidden flex items-center">
            <button className="p-2 text-slate-600">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
