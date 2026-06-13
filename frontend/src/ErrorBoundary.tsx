import { Component, ReactNode } from 'react';
import { Alert, Button } from 'antd';

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <Alert
            type="error"
            showIcon
            message="页面加载失败"
            description="请刷新页面或联系系统管理员查看错误码。"
            action={<Button onClick={() => window.location.reload()}>刷新</Button>}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
