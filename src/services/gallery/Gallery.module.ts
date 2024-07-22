import { Module } from '@nestjs/common';
import { GalleryService } from './Gallery.service';
import { GalleryController } from './Gallery.controller';

@Module({
  providers: [GalleryService],
  controllers: [GalleryController]
})
export class GalleryModule {}
