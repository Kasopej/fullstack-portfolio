import { MigrationInterface, QueryRunner } from "typeorm";

export class AppMigration1792031720783 implements MigrationInterface {
    name = 'AppMigration1792031720783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "UQ_48ce552495d14eae9b187bb6716"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "name" "public"."permissions_name_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "UQ_48ce552495d14eae9b187bb6716"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD "name" permissions_name_enum NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name")`);
    }

}
