import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IncidentCategory, IncidentStatus, SeverityLevel } from '../types/enums';

@Entity('safety_incident')
export class SafetyIncident {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 160 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'datetime' })
  occurredAt!: Date;

  @Column({ type: 'varchar', length: 120 })
  site!: string;

  @Column({ type: 'varchar', length: 120 })
  area!: string;

  @Column({ type: 'enum', enum: SeverityLevel })
  severity!: SeverityLevel;

  @Column({ type: 'enum', enum: IncidentCategory })
  category!: IncidentCategory;

  @Column({ type: 'json' })
  involvedWorkerIds!: number[];

  @Column({ type: 'json' })
  photoUrls!: string[];

  @Column({ type: 'enum', enum: IncidentStatus, default: IncidentStatus.Reported })
  status!: IncidentStatus;

  @Column({ type: 'text', nullable: true })
  correctiveAction!: string | null;

  @Column({ type: 'date', nullable: true })
  correctiveDeadline!: string | null;

  @Column({ type: 'int' })
  reporterId!: number;

  @Column({ type: 'json', nullable: true })
  timeline!: Array<{ at: string; label: string; actorId?: number; note?: string }> | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
