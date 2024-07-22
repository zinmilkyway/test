import { BaseEntity } from '@/services/baseServices/entity/base.entity';
import { Product } from '@/services/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
@Index('cat_id', ['id', 'slug'])
export class Category extends BaseEntity<Category> {
  @Column()
  name: string;

  @PrimaryColumn()
  slug: string;

  @Column({ nullable: true })
  bannerImages: string;

  @Column()
  summary?: string;

  @Column()
  description?: string;

  @OneToMany(() => Product, (product) => product.category, {
    cascade: true
  })
  product: Product[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
