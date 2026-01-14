import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, callback) => {
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
        const extname = allowedTypes.test(
          file.originalname.toLowerCase().split('.').pop() || '',
        );
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Apenas imagens (JPG, PNG) e documentos (PDF, DOC) são permitidos',
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: any,
    @Body('userId') userId?: string,
    @Body('description') description?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    return this.uploadsService.saveFileMetadata({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      userId: userId || null,
      description: description || null,
    });
  }
}
