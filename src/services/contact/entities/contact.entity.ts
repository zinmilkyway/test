import { BaseEntity } from '@/services/baseServices/entity/base.entity';
import { Column, Entity } from 'typeorm';
@Entity()
export class Contact extends BaseEntity<Contact> {
  @Column()
  address: string;
  @Column({ nullable: true })
  phone: string;
  @Column()
  work_time: string;
  //   @Column()
  //   content: string;
}
