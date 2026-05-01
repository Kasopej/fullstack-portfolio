import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase.guard';
import { buildQuery } from 'src/lib/utils/query.utils';

const url =
  'https://eu.posthog.com/api/environments/169348/web_analytics/weekly_digest';
const headers = {
  accept: 'application/json',
  Authorization: 'Bearer ' + process.env.POSTHOG_API_KEY,
};
@Controller('analytics')
@UseGuards(SupabaseAuthGuard)
export class AnalyticsController {
  @Get('sessions-historical-data')
  async getmixPanelData(@Query() opts: Record<string, unknown>) {
    const params = buildQuery(
      Object.assign({ ...opts }) as Record<string, string>,
    );
    return fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers,
    })
      .then(async (res) => res.json() as Promise<unknown>)
      .catch(() => new InternalServerErrorException());
  }
}
