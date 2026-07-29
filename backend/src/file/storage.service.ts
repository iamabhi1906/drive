import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { extname, join } from 'path';
import { STORAGE_DIRECTORY, STORAGE_PATH_PREFIX } from './file.constants';

export interface StoredFile {
  storedName: string;
  storagePath: string;
}

@Injectable()
export class StorageService {
  private readonly storageDirectory = join(process.cwd(), STORAGE_DIRECTORY);

  async saveFile(file: Express.Multer.File): Promise<StoredFile> {
    await fs.mkdir(this.storageDirectory, { recursive: true });
    const extension = this.getSafeExtension(file.originalname);
    const storedName = `${randomUUID()}${extension}`;
    try {
      await fs.writeFile(join(this.storageDirectory, storedName), file.buffer, {
        flag: 'wx',
      });
      return {
        storedName,
        storagePath: `${STORAGE_PATH_PREFIX}/${storedName}`,
      };
    } catch (error: unknown) {
      console.log(error);
      throw new InternalServerErrorException('Unable to save uploaded file');
    }
  }

  async deleteFile(storagePath: string): Promise<void> {
    const storedName = storagePath.split('/').pop();
    if (!storedName) return;

    await fs.unlink(join(this.storageDirectory, storedName));
  }

  private getSafeExtension(originalName: string): string {
    const extension = extname(originalName).toLowerCase();
    return /^\.[a-z0-9]{1,10}$/.test(extension) ? extension : '';
  }
}
