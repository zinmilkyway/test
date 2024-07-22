import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { CartEntity } from '../cart/cart.entity';
import { CartService } from '../cart/service/cart.service';
import { ProductsService } from '../product/products.service';
import { RelatedProduct } from '../product/entities/relatedProduct.entity';
import { Category } from '../categories/entities/category.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      Product,
      CartEntity,
      RelatedProduct,
      Category
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService, CartService, ProductsService]
})
export class OrderModule {}
