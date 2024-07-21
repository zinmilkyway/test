import { Column, PrimaryGeneratedColumn, Entity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;
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
  created_at: String;
  @UpdateDateColumn()
  updated_at: String;
}
