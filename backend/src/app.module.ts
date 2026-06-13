import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditController } from './controllers/audit.controller';
import { AuthController } from './controllers/auth.controller';
import { CertificationController } from './controllers/certification.controller';
import { DashboardController } from './controllers/dashboard.controller';
import { IncidentController } from './controllers/incident.controller';
import { InspectionController } from './controllers/inspection.controller';
import { TrainingController } from './controllers/training.controller';
import { UploadController } from './controllers/upload.controller';
import { databaseConfig } from './config/database.config';
import { AuditLogMiddleware } from './middlewares/auditLog.middleware';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { AuditLog } from './models/auditLog.entity';
import { WorkerCertification } from './models/certification.entity';
import { InspectionItem } from './models/inspectionItem.entity';
import { SafetyIncident } from './models/incident.entity';
import { SafetyInspection } from './models/inspection.entity';
import { Role } from './models/role.entity';
import { SafetyTraining } from './models/training.entity';
import { User } from './models/user.entity';
import { SeedService } from './database/seeds/seed.service';
import { AuditService } from './services/audit.service';
import { AuthService } from './services/auth.service';
import { CertificationService } from './services/certification.service';
import { DashboardService } from './services/dashboard.service';
import { IncidentService } from './services/incident.service';
import { InspectionService } from './services/inspection.service';
import { TrainingService } from './services/training.service';

const entities = [
  AuditLog,
  WorkerCertification,
  InspectionItem,
  SafetyIncident,
  SafetyInspection,
  Role,
  SafetyTraining,
  User,
];

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig()), TypeOrmModule.forFeature(entities)],
  controllers: [
    AuditController,
    AuthController,
    CertificationController,
    DashboardController,
    IncidentController,
    InspectionController,
    TrainingController,
    UploadController,
  ],
  providers: [
    AuditService,
    AuthService,
    CertificationService,
    DashboardService,
    IncidentService,
    InspectionService,
    TrainingService,
    SeedService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware, AuditLogMiddleware).forRoutes('*');
  }
}
