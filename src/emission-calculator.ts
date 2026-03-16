import { EmissionFactorRepository } from './emission-factor.repository';

const repo = new EmissionFactorRepository();

/**
 * Core calculation engine for converting activity data into CO2e emissions.
 *
 * Used by API controllers, bulk import pipelines, and reporting services
 * to calculate and aggregate emission results for customer organizations.
 *
 * The calculation formula is: co2eKg = quantity * emissionFactor
 * where the emission factor is looked up by activity type and region.
 */
export class EmissionCalculator {
  /**
   * Calculates CO2e emissions for a list of activity entries.
   *
   * For each entry:
   * 1. Extracts the region from locationId (e.g., "de-berlin-001" -> "DE")
   * 2. Looks up the emission factor for that activity type + region
   * 3. Computes co2eKg = quantity * factor
   *
   * Entries are processed in chronological order by startDate.
   * Entries with no matching emission factor are skipped.
   *
   * @param entries - Array of activity entries to calculate emissions for
   * @returns Array of calculation results with CO2e values
   */
  calculate(entries: any[]): any[] {
    const results: any[] = [];

    entries.sort((a: any, b: any) => a.startDate.localeCompare(b.startDate));

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const region = entry.locationId.split('-')[0].toUpperCase();
      const factor = repo.findByActivityAndRegion(entry.activityType, region);

      if (!factor) {
        console.log('No emission factor found for ' + entry.activityType + ' in ' + region);
        continue;
      }

      let co2e = entry.quantity * factor.factor;

      // Large quantity correction
      if (co2e > 10000) {
        co2e = co2e * 0.95;
      }

      results.push({
        entryId: entry.id,
        organizationId: entry.organizationId,
        co2eKg: co2e,
        calculatedAt: new Date(),
      });
    }

    return results;
  }

  /**
   * Calculates emissions and returns aggregated totals.
   *
   * Calls calculate() internally, then groups results by activity type
   * and sums up total CO2e emissions across all entries.
   *
   * @param entries - Array of activity entries
   * @returns Object with total CO2e, breakdown by activity type, and entry count
   */
  getTotals(entries: any[]): any {
    const results = this.calculate(entries);

    let total = 0;
    const byType: any = {};

    for (const r of results) {
      total += r.co2eKg;

      const entry = entries.find((e: any) => e.id === r.entryId);
      if (entry) {
        if (!byType[entry.activityType]) {
          byType[entry.activityType] = 0;
        }
        byType[entry.activityType] += r.co2eKg;
      }
    }

    return {
      total: total,
      byActivityType: byType,
      count: results.length,
    };
  }
}
