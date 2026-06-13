import { useEffect, useState } from 'react';
import { Alert, Button, Calendar, Card, Col, Drawer, List, Modal, Progress, Row, Space, Table, Tag, Typography, message } from 'antd';
import { WarningOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { trainingApi } from '../api/training';
import { EmptyState } from '../components/common/EmptyState';
import { RiskLevelTag } from '../components/common/RiskLevelTag';
import { StatusBadge } from '../components/common/StatusBadge';
import { UserAvatar } from '../components/common/UserAvatar';
import { useTrainingStore } from '../stores/trainingStore';
import { CertAnomalyType, SeverityLevel } from '../types/enums';
import type { SafetyTraining, SignInAnomaly, SignInResult } from '../types';

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

export function TrainingManage() {
  const { trainings, anomalies, loading, loadTrainings, signIn, loadAnomalies } = useTrainingStore();
  const [active, setActive] = useState<SafetyTraining>();
  const [anomalyModalVisible, setAnomalyModalVisible] = useState(false);

  useEffect(() => {
    loadTrainings();
    loadAnomalies();
  }, [loadTrainings, loadAnomalies]);

  const columns: ColumnsType<SafetyTraining> = [
    { title: '培训主题', dataIndex: 'topic', render: (text, record) => <Button type="link" onClick={() => setActive(record)}>{text}</Button> },
    { title: '类型', dataIndex: 'type' },
    { title: '日期', dataIndex: 'trainingDate' },
    { title: '讲师', dataIndex: 'instructor' },
    { title: '地点', dataIndex: 'location' },
    { title: '通过率', dataIndex: 'passRate', render: (value) => <Progress percent={value} size="small" /> },
    {
      title: '异常',
      dataIndex: 'signInAnomalies',
      render: (anomalies: SignInAnomaly[] | null) => {
        if (!anomalies || anomalies.length === 0) return '-';
        const hasCritical = anomalies.some(
          (a) => a.anomalyType === CertAnomalyType.NoCert || a.anomalyType === CertAnomalyType.Expired,
        );
        return (
          <Tag color={hasCritical ? 'red' : 'orange'}>
            {anomalies.length} 条异常
          </Tag>
        );
      },
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={async () => {
              try {
                const result = await signIn(record.id, 4);
                if (result.certCheck.anomalies.length > 0) {
                  const hasBlocking = result.certCheck.anomalies.some(
                    (a) => a.anomalyType === CertAnomalyType.NoCert || a.anomalyType === CertAnomalyType.Expired,
                  );
                  if (hasBlocking) {
                    message.warning('签到完成，但检测到严重资质异常，请关注');
                  } else {
                    message.warning('签到完成，但部分资质即将过期');
                  }
                } else {
                  message.success('签到完成，资质正常');
                }
                await loadAnomalies();
              } catch (e) {
                // error already handled by interceptor
              }
            }}
          >
            签到
          </Button>
          <Button size="small" href={trainingApi.exportUrl(record.id)} target="_blank">导出记录</Button>
        </Space>
      ),
    },
  ];

  const dateCellRender = (date: Dayjs) => {
    const dayTrainings = trainings.filter((training) => training.trainingDate === date.format('YYYY-MM-DD'));
    return (
      <Space direction="vertical" size={4}>
        {dayTrainings.map((training) => (
          <Typography.Text key={training.id} className="calendar-item">{training.topic}</Typography.Text>
        ))}
      </Space>
    );
  };

  const renderAnomalyList = (anomalyList: SignInAnomaly[]) => (
    <List
      dataSource={anomalyList}
      renderItem={(anomaly) => (
        <List.Item>
          <List.Item.Meta
            avatar={getAnomalyIcon(anomaly.anomalyType)}
            title={
              <Space>
                <UserAvatar userId={anomaly.workerId} />
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
  );

  return (
    <Space direction="vertical" size={16} className="page">
      <div className="page-header">
        <div>
          <Typography.Title level={2}>培训管理</Typography.Title>
          <Typography.Text type="secondary">培训日历、签到表、成绩表与记录导出</Typography.Text>
        </div>
      </div>
      {anomalies.length > 0 && (
        <Alert
          type="warning"
          showIcon
          message={`共有 ${anomalies.length} 条签到资质异常记录`}
          description="无证或过期资质人员参加了培训，请及时处理"
          action={
            <Button size="small" type="primary" onClick={() => setAnomalyModalVisible(true)}>
              查看详情
            </Button>
          }
        />
      )}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={10}>
          <Card title="培训日历">
            <Calendar fullscreen={false} cellRender={dateCellRender} />
          </Card>
        </Col>
        <Col xs={24} xl={14}>
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={trainings}
            locale={{ emptyText: <EmptyState description="暂无培训记录" /> }}
          />
        </Col>
      </Row>
      <Drawer title="培训详情" width={620} open={Boolean(active)} onClose={() => setActive(undefined)}>
        {active && (
          <Space direction="vertical" size={16} className="full">
            <Typography.Title level={4}>{active.topic}</Typography.Title>
            <Typography.Paragraph>{active.summary}</Typography.Paragraph>
            <StatusBadge status={active.passRate >= 80 ? 'Completed' : 'InProgress'} />
            {active.signInAnomalies && active.signInAnomalies.length > 0 && (
              <Alert
                type="warning"
                showIcon
                message={`本次培训检测到 ${active.signInAnomalies.length} 条资质异常`}
              />
            )}
            <Card title="签到表" size="small">
              <List
                dataSource={active.participantIds}
                renderItem={(id) => (
                  <List.Item actions={[active.signedInIds.includes(id) ? '已签到' : '未签到']}>
                    <Space>
                      <UserAvatar userId={id} />
                      {active.signInAnomalies?.some((a) => a.workerId === id) && (
                        <Tag color="red">资质异常</Tag>
                      )}
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
            {active.signInAnomalies && active.signInAnomalies.length > 0 && (
              <Card title="签到异常记录" size="small">
                {renderAnomalyList(active.signInAnomalies)}
              </Card>
            )}
            <Card title="成绩表" size="small">
              <List
                dataSource={Object.entries(active.scores ?? {})}
                renderItem={([id, score]) => (
                  <List.Item actions={[`${score} 分`]}>
                    <UserAvatar userId={Number(id)} />
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        )}
      </Drawer>
      <Modal
        title="签到资质异常记录"
        open={anomalyModalVisible}
        onCancel={() => setAnomalyModalVisible(false)}
        footer={null}
        width={720}
      >
        {anomalies.length > 0 ? renderAnomalyList(anomalies) : <EmptyState description="暂无异常记录" />}
      </Modal>
    </Space>
  );
}
