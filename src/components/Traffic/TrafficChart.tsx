import React from 'react';
import { DownloadCloud, UploadCloud, Activity, Zap } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const dailyTraffic = [
  { day: 'Пн', in: 120, out: 80 },
  { day: 'Вт', in: 150, out: 90 },
  { day: 'Ср', in: 180, out: 120 },
  { day: 'Чт', in: 130, out: 85 },
  { day: 'Пт', in: 210, out: 160 },
  { day: 'Сб', in: 90, out: 40 },
  { day: 'Вс', in: 70, out: 30 },
];

const protocolData = [
  { name: 'HTTP/HTTPS', value: 45, color: '#3b82f6' },
  { name: 'FTP', value: 20, color: '#22c55e' },
  { name: 'DNS', value: 15, color: '#eab308' },
  { name: 'SMB', value: 12, color: '#a855f7' },
  { name: 'Прочее', value: 8, color: '#64748b' },
];

const topDevices = [
  { name: 'NAS-Server-01', value: 380 },
  { name: 'Router-Main', value: 245 },
  { name: 'Laptop-IT-Admin', value: 120 },
  { name: 'PC-Director', value: 89 },
  { name: 'Switch-Core-01', value: 67 },
];

const TrafficDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Анализ сетевого трафика</h2>
        <p className="text-sm text-slate-400">Детальная статистика и потребление полосы пропускания</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-panel p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Общий входящий</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-bold text-white tracking-tight">1.24</h3>
                <span className="text-slate-400 font-medium">ТБ / мес</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
              <DownloadCloud className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Общий исходящий</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-bold text-white tracking-tight">0.87</h3>
                <span className="text-slate-400 font-medium">ТБ / мес</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
              <UploadCloud className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Пиковая нагрузка</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-bold text-white tracking-tight">487</h3>
                <span className="text-slate-400 font-medium">Мбит/с</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Зафиксировано в 14:30</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
              <Zap className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Средняя нагрузка</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-bold text-white tracking-tight">156</h3>
                <span className="text-slate-400 font-medium">Мбит/с</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Трафик по дням недели (ГБ)</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyTraffic}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
                cursor={{ fill: '#334155', opacity: 0.4 }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="in" name="Входящий (ГБ)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="out" name="Исходящий (ГБ)" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Топ протоколов</h3>
          <div className="h-[300px] flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={protocolData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent = 0 }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {protocolData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: any) => [`${value}%`]}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Топ-5 устройств по трафику (ГБ)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topDevices}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={120} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                  formatter={(value: any) => [`${value} ГБ`, 'Трафик']}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                  {topDevices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(258, 90%, ${66 - index * 6}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficDashboard;
