import React, { useState, useEffect } from 'react';
import {
  X, Activity, Pencil, Save, RotateCcw,
  Router, Server, MonitorSmartphone, Laptop, Printer, Camera
} from 'lucide-react';
import { NetworkDevice } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

interface DeviceDrawerProps {
  device: NetworkDevice | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (updated: NetworkDevice) => void;
}

const TYPE_OPTIONS: Array<{ value: NetworkDevice['type']; label: string; icon: React.ElementType }> = [
  { value: 'router',  label: 'Маршрутизатор', icon: Router },
  { value: 'switch',  label: 'Коммутатор',    icon: Server },
  { value: 'pc',      label: 'ПК',             icon: MonitorSmartphone },
  { value: 'laptop',  label: 'Ноутбук',        icon: Laptop },
  { value: 'printer', label: 'Принтер',        icon: Printer },
  { value: 'camera',  label: 'IP-Камера',      icon: Camera },
  { value: 'server',  label: 'Сервер',         icon: Server },
];

const STATUS_OPTIONS: Array<{ value: NetworkDevice['status']; label: string; colorActive: string }> = [
  { value: 'online',  label: '● Онлайн',         colorActive: 'border-green-500 bg-green-500/20 text-green-400' },
  { value: 'warning', label: '● Предупреждение',  colorActive: 'border-yellow-500 bg-yellow-500/20 text-yellow-400' },
  { value: 'offline', label: '● Офлайн',          colorActive: 'border-red-500 bg-red-500/20 text-red-400' },
];

const mockChartData = [
  { time: '10:00', value: 45 }, { time: '10:05', value: 50 },
  { time: '10:10', value: 48 }, { time: '10:15', value: 65 },
  { time: '10:20', value: 80 }, { time: '10:25', value: 55 },
  { time: '10:30', value: 60 }
];

const inputCls = 'w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors';

