import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1779245682604 implements MigrationInterface {
    name = 'Migration1779245682604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sub_tasks" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "task_id" bigint NOT NULL, "title" character varying(250) NOT NULL, "is_completed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0028874355f68f2ed21a89c2faf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ad6dddc046db7f75df74aeea72" ON "sub_tasks"  ("user_id", "task_id") `);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "title" character varying(250) NOT NULL, "description" text, "status" character varying(20) NOT NULL DEFAULT 'PENDING', "priority" character varying(20) NOT NULL DEFAULT 'MEDIUM', "start_date" TIMESTAMP WITH TIME ZONE, "due_date" TIMESTAMP WITH TIME ZONE, "sub_tasks" bigint array NOT NULL DEFAULT '{}', "assigned_members" bigint array NOT NULL DEFAULT '{}', "attachments" text array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_db55af84c226af9dce09487b61" ON "tasks"  ("user_id") `);
        await queryRunner.query(`CREATE TABLE "team_members" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "members" bigint array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ca3eae89dcf20c9fd95bf7460aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_team_members_user_id" ON "team_members"  ("user_id") `);
        await queryRunner.query(`ALTER TABLE "users" ADD "assigned_tasks" bigint array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "assigned_tasks"`);
        await queryRunner.query(`DROP INDEX "public"."idx_team_members_user_id"`);
        await queryRunner.query(`DROP TABLE "team_members"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_db55af84c226af9dce09487b61"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad6dddc046db7f75df74aeea72"`);
        await queryRunner.query(`DROP TABLE "sub_tasks"`);
    }

}
