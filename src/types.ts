/**
 * Represents a single activity data entry from a customer.
 *
 * Each entry records a measurable activity (energy use, travel, fuel consumption)
 * at a specific location over a time period. These are typically imported from
 * CSV uploads, manual entry in the UI, or integrations with utility providers.
 */
export interface ActivityEntry {
  /** Unique identifier for this entry */
  id: string;
  /** The organization this entry belongs to */
  organizationId: string;
  /**
   * Location identifier in format "{country}-{city}-{id}", e.g., "de-berlin-001".
   * The country prefix (before the first hyphen) maps to an emission factor region:
   * "de-berlin-001" -> region "DE"
   */
  locationId: string;
  /** Type of activity, must match an emission factor's activityType (e.g., "electricity", "natural_gas", "diesel") */
  activityType: string;
  /** Amount of the activity consumed, in the specified unit */
  quantity: number;
  /** Unit of measurement (e.g., "kWh", "m3", "litre", "passenger-km") */
  unit: string;
  /** Start of the reporting period (ISO date string, e.g., "2024-01-01") */
  startDate: string;
  /** End of the reporting period (ISO date string, e.g., "2024-03-31") */
  endDate: string;
}

/**
 * An emission factor converts an activity quantity into CO2 equivalent emissions.
 *
 * Factors are region-specific (e.g., electricity in Germany vs France has different
 * carbon intensity) and time-bound (updated annually as energy grids evolve).
 *
 * The core formula is: co2eKg = quantity * factor
 * For example: 1000 kWh * 0.485 kg CO2e/kWh = 485 kg CO2e
 */
export interface EmissionFactor {
  /** Unique identifier */
  id: string;
  /** The activity type this factor applies to (e.g., "electricity", "diesel") */
  activityType: string;
  /** The conversion multiplier: co2eKg = quantity * factor */
  factor: number;
  /** Expected input unit (e.g., "kWh") - should match the ActivityEntry's unit */
  inputUnit: string;
  /** Output unit, always "kg CO2e" */
  outputUnit: string;
  /** Region code this factor applies to (e.g., "DE", "FR", "EU", "GLOBAL") */
  region: string;
  /** Start of validity period (ISO date string) */
  validFrom: string;
  /** End of validity period (ISO date string) */
  validTo: string;
}

/**
 * The result of calculating emissions for a single activity entry.
 */
export interface CalculationResult {
  /** The ID of the ActivityEntry this result was calculated from */
  entryId: string;
  /** The organization this result belongs to */
  organizationId: string;
  /** Calculated CO2 equivalent emissions in kilograms */
  co2eKg: number;
  /** Timestamp when this calculation was performed */
  calculatedAt: Date;
}

/**
 * Result of a bulk import operation.
 *
 * Contains both successful calculations and detailed errors for entries that
 * failed validation or processing. Consumers use `errors` to generate a report
 * for the customer showing which rows in their upload need to be fixed.
 */
export interface BulkImportResult {
  /** Successfully calculated entries */
  successful: CalculationResult[];
  /** Entries that failed, with the row index (0-based) and a human-readable error message */
  errors: { row: number; message: string }[];
}
