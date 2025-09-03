// src/NewIssuePage.tsx

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// 导入 UnderlineNav
import { Box, Button, TextInput, Text, Textarea, Avatar, UnderlineNav } from '@primer/react';
import ReactMarkdown from 'react-markdown';

const WORKER_URL = import.meta.env.VITE_WORKER_URL;

export function NewIssuePage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      alert('Title and description are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch(`${WORKER_URL}/api/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to create issue:', error);
      alert('Failed to create issue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${WORKER_URL}/upload`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Upload failed');
      const { url } = await response.json();
      const markdownImage = `![${file.name}](${url})`;
      setBody((prevBody) => `${prevBody}\n${markdownImage}`);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed!');
    } finally {
      setIsUploading(false);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Box sx={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem', display: 'flex', gap: 3 }}>
        <Box>
            <Avatar src="https://github.com/github.png" size={40} />
        </Box>
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <Box sx={{
          position: 'absolute', top: '10px', left: '-8px', width: 0, height: 0,
          borderTop: '8px solid transparent', borderBottom: '8px solid transparent',
          borderRight: '8px solid', borderRightColor: 'border.default',
        }}/>
        <Box sx={{
            position: 'absolute', top: '11px', left: '-6px', width: 0, height: 0,
            borderTop: '7px solid transparent', borderBottom: '7px solid transparent',
            borderRight: '7px solid', borderRightColor: 'canvas.default',
        }}/>
            
            <Box borderWidth={1} borderStyle="solid" borderColor="border.default" borderRadius={6}>
                <Box sx={{ p: 2 }}>
                    <Text as="p" sx={{ fontWeight: 'bold', mb: 1 }}>Add a title</Text>
                    <TextInput 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        sx={{ width: '100%' }}
                        aria-label="Title"
                        placeholder="Title"
                    />
                </Box>
                <Box sx={{ borderTop: '1px solid', borderColor: 'border.default' }}>
                    {/* 
                      FIX: 使用 UnderlineNav.Item 替代 UnderlineNav.Link
                      并使用 aria-current="page" 来表示选中状态，这是更标准的做法
                    */}
                    <UnderlineNav aria-label="Main">
                        <UnderlineNav.Item 
                          aria-current={selectedTab === 'write' ? 'page' : undefined} 
                          onSelect={e => { e.preventDefault(); setSelectedTab('write'); }}>
                            Write
                        </UnderlineNav.Item>
                        <UnderlineNav.Item 
                          aria-current={selectedTab === 'preview' ? 'page' : undefined} 
                          onSelect={e => { e.preventDefault(); setSelectedTab('preview'); }}>
                            Preview
                        </UnderlineNav.Item>
                    </UnderlineNav>
                    <Box sx={{ p: 2 }}>
                        {selectedTab === 'write' ? (
                            <Textarea
                                value={body}
                                onChange={e => setBody(e.target.value)}
                                sx={{ width: '100%', minHeight: '200px', fontFamily: 'mono' }}
                                placeholder="Type your description here..."
                            />
                        ) : (
                            <Box className="markdown-body" sx={{ minHeight: '200px' }}>
                                {body.trim() ? <ReactMarkdown>{body}</ReactMarkdown> : <Text sx={{ color: 'fg.muted' }}>Nothing to preview</Text>}
                            </Box>
                        )}
                    </Box>
                    <Box sx={{ p: 2, bg: 'canvas.subtle', borderTop: '1px solid', borderColor: 'border.default' }}>
                         <input
                           type="file"
                           ref={fileInputRef}
                           onChange={handleImageUpload}
                           accept="image/*"
                           style={{ display: 'none' }}
                         />
                         <Button
                           variant="invisible"
                           onClick={() => fileInputRef.current?.click()}
                           disabled={isUploading}
                           sx={{color: 'fg.muted', fontWeight: 'normal'}}
                         >
                           {isUploading ? 'Uploading...' : 'Add Files'}
                         </Button>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button onClick={() => navigate('/')}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting || !title.trim()}>
                    {isSubmitting ? 'Creating...' : 'Create'}
                </Button>
            </Box>
        </Box>
    </Box>
  );
}