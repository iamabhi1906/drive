import { Tag } from './../../tags/entities/tag.entity';
import { setSeederFactory } from 'typeorm-extension';

export const userFactory = setSeederFactory(Tag, (faker) => {
  const label = new Tag();
  label.name = faker.lorem.word();
  return label;
});
