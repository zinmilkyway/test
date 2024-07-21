import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express/multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { multerOptions } from './../../config/multer.config';
import { Product } from './entities/product.entity';
import { RelatedProduct } from './entities/relatedProduct.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, RelatedProduct, Category]),
    MulterModule.register(multerOptions)
  ],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductModule {}
