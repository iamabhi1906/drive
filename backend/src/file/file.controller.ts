import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { type AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { MAX_FILE_SIZE_BYTES } from './file.constants';
import { ListFilesDto } from './dto/list-files.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { FileService } from './file.service';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: UploadFileDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const uploadedFile = await this.fileService.upload(
      file,
      dto,
      request.user.sub,
    );
    return {
      status: 'success',
      message: 'File uploaded successfully',
      file: uploadedFile,
    };
  }

  @Get()
  async getFiles(
    @Query() query: ListFilesDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const result = await this.fileService.findAll(request.user.sub, query);
    return result;
  }

  @Get(':id')
  async getFile(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const file = await this.fileService.findOne(id, request.user.sub);
    return file;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFile(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.fileService.remove(id, request.user.sub);
  }
}
