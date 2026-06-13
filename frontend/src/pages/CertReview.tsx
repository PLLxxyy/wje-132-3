import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Divider, Drawer, Image, List, Space, Table, Tag, Typography, message } from 'antd';
import { WarningOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { RiskLevelTag } from '../components/common/RiskLevelTag';
import { StatusBadge } from '../components/common/StatusBadge';
import { UserAvatar } from '../components/common/UserAvatar';
import { useCertificationStore } from '../stores/certificationStore';
import { useAuthStore } from '../stores/authStore';
import { canReviewCertification } from '../types/roles';
import { CertAnomalyType, CertStatus, SeverityLevel } from '../types/enums';
import type { SignInAnomaly, WorkerCertification } from '../types';

const getAnomalySeverity = (type: CertAnomalyType): SeverityLevel => {
  switch (type) {
    case CertAnomalyType.NoCert:
      return SeverityLevel.Fatal;
    case CertAnomalyType.Expired:
      return SeverityLevel.Major;
    case CertAnomalyType.NotApproved:
      return SeverityLevel.Moderate;
    case CertAnomalyType.ExpiringSoon:
      return SeverityLevel.Minor;
    default:
      return SeverityLevel.NearMiss;
  }
};

const getAnomalyIcon = (type: CertAnomalyType) => {
  switch (type) {
    case CertAnomalyType.NoCert:
    case CertAnomalyType.Expired:
      return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
    case CertAnomalyType.ExpiringSoon:
      return <WarningOutlined style={{ color: '#faad14' }} />;
    default:
      return <WarningOutlined style={{ color: '#faad14' }} />;
  }
};

export function CertReview() {
  const { certifications, expiring, workerAnomalies, loading, loadCertifications, reviewCertification, loadWorkerAnomalies } = useCertificationStore();
  const user = useAuthStore((state) => state.user);
  const [active, setActive] = useState<WorkerCertification>();

  useEffect(() => {
    loadCertifications();
  }, [loadCertifications]);

  const columns: ColumnsType<WorkerCertification> = useMemo(
    () => [
      { title: '人员', dataIndex: 'workerId', render: (id) => <UserAvatar userId={id} /> },
      { title: '资质类型', dataIndex: 'certificationType' },
      { title: '证书编号', dataIndex: 'certificateNo' },
      { title: '有效期至', dataIndex: 'validUntil' },
      { title: '审核状态', dataIndex: 'auditStatus', render: (status) => <StatusBadge status={status} /> },
      {
        title: '风险',
        render: (_, record) => {
          const days = dayjs(record.validUntil).diff(dayjs(), 'day');
          const level = days < 0 ? SeverityLevel.Fatal : days <= 30 ? SeverityLevel.Major : SeverityLevel.NearMiss;
          return <RiskLevelTag level={level} />;
        },
      },
      {
        title: '操作',
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => setActive(record)}>详情</Button>
            {canReviewCertification(user.role) && record.auditStatus === CertStatus.Pending && (
              <>
                <Button size="small" type="primary" onClick={() => reviewCertification(record.id, CertStatus.Approved, '资料齐全').then(() => message.success('已通过'))}>
                  通过
                </Button>
                <Button size="small" danger onClick={() => reviewCertification(record.id, CertStatus.Rejected, '请补充证书照片').then(() => message.success('已驳回'))}>
                  驳回
                </Button>
              </>
            )}
          </Space>
        ),
      },
    ],
    [reviewCertification, user.role],
  );

  return (
    <Space direction="vertical" size={16} className="page">
      <div className="page-header">
        <div>
          <Typography.Title level={2}>资质审核</Typography.Title>
          <Typography.Text type="secondary">待审核、证书预览、过期预警与续期管理</Typography.Text>
        </div>
      </div>
      <Card title="过期预警列表">
        <List
          dataSource={expiring}
          renderItem={(item) => (
            <List.Item actions={[<RiskLevelTag key="risk" level={SeverityLevel.Major} />]}>
              <List.Item.Meta
                title={`${item.certificateNo} / ${item.certificationType}`}
                description={`人员 #${item.workerId}，${dayjs(item.validUntil).diff(dayjs(), 'day')} 天后到期`}
              />
            </List.Item>
          )}
        />
      </Card>
      <Table rowKey="id" loading={loading} columns={columns} dataSource={certifications} />
      <Drawer
        title="资质详情"
        width={620}
        open={Boolean(active)}
        onClose={() => setActive(undefined)}
        afterOpenChange={(open) => {
          if (open && active) {
            loadWorkerAnomalies(active.workerId);
          }
        }}
      >
        {active && (
          <Space direction="vertical" size={14} className="full">
            <UserAvatar userId={active.workerId} />
            <Typography.Text>证书编号：{active.certificateNo}</Typography.Text>
            <Typography.Text>发证机构：{active.issuingAuthority}</Typography.Text>
            <Typography.Text>发证日期：{active.issuedAt}</Typography.Text>
            <Typography.Text>有效期至：{active.validUntil}</Typography.Text>
            <StatusBadge status={active.auditStatus} />
            {active.photoUrl ? <Image src={active.photoUrl} alt="证书照片" /> : <Card>暂无证书照片</Card>}

            <Divider />
            <Typography.Title level={5}>签到异常记录</Typography.Title>
            {workerAnomalies.length > 0 ? (
              <List
                dataSource={workerAnomalies}
                renderItem={(anomaly: SignInAnomaly) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={getAnomalyIcon(anomaly.anomalyType)}
                      title={
                        <Space>
                          <Tag color="blue">培训 #{anomaly.trainingId}</Tag>
                          <RiskLevelTag level={getAnomalySeverity(anomaly.anomalyType)} />
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={4}>
                          <Typography.Text>{anomaly.message}</Typography.Text>
                          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            检测时间：{anomaly.detectedAt}
                          </Typography.Text>
                          {anomaly.certType && (
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                              资质类型：{anomaly.certType}
                              {anomaly.validUntil && `，有效期至：${anomaly.validUntil}`}
                              {typeof anomaly.daysRemaining === 'number' &&
                                `，剩余 ${anomaly.daysRemaining} 天`}
                            </Typography.Text>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Typography.Text type="secondary">暂无签到异常记录</Typography.Text>
            )}
          </Space>
        )}
      </Drawer>
    </Space>
  );
}
