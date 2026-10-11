export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  ESTIMATED = 'ESTIMATED',
  BOOKED = 'BOOKED',
  COMPLETED = 'COMPLETED'
}

export enum ServiceType {
  IRRIGATION = 'Irrigation',
  DRAINAGE = 'Drainage',
  HARDSCAPE = 'Hardscape',
  LIGHTING = 'Lighting',
  MAINTENANCE = 'Maintenance'
}

export interface Lead {
  id: string;
  name: string;
  address: string;
  city: string;
  distanceRing: number; // 0-4
  serviceInterest: ServiceType;
  status: LeadStatus;
  value: number;
  date: string;
  urgent: boolean;
}

export interface StatMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface ComplianceRecord {
  id: string;
  name: string;
  licenseNumber: string;
  type: 'Irrigation' | 'Landscape' | 'Pesticide' | 'Backflow';
  expiryDate: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
}

export interface Route {
  id: string;
  crewName: string;
  zone: string; // e.g., Ring 0 - Harrisburg
  stops: number;
  efficiencyScore: number; // 0-100
}
