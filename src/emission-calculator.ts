import { EmissionFactorRepository } from './emission-factor.repository';

const repo = new EmissionFactorRepository();

export class EmissionCalculator {
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
