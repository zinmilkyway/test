import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { GalleryService } from './Gallery.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @ApiTags('Gallery')
  @Get('images')
  async getAllImages(@Res() res: Response) {
    try {
      const images = await this.galleryService.getAllImages();
      res.status(HttpStatus.OK).json({ images });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
