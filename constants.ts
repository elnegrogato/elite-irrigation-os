import { Lead, LeadStatus, ServiceType, ComplianceRecord, Route } from './types';

export const SERVICE_AREAS = [
  { name: 'Harrisburg (HQ)', ring: 0, desc: 'Ring 0: Rapid Response' },
  { name: 'Charlotte Metro', ring: 1, desc: 'Ring 1: High Volume' },
  { name: 'Lake Norman', ring: 1, desc: 'Ring 1: High Volume' },
  { name: 'Triad Edge', ring: 2, desc: 'Ring 2: Selective Projects' },
  { name: 'Raleigh Direction', ring: 3, desc: 'Ring 3: Commercial Bids' },
];

export const MOCK_LEADS: Lead[] = [
  { id: 'L001', name: 'James Henderson', address: '4502 Rocky River Rd', city: 'Harrisburg', distanceRing: 0, serviceInterest: ServiceType.DRAINAGE, status: LeadStatus.NEW, value: 4500, date: '2023-10-24', urgent: true },
  { id: 'L002', name: 'Sarah Miller', address: '120 Trade St', city: 'Matthews', distanceRing: 1, serviceInterest: ServiceType.IRRIGATION, status: LeadStatus.ESTIMATED, value: 850, date: '2023-10-23', urgent: false },
  { id: 'L003', name: 'Oak Hills HOA', address: 'Common Area Main', city: 'Concord', distanceRing: 0, serviceInterest: ServiceType.MAINTENANCE, status: LeadStatus.CONTACTED, value: 12000, date: '2023-10-22', urgent: false },
  { id: 'L004', name: 'Tech Park Facilities', address: '800 Innovation Dr', city: 'University City', distanceRing: 1, serviceInterest: ServiceType.HARDSCAPE, status: LeadStatus.BOOKED, value: 25000, date: '2023-10-20', urgent: false },
  { id: 'L005', name: 'Mike Ross', address: 'Lakeview Dr', city: 'Mooresville', distanceRing: 1, serviceInterest: ServiceType.LIGHTING, status: LeadStatus.NEW, value: 3200, date: '2023-10-24', urgent: false },
];

export const MOCK_COMPLIANCE: ComplianceRecord[] = [
  { id: 'C001', name: 'NC Irrigation Contractor', licenseNumber: 'IC-4492', type: 'Irrigation', expiryDate: '2024-12-31', status: 'Valid' },
  { id: 'C002', name: 'NC Landscape Contractor', licenseNumber: 'LC-1102', type: 'Landscape', expiryDate: '2024-08-01', status: 'Valid' },
  { id: 'C003', name: 'Pesticide Applicator', licenseNumber: 'PA-9921', type: 'Pesticide', expiryDate: '2023-11-15', status: 'Expiring Soon' },
];

export const MOCK_ROUTES: Route[] = [
  { id: 'R01', crewName: 'Alpha Crew (Maint)', zone: 'Ring 0 - Harrisburg', stops: 14, efficiencyScore: 94 },
  { id: 'R02', crewName: 'Beta Crew (Install)', zone: 'Ring 1 - South CLT', stops: 1, efficiencyScore: 88 },
  { id: 'R03', crewName: 'Gamma Crew (Service)', zone: 'Ring 1 - LKN', stops: 6, efficiencyScore: 91 },
];

export const REVENUE_DATA = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 125000 }, // Spring Startup
  { name: 'Apr', revenue: 140000 },
  { name: 'May', revenue: 155000 },
  { name: 'Jun', revenue: 130000 },
  { name: 'Jul', revenue: 110000 }, // Summer lull/Heat
  { name: 'Aug', revenue: 115000 },
  { name: 'Sep', revenue: 125000 }, // Fall Aeration
  { name: 'Oct', revenue: 160000 }, // Winterization start
  { name: 'Nov', revenue: 110000 },
  { name: 'Dec', revenue: 60000 },
];
