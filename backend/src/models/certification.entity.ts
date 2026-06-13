import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CertStatus, CertificationType } from '../types/enums';

@Entity('worker_certification')
export class WorkerCertification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  workerId!: number;

  @Column({ type: 'enum', enum: CertificationType })
  certificationType!: CertificationType;

  @Column({ type: 'varchar', length: 120 })
  certificateNo!: string;

  @Column({ type: 'varchar', length: 160 })
  issuingAuthority!: string;

  @Column({ type: 'date' })
  issuedAt!: string;

  @Column({ type: 'date' })
  validUntil!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  photoUrl!: string | null;

  @Column({ type: 'enum', enum: CertStatus, default: CertStatus.Pending })
  auditStatus!: CertStatus;

  @Column({ type: 'varchar', length: 300, nullable: true })
  auditComment!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
