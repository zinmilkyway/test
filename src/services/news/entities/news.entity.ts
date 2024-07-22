import { BaseEntity } from '@/services/baseServices/entity/base.entity';
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
@Entity()
export class News extends BaseEntity<News> {
  @Column()
  name: string;
  @Column()
  image_path: string;
  @Column()
  title: string;
  @Column()
  category: string;
  @Column({ nullable: true })
  created_by: string;
  @Column()
  tags: string;
  @Column()
  content: string;
  @CreateDateColumn()
  created_at: string;
  @UpdateDateColumn()
  updated_at: string;
}
