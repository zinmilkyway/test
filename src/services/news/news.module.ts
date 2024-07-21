import { multerOptions } from './../../config/multer.config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([News]),
    MulterModule.register(multerOptions),
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
