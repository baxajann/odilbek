import React, { useState } from 'react';
import { Network, Shield, Bell, Key, HardDrive, Laptop, Users, Trash2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

const SettingsDashboard: React.FC = () => {
  const { allUsers, deleteUser, updateUserRole, user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'main' | 'notifications' | 'security' | 'users' | 'about'>('main');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Настройки системы</h2>
        <p className="text-sm text-slate-400">Конфигурация параметров NetControl Pro</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Боковое меню настроек */}
        <div className="w-full lg:w-64 glass-panel p-2 flex lg:flex-col gap-1 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('main')}
            className={clsx("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full whitespace-nowrap", activeTab === 'main' ? "bg-blue-500/20 text-blue-400" : "text-slate-300 hover:bg-slate-800")}
          >
            <HardDrive className="w-5 h-5" /> Основные
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={clsx("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full whitespace-nowrap", activeTab === 'notifications' ? "bg-blue-500/20 text-blue-400" : "text-slate-300 hover:bg-slate-800")}
          >
            <Bell className="w-5 h-5" /> Уведомления
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={clsx("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full whitespace-nowrap", activeTab === 'security' ? "bg-blue-500/20 text-blue-400" : "text-slate-300 hover:bg-slate-800")}
          >
            <Shield className="w-5 h-5" /> Безопасность
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={clsx("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full whitespace-nowrap", activeTab === 'users' ? "bg-blue-500/20 text-blue-400" : "text-slate-300 hover:bg-slate-800")}
          >
            <Users className="w-5 h-5" /> Пользователи
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className={clsx("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full whitespace-nowrap", activeTab === 'about' ? "bg-blue-500/20 text-blue-400" : "text-slate-300 hover:bg-slate-800")}
          >
            <Network className="w-5 h-5" /> О системе
          </button>
        </div>

        {/* Контент настроек */}
        <div className="flex-1 w-full glass-panel p-6 min-h-[500px]">
          {saveSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg flex items-center gap-2 animate-fade-in">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Изменения успешно сохранены
            </div>
          )}

          {activeTab === 'main' && (
            <form onSubmit={handleSave} className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-4 mb-6">Основные настройки</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Название организации</label>
                  <input type="text" defaultValue="ООО NetControl" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Email администратора</label>
                  <input type="email" defaultValue="admin@company.com" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Интервал сканирования сети</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none transition-colors">
                    <option value="30">30 секунд</option>
                    <option value="60" selected>1 минута</option>
                    <option value="300">5 минут</option>
                    <option value="900">15 минут</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Язык интерфейса</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none transition-colors">
                    <option value="ru" selected>Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-6 mt-6 border-t border-slate-700/50 flex justify-end">
                <button type="submit" className="btn-primary">Сохранить изменения</button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-4 mb-6">Параметры уведомлений</h3>
              
              <div className="space-y-4">
                {[
                  { id: 'n1', label: 'Email уведомления при разрыве соединения', defaultChecked: true },
                  { id: 'n2', label: 'Уведомления при высокой нагрузке (>80%)', defaultChecked: true },
                  { id: 'n3', label: 'Уведомления о новых устройствах', defaultChecked: false },
                  { id: 'n4', label: 'Ежедневный отчет на email', defaultChecked: true },
                ].map(item => (
                  <label key={item.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 cursor-pointer hover:bg-slate-800/50 transition-colors">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <div className="relative inline-block w-10 h-6">
                      <input type="checkbox" className="peer sr-only" defaultChecked={item.defaultChecked} />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 space-y-4 mt-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-slate-300">Порог предупреждения CPU</label>
                    <span className="text-blue-400 font-medium">80%</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="80" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-slate-300">Порог загрузки сети</label>
                    <span className="text-blue-400 font-medium">85%</span>
                  </div>
                  <input type="range" min="0" max="100" defaultValue="85" className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-700/50 flex justify-end">
                <button onClick={handleSave} className="btn-primary">Сохранить изменения</button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-white border-b border-slate-700/50 pb-4 mb-6">Безопасность</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-slate-300 font-medium mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4 text-blue-400" /> Смена пароля
                  </h4>
                  <input type="password" placeholder="Текущий пароль" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none" />
                  <input type="password" placeholder="Новый пароль" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none" />
                  <input type="password" placeholder="Подтвердите пароль" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none" />
                  <button className="btn-secondary w-full mt-2">Обновить пароль</button>
                  
                  <div className="mt-8 pt-6 border-t border-slate-700/50">
                    <button className="btn-primary w-full flex justify-center items-center gap-2">
                      <Shield className="w-4 h-4" /> Включить 2FA аутентификацию
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-slate-300 font-medium mb-4 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-blue-400" /> Последние входы
                  </h4>
                  <div className="space-y-3">
                    {[
                      { ip: '192.168.1.15', date: 'Сегодня, 09:30', status: 'Успешно' },
                      { ip: '192.168.1.15', date: 'Вчера, 18:45', status: 'Успешно' },
                      { ip: '45.33.22.11', date: '12 Янв, 03:15', status: 'Ошибка' },
                      { ip: '192.168.1.20', date: '10 Янв, 14:20', status: 'Успешно' },
                    ].map((login, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 text-sm">
                        <div>
                          <p className="text-white font-mono">{login.ip}</p>
                          <p className="text-slate-500 text-xs">{login.date}</p>
                        </div>
                        <span className={clsx("px-2 py-1 rounded text-xs font-medium", login.status === 'Успешно' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')}>
                          {login.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-700/50 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-white">Управление пользователями</h3>
                <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-700">
                  Всего: {allUsers.length}
                </span>
              </div>
              
              <div className="overflow-x-auto text-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 font-medium">Пользователь</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Роль</th>
                      <th className="px-4 py-3 font-medium text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50 text-slate-300">
                    {allUsers.map((u) => {
                      const isMainAdmin = u.id === 'sys-1';
                      const isSelf = u.id === currentUser?.id;
                      
                      return (
                        <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0",
                                u.role === 'admin' ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              )}>
                                {u.avatar}
                              </div>
                              <span className="font-medium text-white">{u.name} {isSelf && <span className="text-xs text-slate-500 ml-1">(Вы)</span>}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-400">{u.email}</td>
                          <td className="px-4 py-3">
                            <select
                              value={u.role}
                              disabled={isMainAdmin || isSelf} // main admin or self cannot change own role here
                              onChange={(e) => updateUserRole(u.id, e.target.value as 'admin' | 'user')}
                              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="admin">Admin</option>
                              <option value="user">User</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  if (confirm(`Вы уверены, что хотите удалить пользователя ${u.name}?`)) {
                                    deleteUser(u.id);
                                  }
                                }}
                                disabled={isMainAdmin || isSelf}
                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-500 disabled:cursor-not-allowed"
                                title="Удалить пользователя"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="flex flex-col items-center justify-center text-center space-y-6 pt-10 animate-fade-in">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                  <Network className="w-12 h-12 text-blue-400" />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">NetControl <span className="text-blue-400">Pro</span></h3>
                <p className="text-slate-400 mt-2">v2.1.0 Educational Edition</p>
              </div>

              <div className="max-w-md text-slate-300 text-sm leading-relaxed space-y-4">
                <p>Дипломный проект по специальности "Информационные технологии".</p>
                <p>Разработка веб-приложения для мониторинга и контроля работы локальной вычислительной сети.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8 border-t border-slate-700/50 pt-8 text-sm">
                <div className="text-right text-slate-400">Стек технологий:</div>
                <div className="text-left font-medium text-white">React 18, TypeScript, TailwindCSS</div>
                
                <div className="text-right text-slate-400">Последнее обновление:</div>
                <div className="text-left font-medium text-white">15 Января 2024</div>
                
                <div className="text-right text-slate-400">Разработчик:</div>
                <div className="text-left font-medium text-white">Студент-выпускник</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsDashboard;
