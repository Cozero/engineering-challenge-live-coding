import { EmissionCalculator } from '../emission-calculator';

describe('EmissionCalculator', () => {
  const calculator = new EmissionCalculator();

  const sampleEntries = [
    {
      id: 'entry-1',
      organizationId: 'org-1',
      locationId: 'de-berlin-001',
      activityType: 'electricity',
      quantity: 1000,
      unit: 'kWh',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
    },
    {
      id: 'entry-2',
      organizationId: 'org-1',
      locationId: 'fr-paris-001',
      activityType: 'electricity',
      quantity: 2000,
      unit: 'kWh',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
    },
  ];

  describe('calculate', () => {
    it('should calculate emissions for valid entries', () => {
      const results = calculator.calculate(sampleEntries);

      expect(results).toHaveLength(2);
      expect(results[0].co2eKg).toBe(485);
      expect(results[1].co2eKg).toBe(466);
    });

    it('should return results for known activity types', () => {
      const results = calculator.calculate(sampleEntries);

      expect(results.every((r: any) => r.co2eKg > 0)).toBe(true);
    });
  });

  describe('getTotals', () => {
    it('should return total emissions', () => {
      const totals = calculator.getTotals(sampleEntries);

      expect(totals.total).toBe(951);
      expect(totals.count).toBe(2);
    });
  });
});
