import { Product } from './product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';

@Entity()
export class RelatedProduct {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  productId?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  images?: string;

  @ManyToOne(() => Product, (product) => product.related, {
    cascade: true
  })
  product: Product;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
