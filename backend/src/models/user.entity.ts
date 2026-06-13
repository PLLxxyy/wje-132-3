import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../types/enums';
import { Role } from './role.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 80 })
  name!: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 160 })
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole })
  roleName!: UserRole;

  @ManyToOne(() => Role, { eager: true, nullable: true })
  @JoinColumn({ name: 'roleName', referencedColumnName: 'name' })
  role?: Role;
}
