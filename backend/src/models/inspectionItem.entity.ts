import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SafetyInspection } from './inspection.entity';

@Entity('inspection_item')
export class InspectionItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ type: 'boolean', default: false })
  passed!: boolean;

  @Column({ type: 'varchar', length: 300, nullable: true })
  remark!: string | null;

  @Column({ type: 'json' })
  photoUrls!: string[];

  @ManyToOne(() => SafetyInspection, (inspection) => inspection.items, {
    onDelete: 'CASCADE',
  })
  inspection!: SafetyInspection;
}
