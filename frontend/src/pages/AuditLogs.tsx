import { useEffect, useState } from 'react';
import { Table, Typography, Space } from 'antd';
import { dashboardApi } from '../api/dashboard';

export function AuditLogs() {
  const [logs, setLogs] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.auditLogs().then(setLogs).finally(() => setLoading(false));
  }, []);

  return (
    <Space direction="vertical" size={16} className="page">
      <div className="page-header">
        <div>
          <Typography.Title level={2}>审计日志</Typography.Title>
          <Typography.Text type="secondary">安全操作与权限动作统一记录</Typography.Text>
        </div>
      </div>
      <Table
        rowKey={(record) => String(record.id)}
        loading={loading}
        dataSource={logs}
        columns={[
          { title: '时间', dataIndex: 'createdAt' },
          { title: '操作', dataIndex: 'action' },
          { title: '资源', dataIndex: 'resource' },
          { title: '角色', dataIndex: 'userRole' },
          { title: '方法', dataIndex: 'method' },
          { title: '状态码', dataIndex: 'statusCode' },
        ]}
      />
    </Space>
  );
}
