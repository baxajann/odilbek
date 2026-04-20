import React, { useState } from 'react';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, TerminalSquare, ChevronDown } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { NetworkDevice } from '../../types';
import PingModal from './PingModal';
import DeviceDrawer from './DeviceDrawer';
import AddDeviceModal from './AddDeviceModal';
import { clsx } from 'clsx';

const typeLabels: Record<string, string> = {
  router:  'Маршрутизатор',
  switch:  'Коммутатор',
  pc:      'ПК',
  laptop:  'Ноутбук',
  printer: 'Принтер',
  camera:  'IP-Камера',
  server:  'Сервер',
};

const DeviceTable: React.FC = () => {
  const { user } = useAuth();
  const { devices, addDevice, updateDevice } = useRealTimeData();

  const [searchTerm,   setSearchTerm]   = useState('');
  const [typeFilter,   setTypeFilter]   = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [pingDevice,   setPingDevice]   = useState<NetworkDevice | null>(null);
  const [drawerDevice, setDrawerDevice] = useState<NetworkDevice | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddOpen,    setIsAddOpen]    = useState(false);

  const handleOpenDrawer = (device: NetworkDevice) => {
    setDrawerDevice(device);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setDrawerDevice(null), 300);
  };

  // При обновлении устройства в drawer — обновляем глобальный стек
  const handleUpdate = (updated: NetworkDevice) => {
    updateDevice(updated);
    // Обновляем ссылку на текущий drawer
    setDrawerDevice(updated);
  };

  const filteredDevices = devices.filter(d => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      d.name.toLowerCase().includes(q) ||
      d.ip.includes(q) ||
      d.mac.toLowerCase().includes(q);
    const matchType   = typeFilter   === 'all' || d.type   === typeFilter;
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const selectCls = "w-full appearance-none bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-4 py-2.5 pr-8 focus:outline-none focus:border-blue-500 cursor-pointer";

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Устройства в сети</h2>
          <p className="text-sm text-slate-400">Управление и мониторинг подключенного оборудования</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="btn-primary flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> Добавить устройство
          </button>
        )}
      </div>

      {/* Фильтры */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по имени, IP, MAC..."
            className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-48">
            <select className={selectCls} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">Все типы</option>
              <option value="router">Маршрутизаторы</option>
              <option value="switch">Коммутаторы</option>
              <option value="pc">ПК</option>
              <option value="laptop">Ноутбуки</option>
              <option value="server">Серверы</option>
              <option value="printer">Принтеры</option>
              <option value="camera">Камеры</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative flex-1 md:w-48">
            <select className={selectCls} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">Все статусы</option>
              <option value="online">Онлайн</option>
              <option value="warning">Предупреждение</option>
              <option value="offline">Офлайн</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Счётчик */}
      <p className="text-sm text-slate-400 -mt-2">
        Найдено: <span className="text-white font-medium">{filteredDevices.length}</span> из {devices.length} устройств
      </p>

      {/* Таблица */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 font-medium">Устройство</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">IP-адрес</th>
                <th className="px-6 py-4 font-medium hidden lg:table-cell">MAC-адрес</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Тип</th>
                <th className="px-6 py-4 font-medium">Статус</th>
                <th className="px-6 py-4 font-medium hidden xl:table-cell">Трафик ↓/↑</th>
                <th className="px-6 py-4 font-medium hidden xl:table-cell">Задержка</th>
                <th className="px-6 py-4 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-300">
              {filteredDevices.map(device => (
                <tr
                  key={device.id}
                  className={clsx(
                    "hover:bg-slate-800/30 transition-colors",
                    device.status === 'offline' && "opacity-65"
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{device.name}</div>
                    <div className="text-xs text-slate-500 md:hidden mt-0.5">{device.ip}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-400 hidden md:table-cell">{device.ip}</td>
                  <td className="px-6 py-4 font-mono text-slate-500 text-xs hidden lg:table-cell">{device.mac}</td>
                  <td className="px-6 py-4 text-slate-400 hidden sm:table-cell">
                    {typeLabels[device.type] ?? device.type}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={device.status} />
                  </td>
                  <td className="px-6 py-4 hidden xl:table-cell">
                    <span className="text-blue-400">{device.inTraffic}</span>
                    {' / '}
                    <span className="text-green-400">{device.outTraffic}</span>
                    <span className="text-slate-500 text-xs ml-1">Мбит/с</span>
                  </td>
                  <td className="px-6 py-4 hidden xl:table-cell">
                    {device.latency !== null ? (
                      <span className={clsx(
                        "font-medium",
                        device.latency <= 5  ? "text-green-400" :
                        device.latency <= 15 ? "text-yellow-400" : "text-red-400"
                      )}>
                        {device.latency} мс
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPingDevice(device)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-medium transition-colors"
                        title="Проверить связь"
                      >
                        <TerminalSquare className="w-3.5 h-3.5" /> Пинг
                      </button>
                      <button
                        onClick={() => handleOpenDrawer(device)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/50 rounded-lg text-xs font-medium transition-colors"
                        title="Подробная информация и редактирование"
                      >
                        Подробнее
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDevices.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center">
                    <div className="text-3xl mb-2">🔍</div>
                    <p className="text-slate-500 font-medium">Устройства не найдены</p>
                    <p className="text-slate-600 text-xs mt-1">Попробуйте изменить фильтры поиска</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модалки */}
      <PingModal device={pingDevice} onClose={() => setPingDevice(null)} />

      <DeviceDrawer
        device={drawerDevice}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onUpdate={handleUpdate}
      />

      <AddDeviceModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={addDevice}
      />
    </div>
  );
};

export default DeviceTable;
