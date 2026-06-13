import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  Table,
  Timeline,
  Typography,
  Upload,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { incidentApi } from '../api/incident';
import { RiskLevelTag } from '../components/common/RiskLevelTag';
import { StatusBadge } from '../components/common/StatusBadge';
import { UserAvatar } from '../components/common/UserAvatar';
import { useIncidentStore } from '../stores/incidentStore';
import { IncidentCategory, IncidentStatus, SeverityLevel } from '../types/enums';
import type { SafetyIncident } from '../types';
import { canCloseIncident } from '../types/roles';
import { useAuthStore } from '../stores/authStore';
import { usePagination } from '../hooks/usePagination';

export function IncidentManage() {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detail, setDetail] = useState<SafetyIncident>();
  const { incidents, loading, total, loadIncidents, reportIncident } = useIncidentStore();
  const pagination = usePagination(8);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadIncidents({ page: pagination.page, pageSize: pagination.pageSize });
  }, [loadIncidents, pagination.page, pagination.pageSize]);

  const columns: ColumnsType<SafetyIncident> = useMemo(
    () => [
      {
        title: '事件标题',
        dataIndex: 'title',
        render: (text, record) => <Button type="link" onClick={() => setDetail(record)}>{text}</Button>,
      },
      { title: '位置', render: (_, record) => `${record.site} / ${record.area}` },
      { title: '等级', dataIndex: 'severity', render: (level) => <RiskLevelTag level={level} /> },
      { title: '状态', dataIndex: 'status', render: (status) => <StatusBadge status={status} /> },
      { title: '发生时间', dataIndex: 'occurredAt', render: (value) => dayjs(value).format('YYYY-MM-DD HH:mm') },
      {
        title: '操作',
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => incidentApi.assign(record.id, 3, '平台指派').then(() => loadIncidents())}>
              指派调查
            </Button>
            {canCloseIncident(user.role) && (
              <Button size="small" onClick={() => incidentApi.close(record.id, '现场复核通过').then(() => loadIncidents())}>
                关闭
              </Button>
            )}
          </Space>
        ),
      },
    ],
    [loadIncidents, user.role],
  );

  async function submitIncident(values: Record<string, unknown>) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'photos') return;
      if (key === 'occurredAt') formData.append(key, dayjs(value as string).toISOString());
      else if (Array.isArray(value)) formData.append(key, JSON.stringify(value));
      else if (value !== undefined && value !== null) formData.append(key, String(value));
    });
    const photoValue = values.photos as Array<{ originFileObj?: File }> | { fileList?: Array<{ originFileObj?: File }> } | undefined;
    const files = Array.isArray(photoValue) ? photoValue : photoValue?.fileList ?? [];
    files.forEach((file) => {
      if (file.originFileObj) formData.append('photos', file.originFileObj);
    });
    await reportIncident(formData);
    message.success('事件已上报');
    setDrawerOpen(false);
    form.resetFields();
  }

  return (
    <Space direction="vertical" size={16} className="page">
      <div className="page-header">
        <div>
          <Typography.Title level={2}>事件管理</Typography.Title>
          <Typography.Text type="secondary">上报、调查、整改与关闭全流程留痕</Typography.Text>
        </div>
        <Button type="primary" onClick={() => setDrawerOpen(true)}>新增事件</Button>
      </div>

      <Form
        form={filterForm}
        layout="inline"
        className="filter-bar"
        onFinish={(values) => loadIncidents({ ...values, page: 1, pageSize: pagination.pageSize })}
      >
        <Form.Item name="severity" label="严重等级">
          <Select allowClear style={{ width: 140 }} options={Object.values(SeverityLevel).map((value) => ({ value, label: value }))} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select allowClear style={{ width: 160 }} options={Object.values(IncidentStatus).map((value) => ({ value, label: value }))} />
        </Form.Item>
        <Button htmlType="submit">筛选</Button>
      </Form>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={incidents}
        pagination={{ ...pagination.tablePagination, total }}
      />

      <Drawer title="上报安全事件" width={540} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Form form={form} layout="vertical" onFinish={submitIncident} initialValues={{ severity: SeverityLevel.Minor, category: IncidentCategory.Other }}>
          <Form.Item name="title" label="事件标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="occurredAt" label="发生时间" rules={[{ required: true }]}>
            <DatePicker showTime className="full" />
          </Form.Item>
          <Space className="full" align="start">
            <Form.Item name="site" label="工地" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="area" label="区域" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Space>
          <Space className="full" align="start">
            <Form.Item name="severity" label="严重等级">
              <Select options={Object.values(SeverityLevel).map((value) => ({ value, label: value }))} />
            </Form.Item>
            <Form.Item name="category" label="分类">
              <Select options={Object.values(IncidentCategory).map((value) => ({ value, label: value }))} />
            </Form.Item>
          </Space>
          <Form.Item name="involvedWorkerIds" label="涉及人员">
            <Select mode="multiple" options={[1, 2, 3, 4].map((value) => ({ value, label: `人员 #${value}` }))} />
          </Form.Item>
          <Form.Item name="photos" label="现场照片" valuePropName="fileList" getValueFromEvent={(event) => event?.fileList ?? []}>
            <Upload beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>选择照片</Button>
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit">提交事件</Button>
        </Form>
      </Drawer>

      <Drawer title="事件详情" width={560} open={Boolean(detail)} onClose={() => setDetail(undefined)}>
        {detail && (
          <Space direction="vertical" size={16} className="full">
            <Typography.Title level={4}>{detail.title}</Typography.Title>
            <Space><RiskLevelTag level={detail.severity} /><StatusBadge status={detail.status} /></Space>
            <Typography.Paragraph>{detail.description}</Typography.Paragraph>
            <UserAvatar userId={detail.reporterId} />
            <Timeline items={(detail.timeline ?? []).map((item) => ({ children: `${dayjs(item.at).format('MM-DD HH:mm')} ${item.label}${item.note ? `：${item.note}` : ''}` }))} />
          </Space>
        )}
      </Drawer>
    </Space>
  );
}
