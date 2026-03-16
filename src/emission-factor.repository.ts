import { EMISSION_FACTORS } from './data/emission-factors';
import { EmissionFactor } from './types';

/**
 * Provides read access to the emission factor dataset.
 *
 * In a real system, this would query a database. Here it wraps an in-memory
 * array for simplicity. The repository pattern decouples data access from
 * business logic, allowing the data source to be swapped or mocked in tests.
 */
export class EmissionFactorRepository {
  /**
   * Returns all available emission factors.
   */
  getAll(): EmissionFactor[] {
    return EMISSION_FACTORS;
  }

  /**
   * Finds an emission factor matching the given activity type and region.
   * Returns undefined if no match is found.
   *
   * @param activityType - e.g., "electricity", "natural_gas", "diesel"
   * @param region - e.g., "DE", "FR", "EU", "GLOBAL"
   */
  findByActivityAndRegion(activityType: string, region: string): EmissionFactor | undefined {
    return this.getAll().find(
      (ef) => ef.activityType === activityType && ef.region === region,
    );
  }
}
