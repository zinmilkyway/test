import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
} from 'typeorm';
@Entity()
export class Mail {
  @PrimaryGeneratedColumn()
  id: number;
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
