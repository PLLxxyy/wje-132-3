import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt = require('bcryptjs');
import dayjs = require('dayjs');
import { Repository } from 'typeorm';
import { WorkerCertification } from '../../models/certification.entity';
import { InspectionItem } from '../../models/inspectionItem.entity';
import { SafetyIncident } from '../../models/incident.entity';
import { SafetyInspection } from '../../models/inspection.entity';
import { Role } from '../../models/role.entity';
import { SafetyTraining } from '../../models/training.entity';
import { User } from '../../models/user.entity';
import {
  AssessmentMethod,
  CertStatus,
  CertificationType,
  IncidentCategory,
  IncidentStatus,
  InspectionStatus,
  InspectionType,
  SeverityLevel,
  TrainingType,
  UserRole,
} from '../../types/enums';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(SafetyIncident) private readonly incidentRepository: Repository<SafetyIncident>,
    @InjectRepository(SafetyInspection) private readonly inspectionRepository: Repository<SafetyInspection>,
    @InjectRepository(SafetyTraining) private readonly trainingRepository: Repository<SafetyTraining>,
    @InjectRepository(WorkerCertification)
    private readonly certificationRepository: Repository<WorkerCertification>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRoles();
    await this.seedUsers();
    await this.seedIncidents();
    await this.seedInspections();
    await this.seedTrainings();
    await this.seedCertifications();
  }

  private async seedRoles() {
    for (const role of Object.values(UserRole)) {
      const exists = await this.roleRepository.findOne({ where: { name: role } });
      if (!exists) {
        await this.roleRepository.save({
          name: role,
          description: this.roleDescription(role),
        });
      }
    }
  }

  private async seedUsers() {
    if (await this.userRepository.count()) return;
    const passwordHash = await bcrypt.hash('Safety@123', 10);
    await this.userRepository.save([
      { name: '赵工', email: 'admin@safety.local', roleName: UserRole.Admin, passwordHash },
      { name: '李安全', email: 'manager@safety.local', roleName: UserRole.SafetyManager, passwordHash },
      { name: '王巡检', email: 'inspector@safety.local', roleName: UserRole.Inspector, passwordHash },
      { name: '陈班组', email: 'worker@safety.local', roleName: UserRole.Worker, passwordHash },
    ]);
  }

  private async seedIncidents() {
    if (await this.incidentRepository.count()) return;
    await this.incidentRepository.save([
      {
        title: '三号塔吊吊运钢筋散落',
        description: '吊运过程中绑扎松动，钢筋滑落至隔离区外侧，无人员受伤。',
        occurredAt: dayjs().subtract(2, 'day').toDate(),
        site: '城东综合体项目',
        area: '3# 塔吊作业面',
        severity: SeverityLevel.Moderate,
        category: IncidentCategory.StruckByObject,
        involvedWorkerIds: [4],
        photoUrls: [],
        status: IncidentStatus.Investigating,
        correctiveAction: '复核吊具点检记录，重新培训吊装指挥手势。',
        correctiveDeadline: dayjs().add(5, 'day').format('YYYY-MM-DD'),
        reporterId: 2,
        timeline: [
          { at: dayjs().subtract(2, 'day').toISOString(), label: '事件已上报', actorId: 2 },
          { at: dayjs().subtract(1, 'day').toISOString(), label: '已指派调查人 #3', actorId: 2 },
        ],
      },
      {
        title: '地下室临边防护缺失',
        description: 'B2 层材料通道临边护栏拆除后未恢复。',
        occurredAt: dayjs().subtract(6, 'day').toDate(),
        site: '城东综合体项目',
        area: 'B2 材料通道',
        severity: SeverityLevel.Major,
        category: IncidentCategory.Fall,
        involvedWorkerIds: [4],
        photoUrls: [],
        status: IncidentStatus.Reported,
        correctiveAction: null,
        correctiveDeadline: dayjs().add(2, 'day').format('YYYY-MM-DD'),
        reporterId: 3,
        timeline: [{ at: dayjs().subtract(6, 'day').toISOString(), label: '事件已上报', actorId: 3 }],
      },
    ]);
  }

  private async seedInspections() {
    if (await this.inspectionRepository.count()) return;
    const scaffoldItems = [
      Object.assign(new InspectionItem(), {
        name: '脚手板铺设满铺并固定',
        passed: true,
        remark: '符合方案',
        photoUrls: [],
      }),
      Object.assign(new InspectionItem(), {
        name: '连墙件设置间距',
        passed: false,
        remark: '东侧一处缺失',
        photoUrls: [],
      }),
    ];
    await this.inspectionRepository.save([
      {
        name: '周例行脚手架专项检查',
        type: InspectionType.Routine,
        area: '主体结构 8-10 层',
        inspectionDate: dayjs().format('YYYY-MM-DD'),
        inspectorId: 3,
        totalScore: 50,
        status: InspectionStatus.Failed,
        hazardCount: 1,
        passedCount: 1,
        items: scaffoldItems,
      },
      {
        name: '班前临电检查',
        type: InspectionType.PreShift,
        area: '钢筋加工棚',
        inspectionDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        inspectorId: 3,
        totalScore: 0,
        status: InspectionStatus.Scheduled,
        hazardCount: 0,
        passedCount: 0,
        items: [],
      },
    ]);
  }

  private async seedTrainings() {
    if (await this.trainingRepository.count()) return;
    await this.trainingRepository.save([
      {
        topic: '高处作业防坠落专项培训',
        type: TrainingType.Special,
        trainingDate: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
        durationHours: 2,
        instructor: '李安全',
        location: '项目部安全体验馆',
        summary: '围绕安全带挂设、临边洞口识别、作业票确认进行讲解和实操。',
        participantIds: [3, 4],
        signedInIds: [3, 4],
        scores: { '3': 92, '4': 76 },
        assessmentMethod: AssessmentMethod.Practical,
        passRate: 100,
      },
      {
        topic: '新进场人员三级安全教育',
        type: TrainingType.Induction,
        trainingDate: dayjs().add(4, 'day').format('YYYY-MM-DD'),
        durationHours: 3,
        instructor: '赵工',
        location: '一号会议室',
        summary: '项目安全制度、重大危险源、应急撤离路线和班组交底。',
        participantIds: [4],
        signedInIds: [],
        scores: {},
        assessmentMethod: AssessmentMethod.Written,
        passRate: 0,
      },
    ]);
  }

  private async seedCertifications() {
    if (await this.certificationRepository.count()) return;
    await this.certificationRepository.save([
      {
        workerId: 4,
        certificationType: CertificationType.Electrician,
        certificateNo: 'DG-2025-0317',
        issuingAuthority: '市住建培训中心',
        issuedAt: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
        validUntil: dayjs().add(18, 'day').format('YYYY-MM-DD'),
        photoUrl: null,
        auditStatus: CertStatus.Approved,
      },
      {
        workerId: 4,
        certificationType: CertificationType.HighAltitude,
        certificateNo: 'GKC-2026-0081',
        issuingAuthority: '省应急管理厅',
        issuedAt: dayjs().subtract(2, 'month').format('YYYY-MM-DD'),
        validUntil: dayjs().add(2, 'year').format('YYYY-MM-DD'),
        photoUrl: null,
        auditStatus: CertStatus.Pending,
      },
    ]);
  }

  private roleDescription(role: UserRole) {
    const description: Record<UserRole, string> = {
      [UserRole.Admin]: '系统管理员，可配置账号与审核关键记录',
      [UserRole.SafetyManager]: '安全管理员，可处理事件、审核资质和查看审计日志',
      [UserRole.Inspector]: '巡检人员，可创建检查、提交检查结果和培训签到',
      [UserRole.Worker]: '施工人员，可上报事件和提交个人资质',
    };
    return description[role];
  }
}
