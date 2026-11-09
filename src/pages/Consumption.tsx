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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ApiError, getMyDailyConsumption, getMyIntervals } from '../api/client'
import type { DailyBandConsumption, IntervalConsumption, TariffBand } from '../api/types'
import Icon from '../components/Icon'
import {
  BANDS,
  monthTotals,
  pivotByDay,
  previousMonth,
  variationPct,
  type DayRow,
} from '../consumption/summary'
import { useI18n } from '../i18n/I18nContext'

const BAND_COLOR: Record<TariffBand, string> = {
  'off-peak': 'var(--chart-off-peak)',
  intermediate: 'var(--chart-intermediate)',
  peak: 'var(--chart-peak)',
}

const TOOLTIP_STYLE = {
  background: 'var(--surface-strong)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  boxShadow: 'var(--shadow-soft)',
  color: 'var(--text-strong)',
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
  const { t } = useI18n()
  const data = intervals.map((interval) => ({
    time: interval.start.includes('T') ? interval.start.slice(11, 16) : interval.start,
    kwh: Number(interval.energy_kwh),
  }))
  const estimated = intervals.filter((interval) => interval.estimated).length

  return (
    <section aria-label={t('consumption.curveTitle')}>
      <p className="card-hint">
        {t('consumption.curveIntro')}{' '}
        {estimated > 0
          ? `${estimated} ${t('consumption.estimatedSuffix')}`
          : t('consumption.noneEstimated')}
      </p>
      <div className="chart-frame">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="4 6" stroke="var(--grid-line)" vertical={false} />
            <XAxis
              dataKey="time"
              interval={5}
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--grid-line)' }}
              tickLine={false}
            />
            <YAxis
              unit=" kWh"
              tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: 'var(--border-strong)' }} />
            <Line
              type="monotone"
              dataKey="kwh"
              stroke="var(--chart-line)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: 'var(--accent)', stroke: 'var(--surface-strong)' }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

/**
 * Consumption page of the customer.
 *
 * @returns The month view with the chart, the totals and the day selector.
 */
export default function Consumption() {
  const { t } = useI18n()
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
        setError(caught instanceof ApiError ? caught.message : t('consumption.error'))
        setRows(null)
      })
    return () => {
      active = false
    }
  }, [month, t])

  async function showDay(date: string) {
    setSelectedDay(date)
    setIntervals(null)
    try {
      const response = await getMyIntervals(date)
      setIntervals(response.intervals)
    } catch (caught: unknown) {
      setError(caught instanceof ApiError ? caught.message : t('consumption.curveError'))
    }
  }

  const change = totals ? variationPct(totals.energy, totals.previous) : null

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{t('consumption.eyebrow')}</p>
          <h1>{t('consumption.title')}</h1>
          <p className="page-subtitle">{t('consumption.subtitle')}</p>
        </div>
        <label className="month-field">
          <span>{t('consumption.month')}</span>
          <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
        </label>
      </header>

      {error !== null && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      {totals !== null && (
        <section className="stat-grid" aria-label={t('consumption.total')}>
          <article className="stat-card is-highlight">
            <span className="stat-icon">
              <Icon name="bolt" size={20} />
            </span>
            <p className="stat-label">{t('consumption.total')}</p>
            <p className="stat-value">
              {totals.energy.toFixed(1)} <span className="stat-unit">kWh</span>
            </p>
            {change !== null && (
              <p className={change >= 0 ? 'trend is-up' : 'trend is-down'}>
                {change >= 0 ? t('consumption.up') : t('consumption.down')}{' '}
                {Math.abs(change).toFixed(1)}%
              </p>
            )}
          </article>

          <article className="stat-card">
            <span className="stat-icon">
              <Icon name="contract" size={20} />
            </span>
            <p className="stat-label">{t('consumption.cost')}</p>
            <p className="stat-value">{totals.cost.toFixed(0)}</p>
            <p className="stat-caption">{month}</p>
          </article>

          <article className="stat-card">
            <span className="stat-icon">
              <Icon name="gauge" size={20} />
            </span>
            <p className="stat-label">{t('consumption.comparison')}</p>
            <p className="stat-text">
              {change === null
                ? t('consumption.noPrevious')
                : `${Math.abs(change).toFixed(1)}% ${t('consumption.changeSuffix')}`}
            </p>
          </article>
        </section>
      )}

      {rows !== null && rows.length > 0 && (
        <section className="card chart-card">
          <div className="card-heading">
            <div>
              <h2>{t('consumption.chartTitle')}</h2>
              <p className="card-hint">{t('consumption.chartHint')}</p>
            </div>
            <span className="badge">{month}</span>
          </div>
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rows} barCategoryGap="24%">
                <CartesianGrid strokeDasharray="4 6" stroke="var(--grid-line)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--grid-line)' }}
                  tickLine={false}
                  tickFormatter={(value: string) => value.slice(8)}
                />
                <YAxis
                  unit=" kWh"
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ fill: 'var(--primary-soft)' }}
                  labelFormatter={(value) => value}
                />
                <Legend
                  iconType="circle"
                  itemSorter={null}
                  wrapperStyle={{ color: 'var(--text-muted)', fontSize: 13, paddingTop: 12 }}
                />
                {BANDS.map((band) => (
                  <Bar
                    key={band}
                    dataKey={band}
                    name={t(`band.${band}`)}
                    stackId="energy"
                    fill={BAND_COLOR[band]}
                    radius={[band === 'peak' ? 6 : 0, band === 'peak' ? 6 : 0, 0, 0]}
                    isAnimationActive={false}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {rows !== null && rows.length === 0 && (
        <div className="card empty-state">
          <Icon name="consumption" size={28} />
          <p>{t('consumption.noReadings')}</p>
        </div>
      )}

      {rows !== null && rows.length > 0 && (
        <section className="card table-card">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">{t('consumption.tableDay')}</th>
                  <th scope="col">{t('consumption.tableKwh')}</th>
                  <th scope="col">{t('consumption.tableEstimated')}</th>
                  <th scope="col">{t('consumption.tableCurve')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.date}>
                    <td>{row.date}</td>
                    <td className="cell-number">{row.total.toFixed(1)}</td>
                    <td>
                      {row.estimatedReadings > 0
                        ? `${t('consumption.yes')} (${row.estimatedReadings})`
                        : t('consumption.no')}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="button button-ghost button-small"
                        onClick={() => void showDay(row.date)}
                      >
                        {t('consumption.viewCurve')}
                        <Icon name="arrowRight" size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selectedDay !== null && (
        <section
          className="card chart-card"
          aria-label={`${t('consumption.curveTitle')} ${selectedDay}`}
        >
          <div className="card-heading">
            <div>
              <h2>
                {t('consumption.curveTitle')} {selectedDay}
              </h2>
            </div>
            <span className="badge">{selectedDay}</span>
          </div>
          {intervals === null ? (
            <p className="card-hint">{t('consumption.curveLoading')}</p>
          ) : (
            <DayCurve intervals={intervals} />
          )}
        </section>
      )}
    </main>
  )
}
