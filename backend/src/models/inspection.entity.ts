import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InspectionStatus, InspectionType } from '../types/enums';
import { InspectionItem } from './inspectionItem.entity';

@Entity('safety_inspection')
export class SafetyInspection {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ type: 'enum', enum: InspectionType })
  type!: InspectionType;

  @Column({ type: 'varchar', length: 160 })
  area!: string;

  @Column({ type: 'date' })
  inspectionDate!: string;

  @Column({ type: 'int' })
  inspectorId!: number;

  @Column({ type: 'int', default: 0 })
  totalScore!: number;

  @Column({ type: 'enum', enum: InspectionStatus, default: InspectionStatus.Scheduled })
  status!: InspectionStatus;

  @Column({ type: 'int', default: 0 })
  hazardCount!: number;

  @Column({ type: 'int', default: 0 })
  passedCount!: number;

  @OneToMany(() => InspectionItem, (item) => item.inspection, {
    cascade: true,
    eager: true,
  })
  items!: InspectionItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
