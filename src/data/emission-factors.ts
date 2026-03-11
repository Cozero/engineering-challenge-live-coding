import { EmissionFactor } from '../types';

export const EMISSION_FACTORS: EmissionFactor[] = [
  { id: 'ef-1', activityType: 'electricity', factor: 0.485, inputUnit: 'kWh', outputUnit: 'kg CO2e', region: 'DE', validFrom: '2024-01-01', validTo: '2024-12-31' },
  { id: 'ef-2', activityType: 'electricity', factor: 0.233, inputUnit: 'kWh', outputUnit: 'kg CO2e', region: 'FR', validFrom: '2024-01-01', validTo: '2024-12-31' },
  { id: 'ef-3', activityType: 'electricity', factor: 0.368, inputUnit: 'kWh', outputUnit: 'kg CO2e', region: 'EU', validFrom: '2024-01-01', validTo: '2024-12-31' },
  { id: 'ef-4', activityType: 'natural_gas', factor: 2.0, inputUnit: 'm3', outputUnit: 'kg CO2e', region: 'DE', validFrom: '2024-01-01', validTo: '2024-12-31' },
  { id: 'ef-5', activityType: 'natural_gas', factor: 2.0, inputUnit: 'm3', outputUnit: 'kg CO2e', region: 'FR', validFrom: '2024-01-01', validTo: '2024-12-31' },
  { id: 'ef-6', activityType: 'diesel', factor: 2.68, inputUnit: 'litre', outputUnit: 'kg CO2e', region: 'GLOBAL', validFrom: '2024-01-01', validTo: '2024-12-31' },
  { id: 'ef-7', activityType: 'flight_short_haul', factor: 0.255, inputUnit: 'passenger-km', outputUnit: 'kg CO2e', region: 'GLOBAL', validFrom: '2024-01-01', validTo: '2024-12-31' },
  { id: 'ef-8', activityType: 'flight_long_haul', factor: 0.195, inputUnit: 'passenger-km', outputUnit: 'kg CO2e', region: 'GLOBAL', validFrom: '2024-01-01', validTo: '2024-12-31' },
];
