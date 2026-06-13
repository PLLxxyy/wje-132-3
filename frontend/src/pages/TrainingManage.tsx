import { useEffect, useState } from 'react';
import { Button, Calendar, Card, Col, Drawer, List, Progress, Row, Space, Table, Typography, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { trainingApi } from '../api/training';
import { EmptyState } from '../components/common/EmptyState';
import { StatusBadge } from '../components/common/StatusBadge';
import { UserAvatar } from '../components/common/UserAvatar';
import { useTrainingStore } from '../stores/trainingStore';
import type { SafetyTraining } from '../types';

export function TrainingManage() {
  const { trainings, loading, loadTrainings, signIn } = useTrainingStore();
  const [active, setActive] = useState<SafetyTraining>();

  useEffect(() => {
    loadTrainings();
  }, [loadTrainings]);

  const columns: ColumnsType<SafetyTraining> = [
    { title: '培训主题', dataIndex: 'topic', render: (text, record) => <Button type="link" onClick={() => setActive(record)}>{text}</Button> },
    { title: '类型', dataIndex: 'type' },
    { title: '日期', dataIndex: 'trainingDate' },
    { title: '讲师', dataIndex: 'instructor' },
    { title: '地点', dataIndex: 'location' },
    { title: '通过率', dataIndex: 'passRate', render: (value) => <Progress percent={value} size="small" /> },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => signIn(record.id, 4).then(() => message.success('签到完成'))}>签到</Button>
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

  return (
    <Space direction="vertical" size={16} className="page">
      <div className="page-header">
        <div>
          <Typography.Title level={2}>培训管理</Typography.Title>
          <Typography.Text type="secondary">培训日历、签到表、成绩表与记录导出</Typography.Text>
        </div>
      </div>
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
            <Card title="签到表" size="small">
              <List
                dataSource={active.participantIds}
                renderItem={(id) => (
                  <List.Item actions={[active.signedInIds.includes(id) ? '已签到' : '未签到']}>
                    <UserAvatar userId={id} />
                  </List.Item>
                )}
              />
            </Card>
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
    </Space>
  );
}
