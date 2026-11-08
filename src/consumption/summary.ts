/**
 * Calculations of the consumption page: pure functions over the daily rows of the API, so they can be
 * tested without rendering anything.
 */

import type { DailyBandConsumption, TariffBand } from '../api/types'

/** Bands in the order they are stacked in the chart, from the cheapest to the most expensive. */
export const BANDS: readonly TariffBand[] = ['off-peak', 'intermediate', 'peak']

/** One day of the month: kWh per band, the total and how many readings were estimated. */
export interface DayRow {
  date: string
  'off-peak': number
  intermediate: number
  peak: number
  total: number
  estimatedReadings: number
}

/** Totals of a month. */
export interface MonthTotals {
  energyKwh: number
  cost: number
  readings: number
  estimatedReadings: number
}

/**
 * Groups the rows of the API (one per day and band) into one row per day, sorted by date.
 *
 * @param days Rows from `GET /me/consumption/daily`.
 * @returns One row per day with the kWh of each band.
 */
export function pivotByDay(days: DailyBandConsumption[]): DayRow[] {
  const rows = new Map<string, DayRow>()
  for (const day of days) {
    let row = rows.get(day.date)
    if (row === undefined) {
      row = {
        date: day.date,
        'off-peak': 0,
        intermediate: 0,
        peak: 0,
        total: 0,
        estimatedReadings: 0,
      }
      rows.set(day.date, row)
    }
    const kwh = Number(day.energy_kwh)
    row[day.band_name] += kwh
    row.total += kwh
    row.estimatedReadings += day.estimated_readings
  }
  return [...rows.values()].sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Totals of the month: energy, cost, readings and estimated readings.
 *
 * @param days Rows from `GET /me/consumption/daily`.
 * @returns The totals of the month.
 */
export function monthTotals(days: DailyBandConsumption[]): MonthTotals {
  return days.reduce<MonthTotals>(
    (totals, day) => ({
      energyKwh: totals.energyKwh + Number(day.energy_kwh),
      cost: totals.cost + Number(day.cost),
      readings: totals.readings + day.readings,
      estimatedReadings: totals.estimatedReadings + day.estimated_readings,
    }),
    { energyKwh: 0, cost: 0, readings: 0, estimatedReadings: 0 },
  )
}

/**
 * Percentage change from the previous month to the current one.
 *
 * @param current Energy of the month shown.
 * @param previous Energy of the month before.
 * @returns The change in percent, or `null` when the previous month has no energy to compare with.
 */
export function variationPct(current: number, previous: number): number | null {
  if (previous === 0) {
    return null
  }
  return ((current - previous) / previous) * 100
}

/**
 * Month before the given one.
 *
 * @param month Month as `YYYY-MM`.
 * @returns The previous month as `YYYY-MM` (January goes back to December of the year before).
 */
export function previousMonth(month: string): string {
  const [year, number] = month.split('-').map(Number)
  const date = new Date(Date.UTC(year, number - 2, 1))
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}
