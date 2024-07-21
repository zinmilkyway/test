import { Banner } from './entities/banner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { multerOptions } from './../../config/multer.config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Banner]),
    MulterModule.register(multerOptions),
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
