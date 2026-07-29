import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { TagsQueryDTO } from './dto/tags.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async getTags(query: TagsQueryDTO) {
    const { search, page = 1, limit = 10 } = query;
    const qb = this.tagRepository.createQueryBuilder('tags');
    if (search) {
      qb.andWhere('tags.name ILIKE :search', {
        search: `%${search}%`,
      });
    }
    qb.addOrderBy('tags.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);
    const [tags, total] = await qb.getManyAndCount();
    return {
      tags,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTag(id: number): Promise<Tag | null> {
    return this.tagRepository.findOne({ where: { id } });
  }

  async getTagByName(name: string): Promise<Tag | null> {
    return this.tagRepository.findOne({ where: { name } });
  }
}
