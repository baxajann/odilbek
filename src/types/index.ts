export interface NetworkDevice {
  id: string;
  name: string;
  ip: string;
  mac: string;
  type: 'router' | 'switch' | 'pc' | 'laptop' | 'printer' | 'camera' | 'server';
  status: 'online' | 'offline' | 'warning';
  inTraffic: number;    // Мбит/с
  outTraffic: number;   // Мбит/с
  latency: number | null; // мс
  lastSeen: Date;
  location: string;
}

export interface NetworkEvent {
  id: string;
  timestamp: Date;
  severity: 'critical' | 'warning' | 'info' | 'success';
  source: string;
  category: 'security' | 'performance' | 'connectivity' | 'system';
  description: string;
  read: boolean;
}

export interface TrafficData {
  time: string;
  incoming: number;
  outgoing: number;
}
