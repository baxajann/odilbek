import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Network, LayoutDashboard, Map, MonitorSmartphone, Activity, Settings, ScrollText, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { useRealTimeData } from '../../hooks/useRealTimeData';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { devices } = useRealTimeData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    // Закрыть сайдбар на мобильных при переходе
    if (onClose) onClose();
  };

  return (
    <aside className={clsx(
      "fixed left-0 top-0 z-40 h-screen w-64 transition-transform duration-300 glass-panel border-l-0 border-y-0 rounded-none flex flex-col",
      !isOpen && "-translate-x-full lg:translate-x-0"
    )}>
      {/* Логотип */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-700/50 shrink-0">
        <Network className="w-8 h-8 text-blue-500" />
        <div className="flex items-baseline">
          <span className="text-xl font-bold tracking-tight text-white">NetControl</span>
          <span className="ml-1 text-xs font-semibold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">Pro</span>
        </div>
      </div>

      {/* Навигация */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <NavLink
          to="/"
          end
          onClick={handleNavClick}
          className={({ isActive }) => clsx("nav-item text-sm font-medium", isActive && "active")}
        >
          <LayoutDashboard className="w-5 h-5" /> Дашборд
        </NavLink>

        <NavLink
          to="/network-map"
          onClick={handleNavClick}
          className={({ isActive }) => clsx("nav-item text-sm font-medium", isActive && "active")}
        >
          <Map className="w-5 h-5" /> Карта сети
        </NavLink>

        <NavLink
          to="/devices"
          onClick={handleNavClick}
          className={({ isActive }) => clsx("nav-item flex justify-between items-center text-sm font-medium", isActive && "active")}
        >
          <div className="flex gap-3 items-center">
            <MonitorSmartphone className="w-5 h-5" /> Устройства
          </div>
          <span className="bg-slate-700 text-xs px-2 py-0.5 rounded-full">{devices.length}</span>
        </NavLink>

        <NavLink
          to="/traffic"
          onClick={handleNavClick}
          className={({ isActive }) => clsx("nav-item text-sm font-medium", isActive && "active")}
        >
          <Activity className="w-5 h-5" /> Трафик
        </NavLink>

        <NavLink
          to="/events"
          onClick={handleNavClick}
          className={({ isActive }) => clsx("nav-item flex justify-between items-center text-sm font-medium", isActive && "active")}
        >
          <div className="flex gap-3 items-center">
            <ScrollText className="w-5 h-5" /> Журнал событий
          </div>
          <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-2 py-0.5 rounded-full">3</span>
        </NavLink>

        {/* Настройки — только для admin */}
        {user?.role === 'admin' && (
          <NavLink
            to="/settings"
            onClick={handleNavClick}
            className={({ isActive }) => clsx("nav-item text-sm font-medium", isActive && "active")}
          >
            <Settings className="w-5 h-5" /> Настройки
          </NavLink>
        )}
      </nav>

      {/* Низ сайдбара */}
      <div className="p-4 border-t border-slate-700/50 space-y-4 shrink-0">
        {/* Статус системы */}
        <div className="flex items-center gap-2 px-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          <div>
            <p className="text-xs font-semibold text-green-400">Система активна</p>
            <p className="text-[10px] text-slate-400">Скан: 2 мин назад</p>
          </div>
        </div>

        {/* Профиль пользователя */}
        <div className="flex items-center gap-3 px-2">
          <div className={clsx(
            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border shrink-0",
            user?.role === 'admin'
              ? "bg-blue-500/20 border-blue-500 text-blue-400"
              : "bg-purple-500/20 border-purple-500 text-purple-400"
          )}>
            {user?.avatar || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Пользователь'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            <span className={clsx(
              "text-[10px] font-medium px-1.5 py-0.5 rounded",
              user?.role === 'admin' ? "text-blue-400 bg-blue-500/10" : "text-purple-400 bg-purple-500/10"
            )}>
              {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            title="Выйти"
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
