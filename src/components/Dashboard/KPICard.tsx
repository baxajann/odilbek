import React from 'react';
import { clsx } from 'clsx';
import { useAnimatedCounter } from '../../hooks/useRealTimeData';

interface KPICardProps {
  title: string;
  value: number;
  suffix?: string;
  trend?: string;
  icon: React.ElementType;
  colorClass: string;
  formatValue?: (val: number) => string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, suffix = '', trend, icon: Icon, colorClass, formatValue }) => {
  const animatedValue = useAnimatedCounter(value);
  const displayValue = formatValue ? formatValue(animatedValue) : animatedValue;

  return (
    <div className={clsx("glass-panel p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-l-4", colorClass.split(' ')[0].replace('text', 'border'))}>
      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <Icon className="w-32 h-32" />
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-bold text-white tracking-tight">{displayValue}</h3>
            {suffix && <span className="text-slate-400 font-medium">{suffix}</span>}
          </div>
          {trend && (
            <p className={clsx("text-xs font-medium mt-2", trend.includes('+') || trend.includes('▲') ? "text-green-400" : "text-blue-400")}>
              {trend}
            </p>
          )}
        </div>
        <div className={clsx("p-3 rounded-lg bg-slate-800/50", colorClass)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
