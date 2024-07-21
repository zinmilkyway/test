import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express/multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { multerOptions } from '../../config/multer.config';
import { Service } from './entities/services.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    MulterModule.register(multerOptions),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
