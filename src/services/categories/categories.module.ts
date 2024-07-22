import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Product } from '../product/entities/product.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from '@/config/multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product]),
    MulterModule.register(multerOptions)
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule {}
