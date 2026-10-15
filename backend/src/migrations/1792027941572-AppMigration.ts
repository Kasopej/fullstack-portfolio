import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppMigration1792027941572 implements MigrationInterface {
  name = 'AppMigration1792027941572';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
