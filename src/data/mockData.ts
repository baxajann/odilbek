import { NetworkDevice, NetworkEvent } from '../types';

export const mockDevices: NetworkDevice[] = [
  { id: '1', name: 'Router-Main', ip: '192.168.1.1', mac: '00:1A:2B:3C:4D:5E', type: 'router', status: 'online', inTraffic: 245, outTraffic: 89, latency: 2, lastSeen: new Date(), location: 'Серверная' },
  { id: '2', name: 'Switch-Core-01', ip: '192.168.1.2', mac: '00:1A:2B:3C:4D:5F', type: 'switch', status: 'warning', inTraffic: 180, outTraffic: 45, latency: 3, lastSeen: new Date(), location: 'Серверная' },
  { id: '3', name: 'Switch-Floor-1', ip: '192.168.1.3', mac: '00:1A:2B:3C:4D:60', type: 'switch', status: 'online', inTraffic: 92, outTraffic: 31, latency: 1, lastSeen: new Date(), location: 'Этаж 1' },
  { id: '4', name: 'Switch-Floor-2', ip: '192.168.1.4', mac: '00:1A:2B:3C:4D:61', type: 'switch', status: 'online', inTraffic: 87, outTraffic: 28, latency: 1, lastSeen: new Date(), location: 'Этаж 2' },
  { id: '5', name: 'PC-Director', ip: '192.168.1.10', mac: '00:1A:2B:3C:4D:62', type: 'pc', status: 'online', inTraffic: 15, outTraffic: 8, latency: 5, lastSeen: new Date(), location: 'Кабинет Директора' },
  { id: '6', name: 'PC-Buhgalter-1', ip: '192.168.1.11', mac: '00:1A:2B:3C:4D:63', type: 'pc', status: 'online', inTraffic: 12, outTraffic: 5, latency: 4, lastSeen: new Date(), location: 'Бухгалтерия' },
  { id: '7', name: 'PC-Buhgalter-2', ip: '192.168.1.12', mac: '00:1A:2B:3C:4D:64', type: 'pc', status: 'online', inTraffic: 18, outTraffic: 7, latency: 6, lastSeen: new Date(), location: 'Бухгалтерия' },
  { id: '8', name: 'PC-Buhgalter-3', ip: '192.168.1.13', mac: '00:1A:2B:3C:4D:65', type: 'pc', status: 'offline', inTraffic: 0, outTraffic: 0, latency: null, lastSeen: new Date(Date.now() - 3600000), location: 'Бухгалтерия' },
  { id: '9', name: 'Laptop-IT-Admin', ip: '192.168.1.20', mac: '00:1A:2B:3C:4D:66', type: 'laptop', status: 'online', inTraffic: 45, outTraffic: 22, latency: 8, lastSeen: new Date(), location: 'IT Отдел' },
  { id: '10', name: 'Printer-HP-01', ip: '192.168.1.30', mac: '00:1A:2B:3C:4D:67', type: 'printer', status: 'online', inTraffic: 0.5, outTraffic: 0.1, latency: 12, lastSeen: new Date(), location: 'Коридор 1' },
  { id: '11', name: 'Camera-Entry-01', ip: '192.168.1.40', mac: '00:1A:2B:3C:4D:68', type: 'camera', status: 'offline', inTraffic: 0, outTraffic: 0, latency: null, lastSeen: new Date(Date.now() - 86400000), location: 'Вход' },
  { id: '12', name: 'NAS-Server-01', ip: '192.168.1.50', mac: '00:1A:2B:3C:4D:69', type: 'server', status: 'online', inTraffic: 120, outTraffic: 95, latency: 3, lastSeen: new Date(), location: 'Серверная' },
  // дополнительные для разнообразия
  { id: '13', name: 'Camera-Hall-01', ip: '192.168.1.41', mac: '00:1A:2B:3C:4D:7A', type: 'camera', status: 'online', inTraffic: 12, outTraffic: 1, latency: 4, lastSeen: new Date(), location: 'Холл' },
  { id: '14', name: 'Camera-Hall-02', ip: '192.168.1.42', mac: '00:1A:2B:3C:4D:7B', type: 'camera', status: 'online', inTraffic: 14, outTraffic: 2, latency: 5, lastSeen: new Date(), location: 'Холл' },
  { id: '15', name: 'PC-Manager-1', ip: '192.168.1.14', mac: '00:1A:2B:3C:4D:7C', type: 'pc', status: 'online', inTraffic: 30, outTraffic: 15, latency: 4, lastSeen: new Date(), location: 'Отдел продаж' },
  { id: '16', name: 'PC-Manager-2', ip: '192.168.1.15', mac: '00:1A:2B:3C:4D:7D', type: 'pc', status: 'online', inTraffic: 25, outTraffic: 10, latency: 3, lastSeen: new Date(), location: 'Отдел продаж' },
  { id: '17', name: 'PC-Manager-3', ip: '192.168.1.16', mac: '00:1A:2B:3C:4D:7E', type: 'pc', status: 'offline', inTraffic: 0, outTraffic: 0, latency: null, lastSeen: new Date(Date.now() - 7200000), location: 'Отдел продаж' },
  { id: '18', name: 'Laptop-Guest', ip: '192.168.1.25', mac: '00:1A:2B:3C:4D:7F', type: 'laptop', status: 'online', inTraffic: 60, outTraffic: 5, latency: 15, lastSeen: new Date(), location: 'Переговорная' },
  { id: '19', name: 'Printer-Epson-02', ip: '192.168.1.31', mac: '00:1A:2B:3C:4D:8A', type: 'printer', status: 'warning', inTraffic: 0.1, outTraffic: 0.05, latency: 25, lastSeen: new Date(), location: 'Отдел продаж' },
  { id: '20', name: 'SmartTV-Lobby', ip: '192.168.1.60', mac: '00:1A:2B:3C:4D:8B', type: 'pc', status: 'online', inTraffic: 40, outTraffic: 2, latency: 6, lastSeen: new Date(), location: 'Холл' },
  { id: '21', name: 'Laptop-CEO', ip: '192.168.1.21', mac: '00:1A:2B:3C:4D:8C', type: 'laptop', status: 'offline', inTraffic: 0, outTraffic: 0, latency: null, lastSeen: new Date(Date.now() - 4000000), location: 'Кабинет Директора' },
  { id: '22', name: 'Switch-Floor-3', ip: '192.168.1.5', mac: '00:1A:2B:3C:4D:8D', type: 'switch', status: 'online', inTraffic: 40, outTraffic: 15, latency: 1, lastSeen: new Date(), location: 'Этаж 3' },
  { id: '23', name: 'PC-Dev-1', ip: '192.168.1.17', mac: '00:1A:2B:3C:4D:8E', type: 'pc', status: 'online', inTraffic: 110, outTraffic: 60, latency: 2, lastSeen: new Date(), location: 'IT Отдел' },
  { id: '24', name: 'PC-Dev-2', ip: '192.168.1.18', mac: '00:1A:2B:3C:4D:8F', type: 'pc', status: 'offline', inTraffic: 0, outTraffic: 0, latency: null, lastSeen: new Date(Date.now() - 500000), location: 'IT Отдел' },
];

