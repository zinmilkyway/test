import { BaseEntity } from '@/services/baseServices/entity/base.entity';
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class Banner extends BaseEntity<Banner> {
  @Column('varchar', { length: 255 })
  name: string;
  @Column('int', { nullable: true, default: 1 })
  status: number;
  @Column('int', { nullable: true, default: 1 })
  order: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  image: string;
  @Column()
  details: string;
  @CreateDateColumn()
  created_at: string;
  @UpdateDateColumn()
  updated_at: string;
}
