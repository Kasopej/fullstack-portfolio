import { InternalServerErrorException } from '@nestjs/common';
import { PageViewQueryDto } from './analytics.dto';

const url = 'https://eu.posthog.com/api/projects/169348/query/';
const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Bearer ' + process.env.POSTHOG_API_KEY,
};
type PosthogQueryResponse<Column extends ReadonlyArray<unknown> = []> = {
  columns: string[];
  types: string[];
  results: Array<[...Column]>;
  query: {
    kind: string;
    query: string;
  };
  code?: string;
};

export async function pageviewsQuery({
  range,
  timezone = 'UTC',
}: PageViewQueryDto) {
  console.log({ timezone });
  try {
    const config = {
      daily: {
        select: `toStartOfHour(toTimeZone(timestamp, '${timezone}')) AS period`,
        where: `
          timestamp >= now() - INTERVAL 24 HOUR
          AND timestamp < now()
        `,
        name: 'hourly pageviews (last 24h)',
      },
      weekly: {
        select: `toDate(toTimeZone(timestamp, '${timezone}')) AS period`,
        where: `
          timestamp >= date_trunc('week', now())
          AND timestamp < date_trunc('week', now()) + INTERVAL 1 WEEK
        `,
        name: 'daily pageviews (Mon-Sun)',
      },
      monthly: {
        select: `toStartOfMonth(toTimeZone(timestamp, '${timezone}')) AS period`,
        where: `
          timestamp >= date_trunc('month', now()) - INTERVAL 11 MONTH
          AND timestamp < date_trunc('month', now()) + INTERVAL 1 MONTH
        `,
        name: 'monthly pageviews (last 12 months)',
      },
    }[range];
    if (!config) return [];
    console.log({ config });

    const payload = {
      query: {
        kind: 'HogQLQuery',
        query: `
          SELECT
            ${config.select},
            count(*) AS pageviews
          FROM events
          WHERE
            event = '$pageview'
            AND ${config.where}
          GROUP BY period
          ORDER BY period ASC
        `,
      },
      name: config.name,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as PosthogQueryResponse<
      [string, number]
    >;
    if (!Array.isArray(data.results)) {
      throw new Error(data.code);
    }
    return data.results;
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException('Posthog query failed');
  }
}

export async function pageviewsQueryByDevice({ range }: PageViewQueryDto) {
  try {
    const config = {
      daily: {
        where: `
          timestamp >= now() - INTERVAL 24 HOUR
          AND timestamp < now()
        `,
        name: 'pageviews by device type (current day)',
      },
      weekly: {
        where: `
          timestamp >= date_trunc('week', now())
          AND timestamp < date_trunc('week', now()) + INTERVAL 1 WEEK
        `,
        name: 'pageviews by device type (current week)',
      },
      monthly: {
        where: `
          timestamp >= date_trunc('month', now()) - INTERVAL 11 MONTH
          AND timestamp < date_trunc('month', now()) + INTERVAL 1 MONTH
        `,
        name: 'pageviews by device type (last 12 months)',
      },
    }[range];
    if (!config) return [];

    const payload = {
      query: {
        kind: 'HogQLQuery',
        query: `
          SELECT
            coalesce(properties.$device_type, 'Unknown') AS device_type,
            count(*) AS pageviews
          FROM events
          WHERE
            event = '$pageview'
            AND ${config.where}
          GROUP BY device_type
          ORDER BY pageviews DESC
        `,
      },
      name: config.name,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as PosthogQueryResponse<
      [string, number]
    >;
    if (!data.results) throw new Error(data.code);
    return data.results;
  } catch {
    throw new InternalServerErrorException('Posthog query failed');
  }
}
