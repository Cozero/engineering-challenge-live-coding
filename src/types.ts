export interface ActivityEntry {
  id: string;
  organizationId: string;
  locationId: string;
  activityType: string;
  quantity: number;
  unit: string;
  startDate: string;
  endDate: string;
}

export interface EmissionFactor {
  id: string;
  activityType: string;
  factor: number;
  inputUnit: string;
  outputUnit: string;
  region: string;
  validFrom: string;
  validTo: string;
}

export interface CalculationResult {
  entryId: string;
  organizationId: string;
  co2eKg: number;
  calculatedAt: Date;
}

export interface BulkImportResult {
  successful: CalculationResult[];
  errors: { row: number; message: string }[];
}
