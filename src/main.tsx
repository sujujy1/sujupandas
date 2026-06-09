import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 全局错误捕获
window.onerror = function(message, source, lineno, colno, error) {
  console.error('全局错误:', { message, source, lineno, colno, error });
  // 显示错误到页面
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; background: #fee2e2; color: #dc2626; font-family: sans-serif;">
        <h1>页面加载出错</h1>
        <p><strong>错误信息:</strong> ${message}</p>
        <p><strong>文件:</strong> ${source}</p>
        <p><strong>行号:</strong> ${lineno}</p>
        <p>请刷新页面试试，或者检查浏览器控制台的详细错误信息。</p>
      </div>
    `;
  }
  return false;
};

window.addEventListener('unhandledrejection', function(event) {
  console.error('未处理的Promise拒绝:', event.reason);
});

console.log('开始加载React应用...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('找不到root元素');
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('React应用加载完成');
} catch (error) {
  console.error('React应用初始化失败:', error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; background: #fee2e2; color: #dc2626; font-family: sans-serif;">
        <h1>应用初始化失败</h1>
        <p><strong>错误:</strong> ${error}</p>
        <p>请刷新页面试试，或者检查浏览器控制台的详细错误信息。</p>
      </div>
    `;
  }
}