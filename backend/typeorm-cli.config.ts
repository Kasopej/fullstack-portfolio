import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  database: process.env.DB_NAME,
  host: 'localhost',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  entities: ['**/*.entity.js'],
  migrations: [__dirname + '/src/migrations/**/*{.js,.ts}'],
});
