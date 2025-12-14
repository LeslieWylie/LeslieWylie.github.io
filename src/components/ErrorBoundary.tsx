import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary 捕获到错误:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg border border-red-200 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">出现错误</h2>
                <p className="text-gray-600 mt-1">应用遇到了一个意外错误</p>
              </div>
            </div>

            {this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-mono text-red-800 break-all">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="text-sm text-red-700 cursor-pointer hover:text-red-900">
                      查看详细错误信息
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-60 p-2 bg-red-100 rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <RefreshCw className="w-5 h-5" />
                刷新页面
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                返回首页
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                如果问题持续存在，请尝试：
              </p>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>清除浏览器缓存和 Cookie</li>
                <li>检查浏览器控制台是否有更多错误信息</li>
                <li>刷新页面或重新加载应用</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

