import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { HeartPulse, Mail, Lock, UserIcon, Building2, Phone, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setError('');
      // Le backend requiert firstName et lastName
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || 'Prénom';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Nom';

      const res = await api.post('/auth/register', { 
        firstName, 
        lastName, 
        email, 
        phone, 
        password, 
        role 
      });
      
      const token = res.data.data.accessToken;
      const user = res.data.data.user;
      
      login(token, user);
      
      if (user.role === 'patient') navigate('/dashboard');
      else navigate('/provider');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-col items-center">
          <HeartPulse className="h-12 w-12 text-primary mb-2" />
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Rejoignez-nous
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Ou{' '}
            <Link to="/login" className="font-medium text-primary hover:underline transition-all">
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary" />
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            
            {/* Role Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-4 rounded-lg shadow-sm p-1 bg-slate-100 gap-1 mb-6" role="group">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`py-1.5 px-1 text-[13px] sm:text-sm font-semibold rounded-md transition-all ${
                  role === 'patient' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`py-1.5 px-1 text-[13px] sm:text-sm font-semibold rounded-md transition-all ${
                  role === 'doctor' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Médecin
              </button>
              <button
                type="button"
                onClick={() => setRole('pharmacy')}
                className={`py-1.5 px-1 text-[13px] sm:text-sm font-semibold rounded-md transition-all ${
                  role === 'pharmacy' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Pharmacie
              </button>
              <button
                type="button"
                onClick={() => setRole('hospital')}
                className={`py-1.5 px-1 text-[13px] sm:text-sm font-semibold rounded-md transition-all ${
                  role === 'hospital' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Hôpital
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {role === 'patient' ? 'Nom complet' : 'Nom du cabinet / Établissement'}
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {role === 'patient' ? <UserIcon className="h-5 w-5 text-slate-400" /> : <Building2 className="h-5 w-5 text-slate-400" />}
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm font-medium"
                  placeholder={role === 'patient' ? "Jean Dupont" : "Cabinet Médical / Pharmacie Centrale"}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm font-medium"
                    placeholder="contact@exemple.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Téléphone</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm font-medium"
                    placeholder="+237 6..."
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Mot de passe</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm font-medium"
                  placeholder="Minimum 6 caractères"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Création de votre espace...' : 'Confirmer l\'inscription'}
              </button>
            </div>
            
            <p className="text-xs text-center text-slate-500 mt-4">
              En vous inscrivant, vous acceptez nos Conditions Générales et notre Politique de Confidentialité.
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
