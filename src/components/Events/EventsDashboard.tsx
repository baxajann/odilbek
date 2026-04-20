import React, { useState } from 'react';
import { Filter, Download, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { mockEvents } from '../../data/mockData';
import { StatusBadge } from '../common/StatusBadge';
import { NetworkEvent } from '../../types';
import EventDetailModal from './EventDetailModal';
import { format } from 'date-fns';
import { clsx } from 'clsx';

const EventsDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<NetworkEvent | null>(null);

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch =
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || event.severity === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Настоящий CSV экспорт
  const handleExport = () => {
    const headers = ['ID', 'Время', 'Тип', 'Источник', 'Категория', 'Описание'];
    const rows = filteredEvents.map(e => [
      e.id,
      format(e.timestamp, 'yyyy-MM-dd HH:mm:ss'),
      e.severity,
      e.source,
      e.category,
      `"${e.description}"`,
    ]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'security': return 'Безопасность';
      case 'performance': return 'Производительность';
      case 'connectivity': return 'Подключение';
      case 'system': return 'Система';
      default: return category;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Журнал системных событий</h2>
          <p className="text-sm text-slate-400">История мониторинга работы сети и устройств</p>
        </div>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" /> Экспорт в CSV
        </button>
      </div>

      {/* Фильтры */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по описанию, устройству..."
            className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="flex w-full md:w-auto gap-4">
          <div className="flex items-center gap-2 text-slate-400 w-full xl:w-auto">
            <Filter className="w-4 h-4 shrink-0" />
            <select
              className="flex-1 lg:w-48 bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              value={typeFilter}
              onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">Все типы</option>
              <option value="critical">Критичные</option>
              <option value="warning">Предупреждения</option>
              <option value="info">Информационные</option>
              <option value="success">Успешные</option>
            </select>
          </div>
          <input
            type="date"
            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Таблица */}
      <div className="glass-panel overflow-hidden flex flex-col">
        <div className="overflow-x-auto text-sm flex-1">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 font-medium">Временная метка</th>
                <th className="px-6 py-4 font-medium">Тип</th>
                <th className="px-6 py-4 font-medium">Источник</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Категория</th>
                <th className="px-6 py-4 font-medium">Описание события</th>
                <th className="px-6 py-4 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-300">
              {paginatedEvents.map(event => (
                <tr
                  key={event.id}
                  className={clsx(
                    "hover:bg-slate-800/30 transition-colors",
                    event.severity === 'critical' && "bg-red-500/5"
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                    {format(event.timestamp, 'yyyy-MM-dd HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={event.severity} animate={false} />
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">{event.source}</td>
                  <td className="px-6 py-4 text-slate-400 hidden md:table-cell">
                    {getCategoryName(event.category)}
                  </td>
                  <td className="px-6 py-4 text-slate-300 max-w-xs truncate" title={event.description}>
                    {event.description}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium transition-colors"
                    >
                      Детали
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedEvents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    События не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700/50 bg-slate-800/20">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            Показывать по:
            <select
              className="bg-slate-900 border border-slate-700 rounded p-1 text-white text-sm"
              value={itemsPerPage}
              onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-slate-500">
              (всего: {filteredEvents.length})
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              Страница <span className="text-white">{currentPage}</span> из {totalPages || 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно деталей */}
      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};

export default EventsDashboard;
