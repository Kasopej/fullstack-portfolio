export interface WebAnalyticsData {
  visitors: BounceRate
  pageviews: BounceRate
  sessions: BounceRate
  bounce_rate: BounceRate
  avg_session_duration: AvgSessionDuration
  top_pages: TopPage[]
  top_sources: TopSource[]
  goals: Goal[]
  dashboard_url: string
}

export interface AvgSessionDuration {
  current: string
  previous: string
  change: Change
}

export interface Change {
  percent: number
  direction: string
  color: string
  text: string
  long_text: string
}

export interface BounceRate {
  current: number
  previous: number
  change: Change
}

export interface Goal {
  name: string
  conversions: number
  change: Change
}

export interface TopPage {
  host: string
  path: string
  visitors: number
  change: Change
}

export interface TopSource {
  name: string
  visitors: number
  change: Change
}
