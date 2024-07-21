import { Product } from '@/services/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
@Index('cat_id', ['id', 'slug'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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

  constructor(Category) {
    Object.assign(this, Category);
  }
}
