import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOidcSubject1784000000000 implements MigrationInterface {
  name = 'AddOidcSubject1784000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "oidcSubject" character varying`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_user_oidc_subject" ON "user" ("oidcSubject") WHERE "oidcSubject" IS NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_user_oidc_subject"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "oidcSubject"`);
  }
}
