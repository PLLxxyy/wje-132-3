import { Avatar, Space, Typography } from 'antd';

const workerNames: Record<number, string> = {
  1: '赵工',
  2: '李安全',
  3: '王巡检',
  4: '陈班组',
};

export function UserAvatar({ userId, name }: { userId?: number; name?: string }) {
  const displayName = name ?? workerNames[userId ?? 0] ?? `人员 #${userId ?? '-'}`;
  return (
    <Space size={8}>
      <Avatar size={28} style={{ background: '#274c43' }}>
        {displayName.slice(0, 1)}
      </Avatar>
      <Typography.Text>{displayName}</Typography.Text>
    </Space>
  );
}
