import { useState, useEffect, useCallback } from 'react';
import { mockDevices } from '../data/mockData';
import { NetworkDevice } from '../types';

// Глобальный стек устройств (чтобы разные вызовы хука видели одни данные)
let globalDevices: NetworkDevice[] = [...mockDevices];
const listeners: Array<() => void> = [];

const notifyAll = () => listeners.forEach(fn => fn());

export const useRealTimeData = () => {
  const [devices, setDevices] = useState<NetworkDevice[]>(globalDevices);

  // Подписываемся на глобальные обновления
  useEffect(() => {
    const handler = () => setDevices([...globalDevices]);
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  // Живое обновление трафика каждые 3 секунды
  useEffect(() => {
    const interval = setInterval(() => {
      globalDevices = globalDevices.map(device => {
        if (device.status === 'online' || device.status === 'warning') {
          const changeIn = device.inTraffic * 0.1 * (Math.random() * 2 - 1);
          const changeOut = device.outTraffic * 0.1 * (Math.random() * 2 - 1);
          return {
            ...device,
            inTraffic: Math.max(0, Number((device.inTraffic + changeIn).toFixed(1))),
            outTraffic: Math.max(0, Number((device.outTraffic + changeOut).toFixed(1))),
          };
        }
        return device;
      });
      notifyAll();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Добавить новое устройство
  const addDevice = useCallback((device: NetworkDevice) => {
    globalDevices = [device, ...globalDevices];
    notifyAll();
  }, []);

  // Обновить существующее устройство (по id)
  const updateDevice = useCallback((updated: NetworkDevice) => {
    globalDevices = globalDevices.map(d => d.id === updated.id ? updated : d);
    notifyAll();
  }, []);

  // Удалить устройство
  const deleteDevice = useCallback((id: string) => {
    globalDevices = globalDevices.filter(d => d.id !== id);
    notifyAll();
  }, []);

  return { devices, addDevice, updateDevice, deleteDevice };
};

export const useAnimatedCounter = (endValue: number, duration = 2000) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setValue(Math.floor(progress * endValue));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [endValue, duration]);
  return value;
};
