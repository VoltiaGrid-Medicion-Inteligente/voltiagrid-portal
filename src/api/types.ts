/**
 * TypeScript types of the responses of the VoltiaGrid customer consumption API.
 *
 * They mirror the OpenAPI contract in `voltiagrid-api` (`docs/openapi/customer-consumption.json`).
 * Decimal values travel as strings.
 */

/** Body of `POST /auth/token`, the credentials of a customer or internal user. */
export interface TokenRequest {
  username: string
  password: string
}

/** Response of `POST /auth/token`: the bearer token issued by the API. */
export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

/** One invalid field reported by a `422` response. */
export interface FieldError {
  field: string
  message: string
}

/** The single error body every VoltiaGrid API returns. */
export interface ErrorResponse {
  detail: string
  errors?: FieldError[] | null
}

/** Health check response of the API. */
export interface Health {
  status: 'ok'
}

/** Tariff band of a consumption reading. */
export type TariffBand = 'peak' | 'intermediate' | 'off-peak'

/** Daily consumption per tariff band of a customer. */
export interface DailyBandConsumption {
  date: string
  band_name: TariffBand
  energy_kwh: string
  cost: string
  readings: number
  estimated_readings: number
}

/** Response of the daily consumption endpoint for one month. */
export interface DailyConsumptionResponse {
  customer_code: string
  month: string
  has_estimated_readings: boolean
  days: DailyBandConsumption[]
}

/** Participation of a customer in one demand-response event. */
export interface EventParticipation {
  event_id: string
  event_date: string
  start: string
  end: string
  baseline_kwh: string | null
  actual_kwh: string | null
  savings_kwh: string | null
  savings_pct: string | null
  incentive_paid: boolean
  incentive_amount: string
}

/** Response of the demand-response events endpoint for one month. */
export interface EventsResponse {
  customer_code: string
  month: string
  events: EventParticipation[]
  incentives_total: string
}

/** One half hour of a customer's day: energy in kWh and whether the reading was estimated. */
export interface IntervalConsumption {
  start: string
  band_name: TariffBand
  energy_kwh: string
  estimated: boolean
}

/** Response of `GET /me/consumption/intervals` for one day: 48 half hours. */
export interface IntervalsResponse {
  customer_code: string
  date: string
  intervals: IntervalConsumption[]
}
