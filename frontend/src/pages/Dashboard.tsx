import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Col, List, Row, Skeleton, Space, Statistic, Typography } from 'antd';
import { dashboardApi, DashboardSummary } from '../api/dashboard';
import { RiskLevelTag } from '../components/common/RiskLevelTag';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { SeverityLevel } from '../types/enums';

export function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.summary().then(setSummary).finally(() => setLoading(false));
  }, []);

  if (loading || !summary) return <Skeleton active paragraph={{ rows: 12 }} />;

  const trendOption = {
    color: ['#1f6f59'],
    grid: { top: 24, right: 18, bottom: 32, left: 40 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: summary.incidents.trend.map((item) => item.date) },
    yAxis: { type: 'value', minInterval: 1 },
    series: [
      {
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.12 },
        data: summary.incidents.trend.map((item) => item.count),
      },
    ],
  };

  const riskOption = {
    color: ['#2f7d32', '#5f7f24', '#b7791f', '#b54708', '#9f1239'],
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['48%', '72%'],
        label: { formatter: '{b}: {c}' },
        data: summary.incidents.severityDistribution.map((item) => ({
          name: item.severity,
          value: item.count,
        })),
      },
    ],
  };

  return (
    <Space direction="vertical" size={18} className="page">
      <div className="page-header">
        <div>
          <Typography.Title level={2}>安全概览仪表盘</Typography.Title>
          <Typography.Text type="secondary">近 30 天事件、检查与培训状态</Typography.Text>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title="安全事件" value={summary.incidents.total} suffix="起" />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title="检查平均分" value={summary.inspectionSummary.averageScore} suffix="分" />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title="待整改检查" value={summary.inspectionSummary.failed} suffix="项" />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title="本月培训完成率" value={summary.trainingCompletionRate} suffix="%" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={15}>
          <Card title="近 30 天事件趋势">
            <ReactECharts option={trendOption} style={{ height: 320 }} />
          </Card>
        </Col>
        <Col xs={24} xl={9}>
          <Card title="风险等级分布">
            <ReactECharts option={riskOption} style={{ height: 320 }} />
          </Card>
        </Col>
      </Row>

      <Card title="待整改项列表">
        {summary.incidents.pendingCorrectives.length ? (
          <List
            dataSource={summary.incidents.pendingCorrectives}
            renderItem={(incident) => (
              <List.Item
                actions={[
                  <RiskLevelTag key="risk" level={incident.severity as SeverityLevel} />,
                  <StatusBadge key="status" status={incident.status} />,
                ]}
              >
                <List.Item.Meta
                  title={incident.title}
                  description={`${incident.site} / ${incident.area} / 截止 ${incident.correctiveDeadline ?? '未设置'}`}
                />
              </List.Item>
            )}
          />
        ) : (
          <EmptyState description="暂无待整改事件" />
        )}
      </Card>
    </Space>
  );
}
