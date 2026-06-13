import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AssessmentMethod, TrainingType } from '../types/enums';
import type { SignInAnomaly } from '../types/interfaces';

@Entity('safety_training')
export class SafetyTraining {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 160 })
  topic!: string;

  @Column({ type: 'enum', enum: TrainingType })
  type!: TrainingType;

  @Column({ type: 'date' })
  trainingDate!: string;

  @Column({ type: 'decimal', precision: 4, scale: 1 })
  durationHours!: number;

  @Column({ type: 'varchar', length: 100 })
  instructor!: string;

  @Column({ type: 'varchar', length: 160 })
  location!: string;

  @Column({ type: 'text' })
  summary!: string;

  @Column({ type: 'json' })
  participantIds!: number[];

  @Column({ type: 'json' })
  signedInIds!: number[];

  @Column({ type: 'json', nullable: true })
  scores!: Record<string, number> | null;

  @Column({ type: 'enum', enum: AssessmentMethod })
  assessmentMethod!: AssessmentMethod;

  @Column({ type: 'int', default: 0 })
  passRate!: number;

  @Column({ type: 'json', nullable: true })
  signInAnomalies!: SignInAnomaly[] | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
