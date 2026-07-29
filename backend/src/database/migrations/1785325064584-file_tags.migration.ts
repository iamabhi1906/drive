import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class FileTagsMigration1785325064584 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'file_tags',
        columns: [
          { name: 'fileId', type: 'integer', isPrimary: true },
          { name: 'tagId', type: 'integer', isPrimary: true },
        ],
        foreignKeys: [
          {
            columnNames: ['fileId'],
            referencedTableName: 'files',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['tagId'],
            referencedTableName: 'tags',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('file_tags', true);
  }
}
