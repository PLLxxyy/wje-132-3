import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { router } from './router';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1f6f59',
          colorInfo: '#1f6f59',
          borderRadius: 6,
          fontFamily:
            '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif',
        },
        components: {
          Layout: { siderBg: '#18221f', triggerBg: '#18221f' },
          Card: { borderRadiusLG: 6 },
        },
      }}
    >
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </ConfigProvider>
  </React.StrictMode>,
);
