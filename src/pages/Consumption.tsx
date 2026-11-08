/**
 * "Mi consumo" (KAN-353): kWh per day and tariff band for one month, the change against the month
 * before, the estimated readings, and the 30-minute curve of a chosen day.
 */

import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ApiError, getMyDailyConsumption, getMyIntervals } from '../api/client'
import type { DailyBandConsumption, IntervalConsumption, TariffBand } from '../api/types'
import {
  BANDS,
  monthTotals,
  pivotByDay,
  previousMonth,
  variationPct,
  type DayRow,
} from '../consumption/summary'

const BAND_LABEL: Record<TariffBand, string> = {
  'off-peak': 'Valle',
  intermediate: 'Intermedia',
  peak: 'Pico',
}

const BAND_COLOR: Record<TariffBand, string> = {
  'off-peak': '#0b6e8a',
  intermediate: '#8ab4c4',
  peak: '#b8336a',
}

/**
 * Current month as `YYYY-MM`.
 *
 * @returns The month of today.
 */
function currentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Loads the daily consumption of the month shown and of the month before.
 *
 * @param month Month as `YYYY-MM`.
 * @returns The rows of both months.
 */
async function loadMonths(month: string): Promise<{
  days: DailyBandConsumption[]
  previousDays: DailyBandConsumption[]
}> {
  const [current, previous] = await Promise.all([
    getMyDailyConsumption(month),
    getMyDailyConsumption(previousMonth(month)),
  ])
  return { days: current.days, previousDays: previous.days }
}

/**
 * Shows the 30-minute curve of one day.
 *
 * @param props Day to show and the intervals already loaded for it.
 * @returns The line chart of the day with its estimated half hours counted.
 */
function DayCurve({ intervals }: { intervals: IntervalConsumption[] }) {
  const data = intervals.map((interval) => ({
    time: interval.start.includes('T') ? interval.start.slice(11, 16) : interval.start,
    kwh: Number(interval.energy_kwh),
  }))
  const estimated = intervals.filter((interval) => interval.estimated).length

  return (
    <section aria-label="Curva del día">
      <p>
        Media hora a media hora.{' '}
        {estimated > 0 ? `${estimated} lecturas estimadas.` : 'Sin lecturas estimadas.'}
      </p>
      <LineChart width={640} height={240} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" interval={5} />
        <YAxis unit=" kWh" />
        <Tooltip />
        <Line type="monotone" dataKey="kwh" stroke="#0b6e8a" dot={false} />
      </LineChart>
    </section>
  )
}

/**
 * Consumption page of the customer.
 *
 * @returns The month view with the chart, the totals and the day selector.
 */
export default function Consumption() {
  const [month, setMonth] = useState(currentMonth)
  const [rows, setRows] = useState<DayRow[] | null>(null)
  const [totals, setTotals] = useState<{ energy: number; previous: number; cost: number } | null>(
    null,
  )
  const [error, setError] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [intervals, setIntervals] = useState<IntervalConsumption[] | null>(null)

  useEffect(() => {
    let active = true
    loadMonths(month)
      .then(({ days, previousDays }) => {
        if (!active) return
        setError(null)
        const current = monthTotals(days)
        setRows(pivotByDay(days))
        setTotals({
          energy: current.energyKwh,
          previous: monthTotals(previousDays).energyKwh,
          cost: current.cost,
        })
        setSelectedDay(null)
        setIntervals(null)
      })
      .catch((caught: unknown) => {
        if (!active) return
        setError(
          caught instanceof ApiError
            ? caught.message
            : 'No pudimos cargar tu consumo. Revisa tu conexión.',
        )
        setRows(null)
      })
    return () => {
      active = false
    }
  }, [month])

  async function showDay(date: string) {
    setSelectedDay(date)
    setIntervals(null)
    try {
      const response = await getMyIntervals(date)
      setIntervals(response.intervals)
    } catch (caught: unknown) {
      setError(caught instanceof ApiError ? caught.message : 'No pudimos cargar la curva del día.')
    }
  }

  const change = totals ? variationPct(totals.energy, totals.previous) : null

  return (
    <main>
      <header className="app-header">
        <h1>Mi consumo</h1>
        <label>
          Mes{' '}
          <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
        </label>
      </header>

      {error !== null && <p role="alert">{error}</p>}

      {totals !== null && (
        <section aria-label="Totales del mes">
          <p>
            Total del mes: <strong>{totals.energy.toFixed(1)} kWh</strong> · Costo:{' '}
            <strong>{totals.cost.toFixed(0)}</strong>
          </p>
          <p>
            {change === null
              ? 'Sin consumo en el mes anterior para comparar.'
              : `${change >= 0 ? 'Subió' : 'Bajó'} ${Math.abs(change).toFixed(1)}% frente al mes anterior.`}
          </p>
        </section>
      )}

      {rows !== null && rows.length > 0 && (
        <BarChart width={640} height={300} data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis unit=" kWh" />
          <Tooltip />
          <Legend />
          {BANDS.map((band) => (
            <Bar
              key={band}
              dataKey={band}
              name={BAND_LABEL[band]}
              stackId="energy"
              fill={BAND_COLOR[band]}
            />
          ))}
        </BarChart>
      )}

      {rows !== null && rows.length === 0 && <p>No hay lecturas para este mes.</p>}

      {rows !== null && rows.length > 0 && (
        <table>
          <thead>
            <tr>
              <th scope="col">Día</th>
              <th scope="col">kWh</th>
              <th scope="col">Lecturas estimadas</th>
              <th scope="col">Curva</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.date}>
                <td>{row.date}</td>
                <td>{row.total.toFixed(1)}</td>
                <td>{row.estimatedReadings > 0 ? `Sí (${row.estimatedReadings})` : 'No'}</td>
                <td>
                  <button type="button" onClick={() => void showDay(row.date)}>
                    Ver curva
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedDay !== null && (
        <section aria-label={`Curva del ${selectedDay}`}>
          <h2>Curva del {selectedDay}</h2>
          {intervals === null ? <p>Cargando curva…</p> : <DayCurve intervals={intervals} />}
        </section>
      )}
    </main>
  )
}
