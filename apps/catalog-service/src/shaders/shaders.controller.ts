import 'multer';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ShadersService } from './shaders.service';
import { CreateShaderDto } from './dto/create-shader.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Minio from 'minio';

@Controller('api/catalog/shaders')
export class ShadersController {
  private minioClient: Minio.Client;

  constructor(private readonly shadersService: ShadersService) {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'minio',
      port: parseInt(process.env.MINIO_PORT || '9000', 10),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
  }

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createShaderDto: CreateShaderDto,
  ) {
    const fileName = `${Date.now()}-${file.originalname}`;

    await this.minioClient.putObject(
      'shader-thumbnails',
      fileName,
      file.buffer,
    );

    const publicUrl = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';

    const thumbnailUrl = `${publicUrl}/shader-thumbnails/${fileName}`;

    return this.shadersService.create({
      ...createShaderDto,
      thumbnailUrl: thumbnailUrl,
    });
  }

  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
  ) {
    return this.shadersService.findAll(+page || 1, +limit || 10, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.shadersService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateShaderDto: Partial<CreateShaderDto>,
  ) {
    let updateData = { ...updateShaderDto };

    if (file) {
      const fileName = `${Date.now()}-${file.originalname}`;
      await this.minioClient.putObject(
        'shader-thumbnails',
        fileName,
        file.buffer,
      );
      const publicUrl = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';
      updateData.thumbnailUrl = `${publicUrl}/shader-thumbnails/${fileName}`;
    }

    return this.shadersService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.shadersService.remove(id);
  }
}
