import { Empty } from 'antd';

export function EmptyState({ description = '暂无安全记录' }: { description?: string }) {
  return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />;
}
