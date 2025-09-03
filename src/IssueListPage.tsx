// src/IssueListPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Text, Heading, TextInput, Link, Tooltip } from '@primer/react';
import { IssueOpenedIcon, ImageIcon } from '@primer/octicons-react';

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

interface Issue {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

// 一个简单的函数来检查 issue body 是否包含 markdown 图片
const containsImage = (text: string): boolean => {
  const imageRegex = /!\[.*?\]\(.*?\)/;
  return imageRegex.test(text);
};

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
      setIssues(data.sort((a: Issue, b: Issue) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // FIX: 使用响应式内边距 px: [2, 3, 4]
    <Box sx={{ maxWidth: 1200, margin: '2rem auto', px: [2, 3, 4] }}>
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
            <Box sx={{ mr: 2, color: 'success.fg', mt: '2px' }}>
              <IssueOpenedIcon size={16} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* FIX: 将标题变成指向详情页的链接 */}
                <Link as={RouterLink} to={`/issues/${issue.id}`} sx={{ fontWeight: 'bold', color: 'fg.default', '&:hover': { color: 'accent.fg' } }}>
                  {issue.title}
                </Link>
                {/* FIX: 如果包含图片，则显示图标 */}
                {containsImage(issue.body) && (
                  <Tooltip text="Contains images">
                    <ImageIcon size={16} />
                  </Tooltip>
                )}
              </Box>
              {/* FIX: 不再渲染 Markdown，只显示纯文本摘要 */}
              <Text sx={{ fontSize: 1, color: 'fg.muted', display: 'block', mt: 1 }}>
                #{issue.id.substring(0, 6)} opened on {new Date(issue.createdAt).toLocaleDateString()}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}