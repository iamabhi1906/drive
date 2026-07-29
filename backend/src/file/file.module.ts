import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { StorageService } from './storage.service';
import { UsersModule } from '../users/users.module';
import { Tag } from '../tags/entities/tag.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([File, Tag]), UsersModule, AuthModule],
  providers: [FileService, StorageService],
  controllers: [FileController],
})
export class FileModule {}
