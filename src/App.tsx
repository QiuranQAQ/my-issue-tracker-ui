import { Routes, Route } from 'react-router-dom';
import { PageLayout } from '@primer/react';
import { IssueListPage } from './IssueListPage';
import { NewIssuePage } from './NewIssuePage';

function App() {
  return (
    <PageLayout containerWidth="full">
      <PageLayout.Content>
        <Routes>
          <Route path="/" element={<IssueListPage />} />
          <Route path="/new" element={<NewIssuePage />} />
          {/* 以后可以添加 Issue 详情页: <Route path="/issues/:id" element={<IssueDetailPage />} /> */}
        </Routes>
      </PageLayout.Content>
    </PageLayout>
  );
}

export default App;