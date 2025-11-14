import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ClickToComponent } from '@finfe/cli2/click-to-react-component';
import '@ss/mtd-react3/dist/mtd-react3.min.css';
import './styles/global.scss';
import './styles/tailwind-base.scss';
import { BeConfigProvider } from '@finfe/beetle-ui';

// 获取根元素
const container = document.getElementById('main');
if (!container) {
  throw new Error('Failed to find the root element');
}

// 创建 React 18 根节点
const root = createRoot(container);

// 渲染应用
root.render(
  // 将 App 包裹在 BrowserRouter 中，确保路由 Hooks 有效
  <>
  <BeConfigProvider styleProviderConfig={{container: document.querySelector('micro-app-head')}}>
    <BrowserRouter basename="/training">
      <ClickToComponent editor={CLICK_TO_REACT_COMPONENT_EDITOR} />
      <App />
    </BrowserRouter>
  </BeConfigProvider>
  </>,
);
