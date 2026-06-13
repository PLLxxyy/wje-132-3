import {
  AlertTriangle,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  ScrollText,
} from 'lucide-react';
import { Layout, Menu, Select, Space, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { roleLabels } from './types/roles';
import { UserRole } from './types/enums';

const { Header, Content, Sider } = Layout;

const menuItems = [
  { key: '/dashboard', icon: <LayoutDashboard size={18} />, label: '安全概览' },
  { key: '/incidents', icon: <AlertTriangle size={18} />, label: '事件管理' },
  { key: '/inspections', icon: <ClipboardCheck size={18} />, label: '检查管理' },
  { key: '/trainings', icon: <GraduationCap size={18} />, label: '培训管理' },
  { key: '/certifications', icon: <FileCheck2 size={18} />, label: '资质审核' },
  { key: '/audit-logs', icon: <ScrollText size={18} />, label: '审计日志' },
];

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setRole } = useAuthStore();

  return (
    <Layout className="app-layout">
      <Sider width={248} breakpoint="lg" collapsedWidth={0}>
        <div className="brand">
          <div className="brand-mark">安</div>
          <div>
            <Typography.Title level={4}>施工安全平台</Typography.Title>
            <Typography.Text>Safety Platform</Typography.Text>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(item) => navigate(item.key)}
        />
      </Sider>
      <Layout>
        <Header className="topbar">
          <Space direction="vertical" size={0}>
            <Typography.Text className="project-name">城东综合体项目</Typography.Text>
            <Typography.Title level={3}>建筑施工安全管理平台</Typography.Title>
          </Space>
          <Space>
            <Typography.Text type="secondary">当前角色</Typography.Text>
            <Select
              value={user.role}
              style={{ width: 152 }}
              onChange={(value) => setRole(value)}
              options={Object.values(UserRole).map((role) => ({
                value: role,
                label: roleLabels[role],
              }))}
            />
          </Space>
        </Header>
        <Content className="content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
