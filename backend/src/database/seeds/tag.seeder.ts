import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Tag } from './../../tags/entities/tag.entity';

export class LabelSeeder implements Seeder {
  public async run(
    _dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const labelFactory = factoryManager.get(Tag);
    await labelFactory.saveMany(10);
  }
}
