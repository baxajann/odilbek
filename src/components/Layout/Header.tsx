import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, RefreshCw, X, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { clsx } from 'clsx';

interface HeaderProps {
  toggleSidebar: () => void;
}

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'warning', title: 'Высокая задержка', desc: 'Устройство Switch-Core-01 показывает задержку > 50мс', time: '5 мин назад', read: false },
  { id: 2, type: 'error',   title: 'Устройство отключено', desc: 'PC-Buhgalter-3 не отвечает на ping (offline)', time: '12 мин назад', read: false },
  { id: 3, type: 'info',    title: 'Обновление системы', desc: 'Успешно установлено обновление прошивки Router-Main', time: '1 час назад', read: true },
];

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRotating, setIsRotating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Состояния для dropdown/modal
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefresh = () => {
    setIsRotating(true);
    // В реальном приложении здесь был бы запрос к API (mutate)
    setTimeout(() => setIsRotating(false), 800);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getBreadcrumb = () => {
    switch (location.pathname) {
      case '/': return 'Дашборд';
      case '/network-map': return 'Карта сети';
      case '/devices': return 'Устройства';
      case '/traffic': return 'Анализ трафика';
      case '/events': return 'Журнал событий';
      case '/settings': return 'Настройки';
      default: return 'Страница';
    }
  };

  return (
    <header className="h-20 glass-panel border-x-0 border-t-0 rounded-none flex items-center justify-between px-6 z-30 sticky top-0">
      <div className="flex items-center gap-4 lg:hidden">
        <button onClick={toggleSidebar} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <Menu className="text-slate-300 w-6 h-6" />
        </button>
      </div>

      <div className="hidden lg:flex items-center gap-2 text-slate-400 text-sm">
        <span className="hover:text-white cursor-pointer transition-colors">Главная</span>
        <span>/</span>
        <span className="text-blue-400">{getBreadcrumb()}</span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 ml-auto">
        {/* Кнопки действий */}
        <div className="flex items-center gap-2 relative">
          
          {/* 1. Поиск */}
          <div ref={searchRef} className="relative">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={clsx("p-2 rounded-full transition-colors relative group", isSearchOpen ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800")}
            >
              <Search className="w-5 h-5" />
            </button>

            {isSearchOpen && (
              <div className="absolute top-12 right-0 w-72 bg-[#1e293b] border border-slate-700/50 rounded-xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="Глобальный поиск..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:border-blue-500"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <div className="mt-2 text-center py-4 text-xs text-slate-500">
                    Нажмите Enter для поиска "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* 2. Уведомления */}
          <div ref={notifRef} className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={clsx("p-2 rounded-full transition-colors relative", isNotifOpen ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800")}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2h.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1e293b]"></span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute top-12 right-0 w-80 sm:w-96 bg-[#1e293b] border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/20">
                  <h3 className="font-semibold text-white">Уведомления</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300">
                      Прочитать все
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">Нет новых уведомлений</div>
                  ) : (
                    <div className="divide-y divide-slate-700/50">
                      {notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => {
                            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                          }}
                          className={clsx(
                            "p-4 hover:bg-slate-800/30 transition-colors cursor-pointer", 
                            !notif.read && "bg-slate-800/10"
                          )}
                        >
                          <div className="flex gap-3">
                            <div className={clsx("mt-0.5 shrink-0", 
                              notif.type === 'warning' ? "text-yellow-400" : 
                              notif.type === 'error' ? "text-red-400" : "text-blue-400"
                            )}>
                              {notif.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : 
                               notif.type === 'error' ? <X className="w-5 h-5 bg-red-500/20 rounded px-0.5" /> : 
                               <Info className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={clsx("text-sm font-medium", !notif.read ? "text-white" : "text-slate-300")}>{notif.title}</h4>
                                {!notif.read && <span className="w-2 h-2 shrink-0 rounded-full bg-blue-500 mt-1"></span>}
                              </div>
                              <p className="text-xs text-slate-400 mt-1">{notif.desc}</p>
                              <p className="text-[10px] text-slate-500 mt-2">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-slate-700/50 text-center bg-slate-800/20">
                  <button 
                    onClick={() => {
                      setIsNotifOpen(false);
                      navigate('/events');
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Смотреть всю историю
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Обновить */}
          <button 
            onClick={handleRefresh}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors relative"
            title="Обновить данные"
          >
            <RefreshCw className={clsx("w-5 h-5", isRotating && "animate-spin text-blue-400")} />
          </button>
        </div>

        {/* Время */}
        <div className="hidden sm:block text-right border-l border-slate-700 pl-6 space-y-0.5">
          <p className="text-sm font-medium text-white">{format(currentTime, 'd MMMM yyyy', { locale: ru })}</p>
          <p className="text-xs text-slate-400">{format(currentTime, 'HH:mm:ss')}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
