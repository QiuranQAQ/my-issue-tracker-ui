import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown'; // 用于渲染 Issue body
import '@primer/css/index.scss';

// 请先安装 react-markdown: npm install react-markdown
const WORKER_URL = 'https://my-issue-tracker-worker.akidyestudio.workers.dev';

interface Issue {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

function App() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    // 注意: API 路径已更新
    const response = await fetch(`${WORKER_URL}/api/issues`);
    const data = await response.json();
    setIssues(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 注意: API 路径已更新
    await fetch(`${WORKER_URL}/api/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    });
    setTitle('');
    setBody('');
    fetchIssues();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${WORKER_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const { url } = await response.json();
      const markdownImage = `![${file.name}](${url})`;
      
      // 在光标位置插入图片链接
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = text.substring(0, start) + markdownImage + text.substring(end);
        setBody(newText);
      } else {
        setBody((prevBody) => `${prevBody}\n${markdownImage}`);
      }
      
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed!');
    } finally {
      setIsUploading(false);
      // 重置文件输入，以便可以再次上传同一个文件
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container-lg p-responsive">
      <div className="Box mb-4">
        {/* ... (New Issue 表单部分) ... */}
        <div className="Box-body">
          <form onSubmit={handleSubmit}>
            {/* ... (Title input) ... */}
             <div className="form-group">
              <label htmlFor="body">Body</label>
              <textarea
                ref={textareaRef}
                className="form-control"
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              ></textarea>
              {/* 图片上传控件 */}
              <div className="text-right mt-2">
                 <input
                   type="file"
                   ref={fileInputRef}
                   onChange={handleImageUpload}
                   accept="image/*"
                   style={{ display: 'none' }}
                 />
                 <button
                   type="button"
                   className="btn btn-sm"
                   onClick={() => fileInputRef.current?.click()}
                   disabled={isUploading}
                 >
                   {isUploading ? 'Uploading...' : 'Attach an image'}
                 </button>
              </div>
            </div>
            {/* ... (Submit button) ... */}
          </form>
        </div>
      </div>

      <div className="Box">
        <div className="Box-header">
          <h3 className="Box-title">Issues ({issues.length})</h3>
        </div>
        <ul>
          {issues.map((issue) => (
            <li key={issue.id} className="Box-row">
              <strong>{issue.title}</strong>
              {/* 使用 ReactMarkdown 来渲染 body 内容 */}
              <div className="markdown-body">
                <ReactMarkdown>{issue.body}</ReactMarkdown>
              </div>
              <small>Opened on: {new Date(issue.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;