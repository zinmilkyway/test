import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  address: string;
  @Column({ nullable: true })
  phone: string;
  @Column()
  work_time: string;
//   @Column()
//   content: string;
}
