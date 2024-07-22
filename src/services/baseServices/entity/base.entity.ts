import { PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity<T> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
