import { BaseEntity } from '@/services/baseServices/entity/base.entity';
import { Column, CreateDateColumn, Entity } from 'typeorm';
@Entity()
export class Mail extends BaseEntity<Mail> {
  @Column()
  name: string;
  @Column({ nullable: true })
  to_email: string;
  @Column({ nullable: true })
  to_phonenumber: string;
  @Column()
  title: string;
  @Column()
  content: string;
  @CreateDateColumn()
  createdAt: string;
}
