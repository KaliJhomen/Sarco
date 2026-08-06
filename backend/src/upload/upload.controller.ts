import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiTags('Upload')
@Controller('/upload')
export class UploadController {
  @Post()
  @ApiOperation({ summary: 'Subir un archivo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: join(__dirname, '../../public/productos'),
      filename: (req, file, cb) => {
        // Extrae el nombre base sin extensión
        const baseName = file.originalname.replace(/\.[^/.]+$/, "");
        const uniqueName = `${Date.now()}-${baseName}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  uploadFile(@UploadedFile() file: any) {
    const url = `/productos/${file.filename}`;
    return { url };
  }
}