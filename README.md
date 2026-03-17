# GreenMetrica - Emission Calculator

A simplified emission calculation module for a B2B carbon accounting platform. Given activity data (energy consumption, travel, fuel use), it applies **emission factors** to compute CO2 equivalent (CO2e) emissions.

The core formula is: `co2eKg = quantity * emissionFactor`

Emission factors vary by **region** (Germany's grid is more carbon-intensive than France's) and by **activity type** (electricity vs diesel vs flights). Each activity entry has a `locationId` like `"de-berlin-001"` where the prefix before the first hyphen maps to a region code (`"DE"`).

## Setup

```bash
npm install
npm test    # 3 tests pass
```

## File Overview

| File | Purpose |
|------|---------|
| `src/types.ts` | All TypeScript interfaces (read this first) |
| `src/emission-calculator.ts` | Core calculation class with `calculate()` and `getTotals()` |
| `src/emission-factor.repository.ts` | Data access layer for emission factors |
| `src/data/emission-factors.ts` | In-memory emission factor dataset |
| `src/__tests__/emission-calculator.test.ts` | Existing test suite |

## Your Tasks

### Part 1: Code Review (~15 min)

Review the code in `src/`. Walk us through what you'd change and why, focusing on correctness, performance, testability, and maintainability.

### Part 2: Implement `processBulkImport` (~25 min)

Add a `processBulkImport(entries: ActivityEntry[]): BulkImportResult` method to `EmissionCalculator`.

**Context:** Customers upload CSV files with thousands of activity entries. Unlike `calculate()` which receives pre-validated data, this method receives raw input that may have missing fields, invalid values, or duplicates.

**Requirements:**
1. Validate each entry (required fields present, quantity is a positive number)
2. Skip duplicate entry IDs (report as errors)
3. Calculate emissions for valid entries (look up factor by activity type + region)
4. Report errors with row index and reason for each invalid entry
5. Handle 10,000+ entries efficiently
6. Write tests

See `src/types.ts` for `BulkImportResult` and all other interfaces. Feel free to refactor existing code as needed.
