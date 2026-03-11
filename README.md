# GreenMetrica - Emission Calculator

A simplified emission calculation module for a B2B carbon accounting platform. Given activity data (energy consumption, travel, etc.), it applies emission factors to compute CO2 equivalent emissions.

## Setup

```bash
npm install
npm test
```

## Your Tasks

### Part 1: Code Review (~15 min)

Review the code in `src/`. Be ready to discuss what you'd improve and why.

### Part 2: Implement Bulk Processing (~25 min)

Add a `processBulkImport(entries: ActivityEntry[]): BulkImportResult` method to the `EmissionCalculator` class.

See `src/types.ts` for the `BulkImportResult` interface.

Requirements:
- Validate each entry (positive quantity, required fields present)
- Skip duplicate entry IDs
- Calculate emissions for valid entries
- Collect errors with row number and reason for invalid entries
- Handle 10,000+ entries efficiently
- Write tests for your implementation
