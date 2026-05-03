import { InternalServerErrorException } from '@nestjs/common';

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

export type PageViewQueryFilter = 'daily' | 'weekly' | 'monthly';

export async function pageviewsQuery(filter: PageViewQueryFilter) {
  try {
    const config = {
      daily: {
        select: 'toStartOfHour(timestamp) AS period',
        where: `
          timestamp >= now() - INTERVAL 24 HOUR
          AND timestamp < now()
        `,
        name: 'hourly pageviews (last 24h)',
      },
      weekly: {
        select: 'toDate(timestamp) AS period',
        where: `
          timestamp >= date_trunc('week', now())
          AND timestamp < date_trunc('week', now()) + INTERVAL 1 WEEK
        `,
        name: 'daily pageviews (Mon-Sun)',
      },
      monthly: {
        select: 'toStartOfMonth(timestamp) AS period',
        where: `
          timestamp >= date_trunc('month', now()) - INTERVAL 11 MONTH
          AND timestamp < date_trunc('month', now()) + INTERVAL 1 MONTH
        `,
        name: 'monthly pageviews (last 12 months)',
      },
    }[filter];

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
    if (!data.results) throw new Error(data.code);
    return data.results;
  } catch {
    throw new InternalServerErrorException('Posthog query failed');
  }
}

export async function pageviewsQueryByDevice(filter: PageViewQueryFilter) {
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
    }[filter];

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
    console.log(data);
    if (!data.results) throw new Error(data.code);
    return data.results;
  } catch {
    throw new InternalServerErrorException('Posthog query failed');
  }
}
