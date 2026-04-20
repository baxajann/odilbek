import React from 'react';
import { X, Clock, Tag, Server, FileText, AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { NetworkEvent } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { clsx } from 'clsx';

interface EventDetailModalProps {
  event: NetworkEvent | null;
  onClose: () => void;
}

const getCategoryName = (cat: string) => {
  switch (cat) {
    case 'security': return 'Безопасность';
    case 'performance': return 'Производительность';
    case 'connectivity': return 'Подключение';
    case 'system': return 'Система';
    default: return cat;
  }
};

const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case 'security': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    case 'performance': return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
    case 'connectivity': return <Info className="w-4 h-4 text-purple-400" />;
    default: return <FileText className="w-4 h-4 text-slate-400" />;
  }
};

const getSeverityBg = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-500/10 border-red-500/30';
    case 'warning': return 'bg-yellow-500/10 border-yellow-500/30';
    case 'success': return 'bg-green-500/10 border-green-500/30';
    default: return 'bg-blue-500/10 border-blue-500/30';
  }
};

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  // Имитация рекомендаций на основе severity
  const recommendations: string[] = [];
  if (event.severity === 'critical') {
    recommendations.push('Немедленно проверьте состояние устройства.');
    recommendations.push('Свяжитесь с сетевым администратором.');
    recommendations.push('Проверьте физическое подключение к сети.');
  } else if (event.severity === 'warning') {
    recommendations.push('Следите за состоянием в течение 30 минут.');
    recommendations.push('При повторении — перезагрузите устройство.');
  } else {
    recommendations.push('Событие носит информационный характер.');
    recommendations.push('Дополнительных действий не требуется.');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1e293b] border border-slate-700/50 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Хедер */}
        <div className={clsx("p-5 border-b border-slate-700/50 flex items-start justify-between gap-4", getSeverityBg(event.severity))}>
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <StatusBadge status={event.severity} animate={false} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Детали события</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">ID: {event.id.toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Описание */}
        <div className="p-6 space-y-5">
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/40">
            <p className="text-white font-medium leading-relaxed">{event.description}</p>
          </div>

          {/* Мета-информация */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">
                <Clock className="w-3.5 h-3.5" /> Время
              </div>
              <p className="text-white text-sm font-semibold">
                {format(event.timestamp, 'HH:mm:ss')}
              </p>
              <p className="text-slate-400 text-xs">
                {format(event.timestamp, 'd MMMM yyyy', { locale: ru })}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">
                <Server className="w-3.5 h-3.5" /> Источник
              </div>
              <p className="text-white text-sm font-semibold font-mono">{event.source}</p>
              <p className="text-slate-400 text-xs">Сетевое устройство</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">
                <Tag className="w-3.5 h-3.5" /> Категория
              </div>
              <div className="flex items-center gap-2">
                {getCategoryIcon(event.category)}
                <span className="text-white text-sm font-medium">{getCategoryName(event.category)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">
                <FileText className="w-3.5 h-3.5" /> Статус
              </div>
              <span className={clsx(
                "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                event.read ? "bg-slate-700/50 text-slate-400" : "bg-blue-500/10 text-blue-400"
              )}>
                {event.read ? <CheckCircle2 className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                {event.read ? 'Прочитано' : 'Новое'}
              </span>
            </div>
          </div>

          {/* Рекомендации */}
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Рекомендации</p>
            <ul className="space-y-2">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    {i + 1}
                  </span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Футер */}
        <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/30 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Закрыть
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Отметить прочитанным
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
