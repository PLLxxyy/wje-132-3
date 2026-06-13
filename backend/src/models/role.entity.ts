import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../types/enums';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: UserRole, unique: true })
  name!: UserRole;

  @Column({ type: 'varchar', length: 120 })
  description!: string;
}
