import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1779214525918 implements MigrationInterface {
    name = 'Migration1779214525918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" BIGSERIAL NOT NULL, "name" character varying(150) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255), "image" text, "role" character varying(20) NOT NULL DEFAULT 'USER', "provider" character varying(20) NOT NULL DEFAULT 'CREDENTIALS', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_users_email" ON "users"  ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_users_email"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
