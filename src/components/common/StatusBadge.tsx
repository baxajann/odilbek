import React from 'react';
import { clsx } from 'clsx';

export type StatusType = 'online' | 'offline' | 'warning' | 'critical' | 'info' | 'success';

interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  animate?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text, animate = true }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
      case 'success':
        return { color: 'bg-green-500', text: 'text-green-400', label: text || 'Онлайн', border: 'border-green-500/30', bgLite: 'bg-green-500/10' };
      case 'offline':
      case 'critical':
        return { color: 'bg-red-500', text: 'text-red-400', label: text || 'Офлайн', border: 'border-red-500/30', bgLite: 'bg-red-500/10' };
      case 'warning':
        return { color: 'bg-yellow-500', text: 'text-yellow-400', label: text || 'Предупреждение', border: 'border-yellow-500/30', bgLite: 'bg-yellow-500/10' };
      case 'info':
        return { color: 'bg-blue-500', text: 'text-blue-400', label: text || 'Инфо', border: 'border-blue-500/30', bgLite: 'bg-blue-500/10' };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={clsx("inline-flex items-center gap-2 px-2.5 py-1 rounded-full border", config.border, config.bgLite)}>
      <div className="relative flex h-2.5 w-2.5">
        {animate && (status === 'online' || status === 'warning') && (
          <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", config.color)}></span>
        )}
        <span className={clsx("relative inline-flex rounded-full h-2.5 w-2.5", config.color)}></span>
      </div>
      <span className={clsx("text-xs font-medium", config.text)}>{config.label}</span>
    </div>
  );
};
