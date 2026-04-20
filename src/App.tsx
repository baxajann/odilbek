import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import LoginPage from './components/Auth/LoginPage';
import Dashboard from './components/Dashboard/Dashboard';
import NetworkTopology from './components/NetworkMap/NetworkTopology';
import DeviceTable from './components/Devices/DeviceTable';
import TrafficDashboard from './components/Traffic/TrafficChart';
import EventsDashboard from './components/Events/EventsDashboard';
import SettingsDashboard from './components/Settings/SettingsDashboard';
import { Network } from 'lucide-react';

// ── 404 ─────────────────────────────────────────────────────────────────────
const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="text-9xl font-bold text-slate-800">404</div>
    <h2 className="text-2xl font-bold text-white mt-4">Страница не найдена</h2>
    <p className="text-slate-400 mt-2">Возможно, она была удалена или перемещена</p>
    <a href="/" className="btn-primary mt-6 inline-block">Вернуться на главную</a>
  </div>
);

// ── Splash Screen ────────────────────────────────────────────────────────────
const SplashScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a]">
    <div className="relative mb-8">
      <Network className="w-24 h-24 text-blue-500 animate-pulse relative z-10" />
      <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
    </div>
    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
      NetControl <span className="text-blue-500">Pro</span>
    </h1>
    <p className="text-slate-400 font-medium mb-8">Инициализация системы мониторинга...</p>
    <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
        style={{ animation: 'progress 1.5s ease-in-out forwards' }}
      ></div>
    </div>
    <style>{`
      @keyframes progress {
        0% { width: 0%; }
        100% { width: 100%; }
      }
    `}</style>
  </div>
);

// ── Защищённый маршрут ───────────────────────────────────────────────────────
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// ── Маршрут только для admin ─────────────────────────────────────────────────
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

// ── Главный роутер ───────────────────────────────────────────────────────────
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Логин */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />

      {/* Защищённые страницы */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="network-map" element={<NetworkTopology />} />
        <Route path="devices" element={<DeviceTable />} />
        <Route path="traffic" element={<TrafficDashboard />} />
        <Route path="events" element={<EventsDashboard />} />

        {/* Настройки — только для admin */}
        <Route path="settings" element={<AdminRoute><SettingsDashboard /></AdminRoute>} />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Редирект на логин */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// ── Корневой компонент ───────────────────────────────────────────────────────
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
