// src/IssueDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Text, Avatar, Breadcrumbs } from '@primer/react';
import ReactMarkdown from 'react-markdown';

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

interface Issue {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export function IssueDetailPage() {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>(); // 从 URL 中获取 issue ID

  useEffect(() => {
    if (id) {
      fetchIssue(id);
    }
  }, [id]);

  const fetchIssue = async (issueId: string) => {
    try {
      setLoading(true);
      // 注意 API 路径现在是 /api/issues/:id
      const response = await fetch(`${WORKER_URL}/api/issues/${issueId}`);
      if (!response.ok) throw new Error('Issue not found');
      const data = await response.json();
      setIssue(data);
    } catch (error) {
      console.error("Failed to fetch issue:", error);
      setIssue(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Box sx={{ p: 4, textAlign: 'center' }}>Loading issue...</Box>;
  }

  if (!issue) {
    return <Box sx={{ p: 4, textAlign: 'center' }}>Issue not found.</Box>;
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: '2rem auto', px: [2, 3, 4] }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Breadcrumbs.Item as={RouterLink} to="/">Issues</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">{id?.substring(0, 6)}</Breadcrumbs.Item>
      </Breadcrumbs>

      <Heading sx={{ fontSize: 4, mb: 2 }}>{issue.title}</Heading>
      
      <Box borderWidth={1} borderStyle="solid" borderColor="border.default" borderRadius={6}>
        <Box sx={{ display: 'flex', p: 3, bg: 'canvas.subtle', borderBottom: '1px solid', borderColor: 'border.default', alignItems: 'center' }}>
            <Avatar src="https://github.com/github.png" size={32} sx={{mr: 2}} />
            <Text sx={{fontSize: 1, color: 'fg.muted'}}>
                Opened on {new Date(issue.createdAt).toLocaleString()}
            </Text>
        </Box>
        {/* 这是修复图片溢出的关键 */}
        <Box 
          className="markdown-body" 
          sx={{ 
            p: 3,
            '& img': { maxWidth: '100%', height: 'auto' } 
          }}
        >
          <ReactMarkdown>{issue.body}</ReactMarkdown>
        </Box>
      </Box>
      {/* 可以在这里添加评论区 */}
    </Box>
  );
}