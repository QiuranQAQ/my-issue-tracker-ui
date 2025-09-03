// src/IssueListPage.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Text, Heading, TextInput } from '@primer/react';
import { IssueOpenedIcon } from '@primer/octicons-react';
import ReactMarkdown from 'react-markdown';

// 从环境变量读取 Worker URL
const WORKER_URL = import.meta.env.VITE_WORKER_URL;

interface Issue {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export function IssueListPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${WORKER_URL}/api/issues`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      // FIX 1 & 2: 为 a 和 b 添加明确的 Issue 类型
      setIssues(data.sort((a: Issue, b: Issue) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ flexGrow: 1, mr: 3 }}>
          <TextInput
            leadingVisual={() => <Text sx={{color: 'fg.muted'}}>is:issue state:open</Text>}
            aria-label="Search all issues"
            name="search"
            placeholder=""
            sx={{ width: '100%' }}
          />
        </Box>
        <Box>
          <Button variant="primary" onClick={() => navigate('/new')}>
            New issue
          </Button>
        </Box>
      </Box>

      <Box borderWidth={1} borderStyle="solid" borderColor="border.default" borderRadius={6}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', p: 3, bg: 'canvas.subtle', borderBottom: '1px solid', borderColor: 'border.default' }}
        >
          <Heading sx={{ fontSize: 1, fontWeight: 'bold' }}>
            <IssueOpenedIcon /> {issues.length} Open
          </Heading>
        </Box>
        {loading && <Box sx={{ p: 4, textAlign: 'center' }}>Loading issues...</Box>}
        {!loading && issues.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Heading sx={{ fontSize: 3, mb: 2 }}>No results</Heading>
            <Text>Try adjusting your search filters.</Text>
          </Box>
        )}
        {!loading && issues.map((issue) => (
          <Box
            key={issue.id}
            sx={{ display: 'flex', p: 2, borderTop: '1px solid', borderColor: 'border.default', '&:first-of-type': { borderTop: 'none' } }}
          >
            <Box sx={{ mr: 2, color: 'success.fg' }}>
              <IssueOpenedIcon size={16} />
            </Box>
            <Box>
              {/* FIX 3 & 4: 使用 Box as="h3" 替代 Heading，避免类型冲突 */}
              <Box as="h3" sx={{ fontSize: 2, fontWeight: 'bold', mb: 1, margin: 0 }}>
                {issue.title}
              </Box>
              <Box sx={{ fontSize: 1, color: 'fg.muted', maxHeight: '4.5em', overflow: 'hidden' }}>
                 <ReactMarkdown>{issue.body.length > 300 ? `${issue.body.substring(0, 300)}...` : issue.body}</ReactMarkdown>
              </Box>
              <Text sx={{ fontSize: 0, color: 'fg.subtle', mt: 1 }}>
                Opened on {new Date(issue.createdAt).toLocaleString()}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}