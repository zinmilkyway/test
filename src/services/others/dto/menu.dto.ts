import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  jsonMenu: string;
}
