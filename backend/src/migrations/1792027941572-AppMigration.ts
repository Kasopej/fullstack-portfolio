import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppMigration1792027941572 implements MigrationInterface {
  name = 'AppMigration1792027941572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const result = await queryRunner.query(`
  SELECT
    current_database() AS database,
    current_schema() AS schema,
    inet_server_addr() AS server_address,
    inet_server_port() AS server_port,
    current_user AS username
`);

    console.log('Migration database:', result);
    await queryRunner.query(`
    ALTER TABLE "posts"
    ALTER COLUMN "title" TYPE VARCHAR(256)
  `);

    await queryRunner.query(`
    ALTER TABLE "posts"
    ALTER COLUMN "description" TYPE VARCHAR(256)
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    ALTER TABLE "posts"
    ALTER COLUMN "description" TYPE VARCHAR(96)
  `);

    await queryRunner.query(`
    ALTER TABLE "posts"
    ALTER COLUMN "title" TYPE VARCHAR(48)
  `);
  }
}
