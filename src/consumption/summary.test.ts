/**
 * Tests of the consumption calculations (KAN-353).
 */

import { describe, expect, it } from 'vitest'
import type { DailyBandConsumption } from '../api/types'
import { monthTotals, pivotByDay, previousMonth, variationPct } from './summary'

const row = (
  date: string,
  band: DailyBandConsumption['band_name'],
  kwh: string,
  estimated = 0,
): DailyBandConsumption => ({
  date,
  band_name: band,
  energy_kwh: kwh,
  cost: (Number(kwh) * 0.2).toFixed(2),
  readings: 4,
  estimated_readings: estimated,
})

describe('pivotByDay', () => {
  it('groups the bands of each day into one row and keeps the days in order', () => {
    const rows = pivotByDay([
      row('2013-01-02', 'peak', '1.5', 1),
      row('2013-01-01', 'off-peak', '2.0'),
      row('2013-01-02', 'off-peak', '0.5'),
      row('2013-01-01', 'peak', '1.0'),
    ])

    expect(rows.map((r) => r.date)).toEqual(['2013-01-01', '2013-01-02'])
    expect(rows[0]).toMatchObject({ 'off-peak': 2, peak: 1, intermediate: 0, total: 3 })
    expect(rows[1]).toMatchObject({ 'off-peak': 0.5, peak: 1.5, total: 2, estimatedReadings: 1 })
  })

  it('returns no rows for a month without readings', () => {
    expect(pivotByDay([])).toEqual([])
  })
})

describe('monthTotals', () => {
  it('adds energy, cost, readings and estimated readings of the whole month', () => {
    const totals = monthTotals([
      row('2013-01-01', 'peak', '1.5', 2),
      row('2013-01-02', 'off-peak', '2.5'),
    ])

    expect(totals.energyKwh).toBeCloseTo(4)
    expect(totals.cost).toBeCloseTo(0.8)
    expect(totals.readings).toBe(8)
    expect(totals.estimatedReadings).toBe(2)
  })
})

describe('variationPct', () => {
  it('is the percentage change against the previous month', () => {
    expect(variationPct(120, 100)).toBeCloseTo(20)
    expect(variationPct(80, 100)).toBeCloseTo(-20)
  })

  it('is null when the previous month has no energy', () => {
    expect(variationPct(50, 0)).toBeNull()
  })
})

describe('previousMonth', () => {
  it('goes back one month, across years in January', () => {
    expect(previousMonth('2013-03')).toBe('2013-02')
    expect(previousMonth('2013-01')).toBe('2012-12')
  })
})
