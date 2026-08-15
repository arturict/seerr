import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOidcSubject1784000000000 implements MigrationInterface {
  name = 'AddOidcSubject1784000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "oidcSubject" varchar`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_user_oidc_subject" ON "user" ("oidcSubject") WHERE "oidcSubject" IS NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_user_oidc_subject"`);
    // SQLite cannot drop a column without rebuilding the table. Keep the nullable
    // column on downgrade; removing the unique index fully disables its behavior.
  }
}
