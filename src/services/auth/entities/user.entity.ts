import { BaseEntity } from '@/services/baseServices/entity/base.entity';
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity<User> {
  @Column()
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
