import React, { useState } from 'react';
import { X, Plus, Router, Server, MonitorSmartphone, Laptop, Printer, Camera } from 'lucide-react';
import { NetworkDevice } from '../../types';
import { clsx } from 'clsx';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (device: NetworkDevice) => void;
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

const STATUS_OPTIONS: Array<{ value: NetworkDevice['status']; label: string; color: string }> = [
  { value: 'online',  label: 'Онлайн',         color: 'text-green-400  bg-green-500/10  border-green-500/40' },
  { value: 'offline', label: 'Офлайн',         color: 'text-red-400    bg-red-500/10    border-red-500/40' },
  { value: 'warning', label: 'Предупреждение', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/40' },
];

const inputCls = 'w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600';

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, onClose, onAdd }) => {
  const empty = {
    name: '', ip: '', mac: '', type: 'pc' as NetworkDevice['type'],
    status: 'online' as NetworkDevice['status'],
    location: '', latency: '',
  };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const set = (key: keyof typeof form) => (
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())       e.name    = 'Введите название устройства';
    if (!form.ip.trim())         e.ip      = 'Введите IP-адрес';
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(form.ip.trim())) e.ip = 'Неверный формат IP';
    if (!form.mac.trim())        e.mac     = 'Введите MAC-адрес';
    if (!form.location.trim())   e.location = 'Введите расположение';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const newDevice: NetworkDevice = {
      id: `custom-${Date.now()}`,
      name: form.name.trim(),
      ip: form.ip.trim(),
      mac: form.mac.trim(),
      type: form.type,
      status: form.status,
      inTraffic: 0,
      outTraffic: 0,
      latency: form.latency ? Number(form.latency) : null,
      lastSeen: new Date(),
      location: form.location.trim(),
    };
    onAdd(newDevice);
    setForm(empty);
    setErrors({});
    onClose();
  };

  const handleClose = () => { setForm(empty); setErrors({}); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4" onClick={handleClose}>
      <div
        className="bg-[#1e293b] border border-slate-700/50 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Хедер */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Добавить устройство</h3>
              <p className="text-xs text-slate-400">Заполните информацию о новом устройстве</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* Название */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Название устройства <span className="text-red-400">*</span>
            </label>
            <input value={form.name} onChange={set('name')} placeholder="PC-Office-01" className={clsx(inputCls, errors.name && 'border-red-500/60')} />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* IP + MAC в ряд */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                IP-адрес <span className="text-red-400">*</span>
              </label>
              <input value={form.ip} onChange={set('ip')} placeholder="192.168.1.100" className={clsx(inputCls, 'font-mono', errors.ip && 'border-red-500/60')} />
              {errors.ip && <p className="text-xs text-red-400 mt-1">{errors.ip}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                MAC-адрес <span className="text-red-400">*</span>
              </label>
              <input value={form.mac} onChange={set('mac')} placeholder="AA:BB:CC:DD:EE:FF" className={clsx(inputCls, 'font-mono', errors.mac && 'border-red-500/60')} />
              {errors.mac && <p className="text-xs text-red-400 mt-1">{errors.mac}</p>}
            </div>
          </div>

          {/* Тип устройства — карточки */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Тип устройства <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, type: value }))}
                  className={clsx(
                    "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all",
                    form.type === value
                      ? "border-blue-500 bg-blue-500/20 text-blue-400"
                      : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Статус */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Начальный статус</label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, status: value }))}
                  className={clsx(
                    "flex-1 py-2 rounded-lg border text-xs font-semibold transition-all",
                    form.status === value ? color : "border-slate-700 bg-slate-800/40 text-slate-500 hover:text-slate-300"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Расположение + Задержка */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Расположение <span className="text-red-400">*</span>
              </label>
              <input value={form.location} onChange={set('location')} placeholder="Офис 301" className={clsx(inputCls, errors.location && 'border-red-500/60')} />
              {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Задержка (мс)</label>
              <input value={form.latency} onChange={set('latency')} type="number" min="0" placeholder="0" className={inputCls} />
            </div>
          </div>

        </form>

        {/* Футер */}
        <div className="px-6 py-4 border-t border-slate-700/50 flex justify-end gap-3 bg-slate-900/20">
          <button type="button" onClick={handleClose} className="btn-secondary px-5">
            Отмена
          </button>
          <button
            onClick={handleSubmit as any}
            className="btn-primary flex items-center gap-2 px-5"
          >
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDeviceModal;