const DeviceDrawer: React.FC<DeviceDrawerProps> = ({ device, isOpen, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<NetworkDevice | null>(null);
  const [saveAnimation, setSaveAnimation] = useState(false);

  // Синхронизируем форму когда открывается новое устройство
  useEffect(() => {
    if (device) {
      setEditForm({ ...device });
      setIsEditing(false);
    }
  }, [device]);

  if (!device && !isOpen) return null;

  const handleSave = () => {
    if (!editForm || !onUpdate) return;
    onUpdate(editForm);
    setSaveAnimation(true);
    setTimeout(() => {
      setSaveAnimation(false);
      setIsEditing(false);
    }, 800);
  };

  const handleCancel = () => {
    if (device) setEditForm({ ...device });
    setIsEditing(false);
  };

  const current = isEditing ? editForm : device;
  if (!current) return null;

  const setField = <K extends keyof NetworkDevice>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setEditForm(prev => prev ? { ...prev, [key]: e.target.value } : prev);
    };

  return (
    <>
      {/* Overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={clsx(
        "fixed right-0 top-0 h-full w-full max-w-md bg-[#1e293b] border-l border-slate-700/50 z-50 transition-transform duration-300 flex flex-col shadow-2xl",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>

        {/* Хедер */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">
              {isEditing ? 'Редактировать устройство' : 'Детали устройства'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">{current.ip}</p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              user?.role === 'admin' && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Изменить
                </button>
              )
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600/50 rounded-lg text-sm font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Отмена
                </button>
                <button
                  onClick={handleSave}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm font-medium transition-all",
                    saveAnimation
                      ? "bg-green-500/20 border-green-500/50 text-green-400"
                      : "bg-blue-500 hover:bg-blue-600 border-blue-500 text-white"
                  )}
                >
                  <Save className="w-3.5 h-3.5" />
                  {saveAnimation ? 'Сохранено ✓' : 'Сохранить'}
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto">

          {/* ── РЕЖИМ ПРОСМОТРА ───────────────────────────────────────── */}
          {!isEditing && (
            <div className="p-6 space-y-6">
              {/* Профиль */}
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-2xl font-bold text-blue-400 shrink-0">
                  {current.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{current.name}</h3>
                  <p className="text-slate-400 text-sm mt-0.5 capitalize">{current.type}</p>
                  <p className="text-slate-500 text-xs mt-1">{current.location}</p>
                </div>
              </div>

              {/* Карточка статуса */}
              <div className="bg-slate-800/40 rounded-xl border border-slate-700/40 divide-y divide-slate-700/40">
                {[
                  { label: 'Статус', value: <StatusBadge status={current.status} /> },
                  { label: 'MAC-адрес', value: <span className="font-mono text-white">{current.mac}</span> },
                  { label: 'Локация', value: <span className="text-white">{current.location}</span> },
                  {
                    label: 'Последняя активность',
                    value: <span className="text-white text-sm">{format(current.lastSeen, 'dd.MM.yyyy HH:mm:ss')}</span>
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-slate-400 font-medium">{label}</span>
                    {value}
                  </div>
                ))}
              </div>

              {/* Статистика трафика */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <h4 className="font-semibold text-white text-sm">Текущая статистика</h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/40 text-center">
                    <p className="text-xs text-slate-400 mb-1">Входящий</p>
                    <p className="text-lg font-bold text-blue-400">{current.inTraffic}</p>
                    <p className="text-xs text-slate-500">Мбит/с</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/40 text-center">
                    <p className="text-xs text-slate-400 mb-1">Исходящий</p>
                    <p className="text-lg font-bold text-green-400">{current.outTraffic}</p>
                    <p className="text-xs text-slate-500">Мбит/с</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/40 text-center">
                    <p className="text-xs text-slate-400 mb-1">Задержка</p>
                    <p className={clsx("text-lg font-bold",
                      current.latency === null ? "text-slate-500" :
                      current.latency <= 5 ? "text-green-400" :
                      current.latency <= 15 ? "text-yellow-400" : "text-red-400"
                    )}>
                      {current.latency !== null ? current.latency : '—'}
                    </p>
                    <p className="text-xs text-slate-500">мс</p>
                  </div>
                </div>
              </div>

              {/* График */}
              <div>
                <h4 className="font-semibold text-white text-sm mb-3">Активность за час</h4>
                <div className="h-[130px] bg-slate-900/40 p-2 rounded-xl border border-slate-700/40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockChartData}>
                      <defs>
                        <linearGradient id="colorDevice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorDevice)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ── РЕЖИМ РЕДАКТИРОВАНИЯ ──────────────────────────────────── */}
          {isEditing && editForm && (
            <div className="p-6 space-y-5">
              <p className="text-xs text-slate-400 bg-blue-500/5 border border-blue-500/20 rounded-lg px-3 py-2">
                ✏️ Измените нужные поля и нажмите «Сохранить»
              </p>

              {/* Название */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Название</label>
                <input
                  value={editForm.name}
                  onChange={e => setEditForm(p => p ? { ...p, name: e.target.value } : p)}
                  className={inputCls}
                />
              </div>

              {/* IP + MAC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">IP-адрес</label>
                  <input
                    value={editForm.ip}
                    onChange={e => setEditForm(p => p ? { ...p, ip: e.target.value } : p)}
                    className={clsx(inputCls, 'font-mono')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">MAC-адрес</label>
                  <input
                    value={editForm.mac}
                    onChange={e => setEditForm(p => p ? { ...p, mac: e.target.value } : p)}
                    className={clsx(inputCls, 'font-mono')}
                  />
                </div>
              </div>

              {/* Тип — карточки */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Тип устройства</label>
                <div className="grid grid-cols-4 gap-2">
                  {TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setEditForm(p => p ? { ...p, type: value } : p)}
                      className={clsx(
                        "flex flex-col items-center gap-1 p-2.5 rounded-xl border text-[11px] font-medium transition-all",
                        editForm.type === value
                          ? "border-blue-500 bg-blue-500/20 text-blue-400"
                          : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500 hover:text-white"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Статус */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Статус</label>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map(({ value, label, colorActive }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setEditForm(p => p ? { ...p, status: value } : p)}
                      className={clsx(
                        "flex-1 py-2 rounded-xl border text-xs font-semibold transition-all",
                        editForm.status === value
                          ? colorActive
                          : "border-slate-700 bg-slate-800/40 text-slate-500 hover:text-slate-300 hover:border-slate-600"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Локация + Задержка */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Расположение</label>
                  <input
                    value={editForm.location}
                    onChange={e => setEditForm(p => p ? { ...p, location: e.target.value } : p)}
                    placeholder="Офис 301"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Задержка (мс)</label>
                  <input
                    type="number" min="0"
                    value={editForm.latency ?? ''}
                    onChange={e => setEditForm(p => p ? { ...p, latency: e.target.value ? Number(e.target.value) : null } : p)}
                    placeholder="0"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DeviceDrawer;
