import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../baseServices/entity/base.entity';
import { OrderEntity } from '../order/entities/order.entity';

@Entity()
export class CartEntity extends BaseEntity<CartEntity> {
  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  total: number;

  @Column()
  userId: string;

  @ManyToOne((type) => OrderEntity, (order) => order.id)
  items: OrderEntity;
}
