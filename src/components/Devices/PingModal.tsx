import React, { useState, useEffect } from 'react';
import { Terminal, X, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { NetworkDevice } from '../../types';

interface PingModalProps {
  device: NetworkDevice | null;
  onClose: () => void;
}

const PingModal: React.FC<PingModalProps> = ({ device, onClose }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!device) return;
    
    setLogs([`PING ${device.ip} (56 data bytes)`]);
    setIsFinished(false);

    let count = 0;
    const maxPings = 4;
    
    const interval = setInterval(() => {
      count++;
      
      if (device.status === 'offline') {
        setLogs(prev => [...prev, `Request timeout for icmp_seq=${count}`]);
      } else {
        const time = (Math.random() * 2 + (device.latency || 1)).toFixed(1);
        setLogs(prev => [...prev, `64 bytes from ${device.ip}: icmp_seq=${count} ttl=64 time=${time} ms`]);
      }

      if (count >= maxPings) {
        clearInterval(interval);
        setTimeout(() => {
          const success = device.status !== 'offline';
          setLogs(prev => [
            ...prev,
            '',
            `--- ${device.ip} ping statistics ---`,
            `4 packets transmitted, ${success ? 4 : 0} received, ${success ? '0' : '100'}% packet loss`,
          ]);
          setIsFinished(true);
        }, 500);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [device]);

  if (!device) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="glass-panel w-full max-w-lg overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center gap-2 text-white font-medium">
            <Terminal className="w-5 h-5 text-blue-400" />
            Terminal - Ping {device.name}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 bg-slate-950 font-mono text-sm min-h-[300px] text-green-400">
          <div className="space-y-1">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
            {!isFinished && (
              <div className="animate-pulse">_</div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-700/50 flex justify-end">
          <button onClick={onClose} className="btn-secondary">
            {isFinished ? 'Закрыть' : 'Прервать (Ctrl+C)'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PingModal;
