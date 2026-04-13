import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Search } from './pages/Search';
import { ProviderDetail } from './pages/ProviderDetail';
import { PharmaciesList } from './pages/PharmaciesList';
import { About } from './pages/About';
import { PatientDashboard } from './pages/dashboard/PatientDashboard';
import { ProviderDashboard } from './pages/dashboard/ProviderDashboard';
import { ProviderBoutique } from './pages/dashboard/ProviderBoutique';
import { ProviderVerification } from './pages/dashboard/ProviderVerification';
import { PatientAppointments } from './pages/dashboard/PatientAppointments';
import { ProviderSchedule } from './pages/dashboard/ProviderSchedule';
import { Chat } from './pages/dashboard/Chat';
import { PatientOrders } from './pages/dashboard/PatientOrders';
import { PharmacyOrders } from './pages/dashboard/PharmacyOrders';
import { PatientFavorites } from './pages/dashboard/PatientFavorites';
import { PatientNotifications as Notifications } from './pages/dashboard/PatientNotifications';
import { ProviderProducts } from './pages/dashboard/ProviderProducts';
import { AdminOverview } from './pages/dashboard/admin/AdminOverview';
import { AdminUsers } from './pages/dashboard/admin/AdminUsers';
import { AdminValidations } from './pages/dashboard/admin/AdminValidations';
import { AdminShops } from './pages/dashboard/admin/AdminShops';
import { AdminModeration } from './pages/dashboard/admin/AdminModeration';
import { Settings } from './pages/dashboard/Settings';
import { Chatbot } from './components/Chatbot';

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col font-sans">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Chatbot />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/provider/:id" element={<ProviderDetail />} />
            <Route path="/pharmacies" element={<PharmaciesList />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          {/* Patient Authenticated Routes */}
          <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<PatientDashboard />} />
              <Route path="/dashboard/appointments" element={<PatientAppointments />} />
              <Route path="/dashboard/chat" element={<Chat />} />
              <Route path="/dashboard/orders" element={<PatientOrders />} />
              <Route path="/dashboard/favorites" element={<PatientFavorites />} />
              <Route path="/dashboard/notifications" element={<Notifications />} />
              <Route path="/dashboard/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Provider Authenticated Routes */}
          <Route element={<ProtectedRoute allowedRoles={['doctor', 'pharmacy', 'hospital']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/provider" element={<ProviderDashboard />} />
              <Route path="/provider/verification" element={<ProviderVerification />} />
              <Route path="/provider/boutique" element={<ProviderBoutique />} />
              <Route path="/provider/schedule" element={<ProviderSchedule />} />
              <Route path="/provider/chat" element={<Chat />} />
              <Route path="/provider/orders" element={<PharmacyOrders />} />
              <Route path="/provider/products" element={<ProviderProducts />} />
              <Route path="/provider/notifications" element={<Notifications />} />
              <Route path="/provider/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Admin Authenticated Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/validations" element={<AdminValidations />} />
              <Route path="/admin/shops" element={<AdminShops />} />
              <Route path="/admin/chat" element={<Chat />} />
              <Route path="/admin/moderation" element={<AdminModeration />} />
              <Route path="/admin/notifications" element={<Notifications />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
