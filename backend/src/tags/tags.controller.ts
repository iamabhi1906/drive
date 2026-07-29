import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { TagsQueryDTO } from './dto/tags.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllTags(@Query() query: TagsQueryDTO) {
    return await this.tagsService.getTags(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getTag(@Param('id') id: string) {
    return await this.tagsService.getTag(Number(id));
  }

  @Get(':name/name')
  @UseGuards(JwtAuthGuard)
  async getTagByName(@Param('name') name: string) {
    return await this.tagsService.getTagByName(name);
  }
}
