import { Module } from '@nestjs/common';
import { CartService } from './service/cart.service';
import { CartController } from './controller/cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './cart.entity';
import { Product } from '../product/entities/product.entity';
import { ProductsService } from '../product/products.service';
import { RelatedProduct } from '../product/entities/relatedProduct.entity';
import { Category } from '../categories/entities/category.entity';
import { OrderEntity } from '../order/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartEntity,
      Product,
      OrderEntity,
      RelatedProduct,
      Category
    ])
  ],
  providers: [CartService, ProductsService],
  controllers: [CartController]
})
export class CartModule {}
