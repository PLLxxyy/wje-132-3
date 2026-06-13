import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuditLog } from '../models/auditLog.entity';
import { InspectionItem } from '../models/inspectionItem.entity';
import { Role } from '../models/role.entity';
import { SafetyIncident } from '../models/incident.entity';
import { SafetyInspection } from '../models/inspection.entity';
import { SafetyTraining } from '../models/training.entity';
import { User } from '../models/user.entity';
import { WorkerCertification } from '../models/certification.entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? process.env.MYSQL_USER ?? 'safety_user',
  password: process.env.DB_PASSWORD ?? process.env.MYSQL_PASSWORD ?? 'safety_password',
  database: process.env.DB_NAME ?? process.env.MYSQL_DATABASE ?? 'safety_platform',
  entities: [
    AuditLog,
    InspectionItem,
    Role,
    SafetyIncident,
    SafetyInspection,
    SafetyTraining,
    User,
    WorkerCertification,
  ],
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production' ? ['error', 'warn'] : ['error'],
});
