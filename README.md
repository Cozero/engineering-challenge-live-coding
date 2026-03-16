# GreenMetrica - Emission Calculator

A simplified emission calculation module for a B2B carbon accounting platform. Organizations track their activity data (energy consumption, travel, fuel use, etc.), and this module applies **emission factors** to convert those activities into CO2 equivalent (CO2e) emissions.

## Domain Context

### What is an Emission Factor?

An emission factor is a coefficient that converts an activity quantity into greenhouse gas emissions. For example:

- **Electricity in Germany:** 0.485 kg CO2e per kWh — consuming 1,000 kWh produces 485 kg CO2e
- **Diesel (global):** 2.68 kg CO2e per litre — burning 100 litres produces 268 kg CO2e
- **Short-haul flight (global):** 0.255 kg CO2e per passenger-km

Emission factors vary by **region** (Germany's electricity grid is more carbon-intensive than France's) and by **time period** (they're updated annually as energy grids evolve).

### How Region Mapping Works

Each activity entry has a `locationId` in the format `{country}-{city}-{id}`, e.g., `"de-berlin-001"`. The region is extracted by taking the part before the first hyphen and uppercasing it: `"de-berlin-001"` becomes `"DE"`. This region code is then used to look up the matching emission factor.

## Architecture

```
src/
  types.ts                         # All TypeScript interfaces
  emission-calculator.ts           # Core calculation logic (your focus)
  emission-factor.repository.ts    # Data access layer for emission factors
  data/
    emission-factors.ts            # In-memory emission factor dataset
  __tests__/
    emission-calculator.test.ts    # Existing test suite
```

### How the pieces fit together

1. **`EmissionFactorRepository`** provides access to emission factor data. It has two methods:
   - `getAll()` — returns all emission factors
   - `findByActivityAndRegion(activityType, region)` — finds a specific factor by activity type and region code

2. **`EmissionCalculator`** is the main class consumers interact with. It currently has two methods:
   - `calculate(entries)` — takes activity entries, looks up emission factors, and returns calculation results with CO2e values
   - `getTotals(entries)` — calls `calculate()` internally, then aggregates the results into totals by activity type

3. **Consumers** (API controllers, import pipelines, reporting services) call `EmissionCalculator` methods with arrays of `ActivityEntry` objects and receive back either individual results or aggregated totals.

### Who calls this code?

In a real system, this class would be used by:

- **API endpoints** that receive activity data from the frontend and return calculated emissions
- **Bulk import pipelines** that process CSV/Excel uploads from customers with thousands of activity entries
- **Reporting services** that aggregate emissions across an organization for compliance reporting

## Setup

```bash
npm install
npm test    # Runs 3 existing tests — all should pass
```

## Your Tasks

### Part 1: Code Review (~15 min)

Review the code in `src/`. Focus on:

- **Code quality:** types, structure, readability
- **Correctness:** does the logic handle edge cases?
- **Performance:** what happens with large datasets (10,000+ entries)?
- **Testability:** could you easily unit test this class in isolation?
- **Maintainability:** what would make this code hard to change or debug later?

Be ready to discuss what you'd improve and why, prioritized by impact.

### Part 2: Implement `processBulkImport` (~25 min)

Add a `processBulkImport(entries: ActivityEntry[]): BulkImportResult` method to the `EmissionCalculator` class.

#### Context

Customers upload CSV files with thousands of activity entries (energy bills, travel records, fuel purchases). These uploads need to be processed in bulk. Unlike `calculate()`, which is called from internal API handlers with pre-validated data, `processBulkImport` receives **raw, unvalidated input** — entries may have missing fields, invalid values, or duplicates.

The method must process all valid entries while collecting detailed errors for invalid ones, so the customer can fix and re-upload the failures.

#### Requirements

The method should:

1. **Validate each entry:**
   - All required fields must be present (`id`, `organizationId`, `locationId`, `activityType`, `quantity`, `unit`, `startDate`, `endDate`)
   - `quantity` must be a positive number
   - Collect a descriptive error (with row index and reason) for each invalid entry

2. **Deduplicate:**
   - If the same `entry.id` appears more than once, process only the first occurrence
   - Report subsequent duplicates as errors

3. **Calculate emissions for valid entries:**
   - Look up the emission factor by activity type and region (derived from `locationId`)
   - If no emission factor is found, report it as an error for that row
   - Compute `co2eKg = quantity * factor`

4. **Return a `BulkImportResult`** (defined in `types.ts`):
   - `successful`: array of `CalculationResult` for all valid, calculated entries
   - `errors`: array of `{ row: number; message: string }` for every entry that failed validation, was a duplicate, or had no matching emission factor

5. **Handle scale efficiently:**
   - Should handle 10,000+ entries without performance degradation
   - Think about the time complexity of your lookups

6. **Write tests** for your implementation covering:
   - Happy path with valid entries
   - Entries with missing/invalid fields
   - Duplicate entry IDs
   - Unknown activity types (no matching emission factor)
   - Empty input

#### Interfaces

All interfaces are defined in `src/types.ts`. Here's a quick reference:

```typescript
// Input
interface ActivityEntry {
  id: string;              // Unique identifier
  organizationId: string;  // Which organization this belongs to
  locationId: string;      // Format: "{country}-{city}-{id}", e.g., "de-berlin-001"
  activityType: string;    // e.g., "electricity", "natural_gas", "diesel"
  quantity: number;        // Amount consumed in the specified unit
  unit: string;            // e.g., "kWh", "m3", "litre"
  startDate: string;       // ISO date, e.g., "2024-01-01"
  endDate: string;         // ISO date, e.g., "2024-03-31"
}

// Output
interface BulkImportResult {
  successful: CalculationResult[];
  errors: { row: number; message: string }[];
}

interface CalculationResult {
  entryId: string;
  organizationId: string;
  co2eKg: number;
  calculatedAt: Date;
}
```

Feel free to refactor existing code as needed.
