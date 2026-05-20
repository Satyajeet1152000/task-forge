import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1779293983194 implements MigrationInterface {
    name = 'Migration1779293983194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "start_date"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "start_date" TIMESTAMP WITH TIME ZONE`);
    }

}
