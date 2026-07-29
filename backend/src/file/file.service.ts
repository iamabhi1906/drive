import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ALLOWED_MIME_TYPES } from './file.constants';
import { FileCategory, ListFilesDto } from './dto/list-files.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { File } from './entities/file.entity';
import { StorageService } from './storage.service';
import { Tag } from '../tags/entities/tag.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  async upload(
    file: Express.Multer.File | undefined,
    dto: UploadFileDto,
    userId: string,
  ): Promise<File> {
    this.validateFile(file);
    const [user, tags] = await Promise.all([
      this.getAuthenticatedUser(userId),
      this.findTags(dto.tagIds),
    ]);
    const storedFile = await this.storageService.saveFile(file);

    try {
      const newFile = this.fileRepository.create({
        originalName: file.originalname,
        storedName: storedFile.storedName,
        mimeType: file.mimetype,
        size: file.size,
        storagePath: storedFile.storagePath,
        user,
        tags,
      });
      return await this.fileRepository.save(newFile);
    } catch (error) {
      await this.storageService.deleteFile(storedFile.storagePath);
      throw error;
    }
  }

  async findAll(userId: string, query: ListFilesDto) {
    const { page, limit, search, types = [], tagIds = [] } = query;
    const filesQuery = this.fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.tags', 'tag')
      .where('file.userId = :userId', { userId: Number(userId) });

    if (search) {
      filesQuery.leftJoin('file.tags', 'searchTag');
      filesQuery.andWhere(
        new Brackets((queryBuilder) => {
          queryBuilder
            .where('file.originalName ILIKE :search', { search: `%${search}%` })
            .orWhere('searchTag.name ILIKE :search', { search: `%${search}%` });
        }),
      );
    }
    if (types.length) this.addTypeFilter(filesQuery, types);
    if (tagIds.length) {
      filesQuery
        .leftJoin('file.tags', 'filterTag')
        .andWhere('filterTag.id IN (:...tagIds)', { tagIds });
    }

    const [files, total] = await filesQuery
      .distinct(true)
      .orderBy('file.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      files,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private addTypeFilter(
    queryBuilder: SelectQueryBuilder<File>,
    types: FileCategory[],
  ) {
    const conditions: Record<FileCategory, string> = {
      image: "file.mimeType LIKE 'image/%'",
      pdf: "file.mimeType = 'application/pdf'",
      spreadsheet: "file.mimeType IN ('application/vnd.ms-excel', 'text/csv')",
      presentation: "file.mimeType = 'application/vnd.ms-powerpoint'",
      archive: "file.mimeType = 'application/zip'",
      text: "file.mimeType = 'text/plain'",
      other:
        "file.mimeType NOT LIKE 'image/%' AND file.mimeType NOT IN ('application/pdf', 'application/vnd.ms-excel', 'text/csv', 'application/vnd.ms-powerpoint', 'application/zip', 'text/plain')",
    };
    queryBuilder.andWhere(
      new Brackets((builder) => {
        types.forEach((type, index) => {
          if (index === 0) builder.where(conditions[type]);
          else builder.orWhere(conditions[type]);
        });
      }),
    );
  }

  async findOne(id: number, userId: string): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { id, user: { id: Number(userId) } },
      relations: { tags: true },
    });
    if (!file) throw new NotFoundException('File not found');
    return file;
  }

  async remove(id: number, userId: string): Promise<void> {
    const file = await this.findOne(id, userId);
    await this.storageService.deleteFile(file.storagePath);
    await this.fileRepository.remove(file);
  }

  private validateFile(
    file: Express.Multer.File | undefined,
  ): asserts file is Express.Multer.File {
    if (!file) throw new BadRequestException('File is required');
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype as never)) {
      throw new BadRequestException('File type is not allowed');
    }
  }

  private async getAuthenticatedUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async findTags(tagIds: number[]): Promise<Tag[]> {
    if (tagIds.length === 0) return [];
    const tags = await this.tagRepository.findBy({ id: In(tagIds) });
    if (tags.length !== tagIds.length) {
      throw new BadRequestException('One or more tags do not exist');
    }
    return tags;
  }
}
