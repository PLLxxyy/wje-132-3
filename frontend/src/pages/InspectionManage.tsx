import { useEffect, useState } from 'react';
import { Button, Card, Checkbox, Drawer, Form, Input, List, Progress, Space, Table, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { inspectionApi } from '../api/inspection';
import { EmptyState } from '../components/common/EmptyState';
import { StatusBadge } from '../components/common/StatusBadge';
import { useInspectionStore } from '../stores/inspectionStore';
import type { InspectionItem, SafetyInspection } from '../types';

export function InspectionManage() {
  const { inspections, loading, loadInspections, executeInspection } = useInspectionStore();
  const [active, setActive] = useState<SafetyInspection>();
  const [report, setReport] = useState<string>();
  const [form] = Form.useForm();

  useEffect(() => {
    loadInspections();
  }, [loadInspections]);

  const columns: ColumnsType<SafetyInspection> = [
    { title: '检查名称', dataIndex: 'name' },
    { title: '类型', dataIndex: 'type' },
    { title: '区域', dataIndex: 'area' },
    { title: '检查日期', dataIndex: 'inspectionDate' },
    { title: '状态', dataIndex: 'status', render: (status) => <StatusBadge status={status} /> },
    { title: '评分', dataIndex: 'totalScore', render: (score) => <Progress percent={score} size="small" /> },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => { setActive(record); form.setFieldsValue({ items: record.items.length ? record.items : [{ name: '临边防护', passed: true, photoUrls: [] }] }); }}>
            执行检查
          </Button>
          <Button size="small" onClick={() => inspectionApi.report(record.id).then((value) => setReport(value.summary))}>
            生成报告
          </Button>
        </Space>
      ),
    },
  ];

  async function submit(values: { items: InspectionItem[] }) {
    if (!active) return;
    await executeInspection(active.id, values.items);
    message.success('检查结果已提交');
    setActive(undefined);
  }

  return (
    <Space direction="vertical" size={16} className="page">
      <div className="page-header">
        <div>
          <Typography.Title level={2}>检查管理</Typography.Title>
          <Typography.Text type="secondary">检查计划、逐项勾选、拍照记录和报告输出</Typography.Text>
        </div>
      </div>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={inspections}
        locale={{ emptyText: <EmptyState description="暂无检查计划" /> }}
      />
      {report && (
        <Card title="检查结果报告" extra={<Button onClick={() => setReport(undefined)}>关闭</Button>}>
          {report}
        </Card>
      )}
      <Drawer title="执行检查" width={560} open={Boolean(active)} onClose={() => setActive(undefined)}>
        <Form form={form} layout="vertical" onFinish={submit}>
          <Form.List name="items">
            {(fields, { add }) => (
              <Space direction="vertical" size={12} className="full">
                {fields.map((field) => (
                  <Card key={field.key} size="small">
                    <Form.Item name={[field.name, 'name']} label="检查项名称" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name={[field.name, 'passed']} valuePropName="checked">
                      <Checkbox>合格</Checkbox>
                    </Form.Item>
                    <Form.Item name={[field.name, 'remark']} label="备注">
                      <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name={[field.name, 'photoUrls']} hidden initialValue={[]}><Input /></Form.Item>
                  </Card>
                ))}
                <Button onClick={() => add({ name: '', passed: false, photoUrls: [] })}>新增检查项</Button>
              </Space>
            )}
          </Form.List>
          <Button className="submit-row" type="primary" htmlType="submit">提交检查结果</Button>
        </Form>
      </Drawer>
    </Space>
  );
}