const generateEvents = (): NetworkEvent[] => {
  const events: NetworkEvent[] = [
    { id: 'e1', timestamp: new Date(new Date().setHours(14, 23, 1)), severity: 'critical', source: 'PC-Buhgalter-3', category: 'connectivity', description: 'Устройство недоступно более 5 минут', read: false },
    { id: 'e2', timestamp: new Date(new Date().setHours(14, 18, 45)), severity: 'warning', source: 'Switch-Core-01', category: 'performance', description: 'Загрузка CPU превысила 85%', read: false },
    { id: 'e3', timestamp: new Date(new Date().setHours(14, 5, 12)), severity: 'success', source: 'Router-Main', category: 'system', description: 'Перезагрузка завершена успешно', read: true },
    { id: 'e4', timestamp: new Date(new Date().setHours(13, 55, 30)), severity: 'info', source: 'Printer-HP-01', category: 'connectivity', description: 'Новое устройство обнаружено в сети', read: true },
    { id: 'e5', timestamp: new Date(new Date().setHours(13, 40, 18)), severity: 'warning', source: 'NAS-Server-01', category: 'performance', description: 'Дисковое пространство заполнено на 78%', read: true },
    { id: 'e6', timestamp: new Date(new Date().setHours(12, 15, 0)), severity: 'critical', source: 'Camera-Entry-01', category: 'connectivity', description: 'Потеря видеосигнала (Офлайн)', read: true },
    { id: 'e7', timestamp: new Date(new Date().setHours(11, 30, 0)), severity: 'info', source: 'PC-Director', category: 'security', description: 'Успешный вход в систему', read: true },
    { id: 'e8', timestamp: new Date(new Date().setHours(10, 5, 23)), severity: 'warning', source: 'Router-Main', category: 'security', description: 'Множественные попытки входа с IP 192.168.1.150', read: true },
  ];

  // Сгенерируем еще 12 случайных событий для пагинации (итого 20)
  for (let i = 0; i < 12; i++) {
    const isError = Math.random() > 0.8;
    events.push({
      id: `gen-e${i}`,
      timestamp: new Date(new Date().getTime() - Math.random() * 86400000), // в пределах последних 24ч
      severity: isError ? 'critical' : Math.random() > 0.5 ? 'info' : 'success',
      source: mockDevices[Math.floor(Math.random() * mockDevices.length)].name,
      category: 'system',
      description: isError ? 'Неизвестный сбой в работе службы' : 'Регулярная проверка пройдена успешно',
      read: true
    });
  }

  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const mockEvents = generateEvents();
