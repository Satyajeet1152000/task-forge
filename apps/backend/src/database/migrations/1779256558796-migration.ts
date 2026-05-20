import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1779256558796 implements MigrationInterface {
    name = 'Migration1779256558796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "member_invites" ("id" BIGSERIAL NOT NULL, "code" character varying(6) NOT NULL, "invited_by_id" bigint NOT NULL, "email" character varying(320), "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "max_uses" integer, "used_count" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a212d4e4ebed348ef682b931257" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_member_invites_code" ON "member_invites"  ("code") `);
        await queryRunner.query(`CREATE INDEX "idx_member_invites_invited_by_id" ON "member_invites"  ("invited_by_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_member_invites_invited_by_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_member_invites_code"`);
        await queryRunner.query(`DROP TABLE "member_invites"`);
    }

}
