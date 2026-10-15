import { DataSource } from 'typeorm';
const isLiveApp =
  process.env.ENVIRONMENT === 'production' &&
  process.env.IS_LOCAL_MACHINE !== 'true';

export default new DataSource(
  isLiveApp
    ? {
        type: 'postgres',
        url: process.env.DB_URL,
        entities: ['**/*.entity.js'],
        migrations: [__dirname + '/src/migrations/**/*{.js,.ts}'],
      }
    : {
        type: 'postgres',
        database: process.env.DB_NAME,
        host: 'localhost',
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWD,
        entities: ['**/*.entity.js'],
        migrations: [__dirname + '/src/migrations/**/*{.js,.ts}'],
      },
);
