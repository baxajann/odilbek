import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Router, CheckCircle, XCircle, ArrowDown, ArrowRight } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import KPICard from './KPICard';
import { StatusBadge } from '../common/StatusBadge';
import { mockEvents } from '../../data/mockData';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useRealTimeData } from '../../hooks/useRealTimeData';

// Генерация стартовых данных для графика за 24ч
const generateTrafficData = () => {
  const data = [];
  for (let i = 0; i <= 24; i += 2) {
    data.push({
      time: `${i.toString().padStart(2, '0')}:00`,
      in: Math.floor(Math.random() * 250) + 50,
      out: Math.floor(Math.random() * 150) + 20,
    });
  }
  return data;
};

const weekData = [
  { day: 'Пн', value: 45 },
  { day: 'Вт', value: 62 },
  { day: 'Ср', value: 78 },
  { day: 'Чт', value: 55 },
  { day: 'Пт', value: 89 },
  { day: 'Сб', value: 34 },
  { day: 'Вс', value: 71 },
];

const Dashboard: React.FC = () => {
  const { devices } = useRealTimeData();
  const [trafficData, setTrafficData] = useState(generateTrafficData());

  // Вычисляем показатели на основе реальных данных из стора
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;
  
  // Суммируем текущий трафик со всех устройств
  const totalInTraffic = Math.round(devices.reduce((acc, curr) => acc + (curr.inTraffic || 0), 0));
  const totalOutTraffic = Math.round(devices.reduce((acc, curr) => acc + (curr.outTraffic || 0), 0));

  useEffect(() => {
    // Каждые 3 секунды обновляем последнюю точку графика реальным суммарным трафиком
    const interval = setInterval(() => {
      setTrafficData(prev => {
        const newData = [...prev];
        const last = newData[newData.length - 1];
        newData[newData.length - 1] = {
          ...last,
          in: totalInTraffic,
          out: totalOutTraffic,
        };
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [totalInTraffic, totalOutTraffic]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard 
          title="Всего устройств" 
          value={totalDevices} 
          trend="Устройства в сети" 
          icon={Router} 
          colorClass="text-blue-500 border-blue-500" 
        />
        <KPICard 
          title="Онлайн" 
          value={onlineDevices} 
          trend={`${Math.round((onlineDevices / totalDevices) * 100 || 0)}% от всего`} 
          icon={CheckCircle} 
          colorClass="text-green-500 border-green-500" 
        />
        <KPICard 
          title="Офлайн" 
          value={offlineDevices} 
          trend="Требует внимания" 
          icon={XCircle} 
          colorClass="text-red-500 border-red-500" 
        />
        <KPICard 
          title="Трафик (Вход/Исх)" 
          value={totalInTraffic} 
          suffix={` / ${totalOutTraffic}`} 
          trend="Текущая сумма" 
          icon={ArrowDown} 
          colorClass="text-purple-500 border-purple-500" 
        />
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Трафик сети за 24 часа</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Line type="monotone" name="Входящий" dataKey="in" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#3b82f6' }} />
                <Line type="monotone" name="Исходящий" dataKey="out" stroke="#22c55e" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Загрузка канала (%)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" name="Загрузка (%)" dataKey="value" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Последние события */}
      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Последние события</h3>
          <Link to="/events" className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
            Просмотреть все <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Время</th>
                <th className="px-6 py-4 font-medium">Тип</th>
                <th className="px-6 py-4 font-medium">Устройство</th>
                <th className="px-6 py-4 font-medium">Описание</th>
                <th className="px-6 py-4 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-300">
              {mockEvents.slice(0, 8).map((event) => (
                <tr key={event.id} className={clsx("hover:bg-slate-800/30 transition-colors", event.severity === 'critical' && "bg-red-500/5")}>
                  <td className="px-6 py-4 whitespace-nowrap">{format(event.timestamp, 'HH:mm')}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={event.severity} />
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{event.source}</td>
                  <td className="px-6 py-4 text-slate-400">{event.description}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-500">{event.read ? 'Прочитано' : 'Новое'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
