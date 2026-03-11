import { EMISSION_FACTORS } from './data/emission-factors';
import { EmissionFactor } from './types';

export class EmissionFactorRepository {
  getAll(): EmissionFactor[] {
    return EMISSION_FACTORS;
  }

  findByActivityAndRegion(activityType: string, region: string): EmissionFactor | undefined {
    return this.getAll().find(
      (ef) => ef.activityType === activityType && ef.region === region,
    );
  }
}
