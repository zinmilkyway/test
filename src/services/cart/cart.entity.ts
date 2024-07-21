import { OrderEntity } from 'src/services/order/order.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
