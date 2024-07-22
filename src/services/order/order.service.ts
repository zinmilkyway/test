import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { CartService } from '../cart/service/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private cartService: CartService
  ) {}

  async order(user: string): Promise<OrderEntity> {
    const cartItems = await this.cartService.getItemsInCard(user);
    const userOrder = cartItems.filter((item) => item.userId === user);
    const subTotal = cartItems
      .map((item) => item.total)
      .reduce((acc, next) => acc + next);
    const order = { items: userOrder, subTotal: subTotal };
    return this.orderRepository.create(order);
  }

  async getOrders(user: string): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find();
    return orders.filter((item) => item.items[0].userId === user);
  }
}
