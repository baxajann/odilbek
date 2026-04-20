import React, { useState } from 'react';
import { Cloud, Router, SwitchCamera, MonitorSmartphone, Printer, Laptop, Server, Info, X } from 'lucide-react';
import { clsx } from 'clsx';
import { mockDevices } from '../../data/mockData';
import { NetworkDevice } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'router': return <Router className="w-8 h-8" />;
    case 'switch': return <Server className="w-8 h-8" />; // 'SwitchCamera' is camera icon, Server for switch
    case 'pc': return <MonitorSmartphone className="w-6 h-6" />;
    case 'laptop': return <Laptop className="w-6 h-6" />;
    case 'printer': return <Printer className="w-6 h-6" />;
    case 'camera': return <SwitchCamera className="w-6 h-6" />;
    case 'server': return <Server className="w-8 h-8" />;
    default: return <Info className="w-6 h-6" />;
  }
};

const NetworkTopology: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);

  const getDeviceColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400 border-green-500/50 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]';
      case 'warning': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)] animate-pulse';
      case 'offline': return 'text-red-400 border-red-500/50 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
      default: return 'text-slate-400 border-slate-500/50 bg-slate-500/10';
    }
  };

  const LineAnimation = ({ active }: { active: boolean }) => {
    if (!active) return null;
    return (
      <circle r="4" fill="#3b82f6">
        <animateMotion dur="2s" repeatCount="indefinite" path="M0 0 L100 100" /> 
        {/* Placeholder for real animation path, doing via CSS instead for simpler svg */}
      </circle>
    );
  };

  const renderNode = (x: number, y: number, deviceId: string, label: string, type: string) => {
    const device = mockDevices.find(d => d.id === deviceId) || mockDevices[0];
    const colorClass = getDeviceColor(device.status);
    
    return (
      <div 
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center cursor-pointer group z-10 transition-transform hover:scale-110`}
        style={{ left: `${x}%`, top: `${y}%` }}
        onClick={() => setSelectedDevice(device)}
      >
        <div className={clsx("p-3 rounded-xl border backdrop-blur-sm transition-all", colorClass)}>
          {getDeviceIcon(type)}
        </div>
        <span className="mt-2 text-xs font-semibold text-slate-300 bg-slate-900/80 px-2 py-1 rounded w-max">
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold text-white mb-2">Топология локальной сети</h2>
        <p className="text-slate-400">Визуальная карта всех сетевых устройств и их соединений.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 glass-panel h-[600px] relative overflow-hidden bg-slate-900/50 rounded-xl border border-slate-700/50">
          
          {/* SVG Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {/* Internet to Router */}
            <path d="M50% 15% L50% 30%" stroke="#3b82f6" strokeWidth="2" fill="none" className="animate-pulse" />
            
            {/* Router to Switches */}
            <path d="M50% 30% L25% 50%" stroke="#22c55e" strokeWidth="2" fill="none" />
            <path d="M50% 30% L50% 50%" stroke="#eab308" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            <path d="M50% 30% L75% 50%" stroke="#22c55e" strokeWidth="2" fill="none" />
            
            {/* Switch 1 to devices */}
            <path d="M25% 50% L15% 75%" stroke="#22c55e" strokeWidth="1.5" fill="none" className="opacity-50" />
            <path d="M25% 50% L25% 75%" stroke="#22c55e" strokeWidth="1.5" fill="none" className="opacity-50" />
            <path d="M25% 50% L35% 75%" stroke="#ef4444" strokeWidth="1.5" fill="none" strokeDasharray="4,4" className="opacity-50" />
            
            {/* Switch 2 to devices */}
            <path d="M50% 50% L45% 75%" stroke="#eab308" strokeWidth="1.5" fill="none" className="opacity-50" />
            <path d="M50% 50% L55% 75%" stroke="#22c55e" strokeWidth="1.5" fill="none" className="opacity-50" />
            
            {/* Switch 3 to devices */}
            <path d="M75% 50% L65% 75%" stroke="#22c55e" strokeWidth="1.5" fill="none" className="opacity-50" />
            <path d="M75% 50% L75% 75%" stroke="#ef4444" strokeWidth="1.5" fill="none" strokeDasharray="4,4" className="opacity-50" />
            <path d="M75% 50% L85% 75%" stroke="#22c55e" strokeWidth="1.5" fill="none" className="opacity-50" />
          </svg>

          {/* Nodes */}
          {/* Internet */}
          <div className="absolute left-[50%] top-[15%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="p-4 rounded-full bg-blue-500/20 border border-blue-500/50 text-blue-400">
              <Cloud className="w-10 h-10" />
            </div>
            <span className="mt-2 text-sm font-bold text-white">Интернет</span>
          </div>

          {/* Router */}
          {renderNode(50, 30, '1', 'Router-Main', 'router')}

          {/* Switches */}
          {renderNode(25, 50, '3', 'Switch-Floor-1', 'switch')}
          {renderNode(50, 50, '2', 'Switch-Core-01', 'switch')}
          {renderNode(75, 50, '4', 'Switch-Floor-2', 'switch')}

          {/* End Devices (Floor 1) */}
          {renderNode(15, 75, '5', 'PC-Director', 'pc')}
          {renderNode(25, 75, '10', 'Printer-HP-01', 'printer')}
          {renderNode(35, 75, '8', 'PC-Buhgalter-3', 'pc')} // offline

          {/* End Devices (Core) */}
          {renderNode(45, 75, '12', 'NAS-Server-01', 'server')}
          {renderNode(55, 75, '9', 'Laptop-IT', 'laptop')}

          {/* End Devices (Floor 2) */}
          {renderNode(65, 75, '6', 'PC-Buhgalter-1', 'pc')}
          {renderNode(75, 75, '11', 'Camera-Entry', 'camera')} // offline
          {renderNode(85, 75, '13', 'Camera-Hall', 'camera')}

        </div>

        {/* Инфо-панель справа */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Легенда</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Онлайн
                </div>
                <span className="text-xs font-bold bg-slate-800 px-2 py-1 rounded">19</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  Офлайн
                </div>
                <span className="text-xs font-bold bg-slate-800 px-2 py-1 rounded">5</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  Предупреждение
                </div>
                <span className="text-xs font-bold bg-slate-800 px-2 py-1 rounded">2</span>
              </div>
              <div className="pt-4 border-t border-slate-700/50 space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-[2px] bg-blue-500"></div>
                  Активное соединение
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-[2px] bg-red-500 border-dashed border-t-2 border-red-500 opacity-50 bg-transparent"></div>
                  Разрыв соединения
                </div>
              </div>
            </div>
          </div>

          {/* Tooltip выбранного устройства */}
          {selectedDevice && (
            <div className="glass-panel p-6 animate-fade-in relative">
              <button 
                onClick={() => setSelectedDevice(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  {getDeviceIcon(selectedDevice.type)}
                </div>
                <div>
                  <h4 className="font-bold text-white leading-tight">{selectedDevice.name}</h4>
                  <p className="text-xs text-slate-400 font-mono mt-1">{selectedDevice.ip}</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-700/50 pb-2">
                  <span className="text-slate-400">Статус</span>
                  <StatusBadge status={selectedDevice.status} animate={false} />
                </div>
                <div className="flex justify-between border-b border-slate-700/50 pb-2">
                  <span className="text-slate-400">MAC-адрес</span>
                  <span className="text-white font-mono">{selectedDevice.mac}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/50 pb-2">
                  <span className="text-slate-400">Трафик ↓/↑</span>
                  <span className="text-white">{selectedDevice.inTraffic} / {selectedDevice.outTraffic} Мбит/с</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Расположение</span>
                  <span className="text-white">{selectedDevice.location}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkTopology;
