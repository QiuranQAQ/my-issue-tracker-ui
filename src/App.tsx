// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { PageLayout } from '@primer/react';
import { IssueListPage } from './IssueListPage';
import { NewIssuePage } from './NewIssuePage';
import { IssueDetailPage } from './IssueDetailPage'; // 导入新页面

function App() {
  return (
    <PageLayout containerWidth="full">
      {/* 移除了 PageLayout.Content，让子页面自己控制内边距以实现更好的响应式 */}
      <Routes>
        <Route path="/" element={<IssueListPage />} />
        <Route path="/new" element={<NewIssuePage />} />
        {/* 添加详情页面的路由，:id 是一个动态参数 */}
        <Route path="/issues/:id" element={<IssueDetailPage />} />
      </Routes>
    </PageLayout>
  );
}

export default App;