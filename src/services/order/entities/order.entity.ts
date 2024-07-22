import { BaseEntity } from '@/services/baseServices/entity/base.entity';
import { CartEntity } from '@/services/cart/cart.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class OrderEntity extends BaseEntity<OrderEntity> {
  @OneToMany((type) => CartEntity, (cart) => cart.id)
  items: CartEntity[];

  @Column()
  subTotal: number;

  @Column({ default: false })
  payed: boolean;
}
