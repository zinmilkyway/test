import { BaseEntity } from '@/services/baseServices/entity/base.entity';
import { Category } from '@/services/categories/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn
} from 'typeorm';
import { RelatedProduct } from './relatedProduct.entity';

@Entity()
@Index('prod_id', ['id'])
export class Product extends BaseEntity<Product> {
  @Column()
  name: string;

  @Column({ nullable: true })
  slug: string;

  @Column('int', { nullable: true, default: 1 })
  status: number;

  @Column()
  productImages: string;

  @Column()
  summary: string;

  @Column()
  price?: number;

  @Column()
  description?: string;

  @Column({ nullable: true })
  descriptionImages?: string;
  // pdf file
  @Column()
  catalogue?: string;

  @Column()
  specs?: string;

  @Column({ nullable: true })
  specsImages?: string;

  @Column()
  detailsDescription?: string;

  @ManyToOne(() => Category, (cat) => cat.slug, {
    cascade: false
  })
  @JoinColumn()
  category: Category;

  @Column()
  type?: string;

  @OneToMany(() => RelatedProduct, (related) => related.product)
  related: RelatedProduct[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
