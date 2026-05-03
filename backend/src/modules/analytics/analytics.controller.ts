import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase.guard';
import {
  PageViewQueryFilter,
  pageviewsQuery,
  pageviewsQueryByDevice,
} from './analytics.queries';

// const url =
//   'https://eu.posthog.com/api/environments/169348/web_analytics/weekly_digest';
// const headers = {
//   accept: 'application/json',
//   Authorization: 'Bearer ' + process.env.POSTHOG_API_KEY,
// };
@Controller('analytics')
@UseGuards(SupabaseAuthGuard)
export class AnalyticsController {
  @Get('sessions-historical-data')
  async getHistoricalSessionsData(
    @Query() opts: Partial<{ days: PageViewQueryFilter }>,
  ) {
    return opts.days ? pageviewsQuery(opts.days) : [];
  }

  @Get('sessions-per-device-type')
  async getHistoricalSessionsDataPerDevice(
    @Query() opts: Partial<{ days: PageViewQueryFilter }>,
  ) {
    return opts.days ? pageviewsQueryByDevice(opts.days) : [];
  }
}
