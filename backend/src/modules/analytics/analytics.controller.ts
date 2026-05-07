import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase.guard';
import { pageviewsQuery, pageviewsQueryByDevice } from './analytics.queries';
import { PageViewQueryDto } from './analytics.dto';

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
  async getHistoricalSessionsData(@Query() opts: PageViewQueryDto) {
    return pageviewsQuery(opts);
  }

  @Get('sessions-per-device-type')
  async getHistoricalSessionsDataPerDevice(@Query() opts: PageViewQueryDto) {
    return pageviewsQueryByDevice(opts);
  }
}
