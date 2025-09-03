// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // 您可以保留这个文件用于少量全局样式
import { ThemeProvider, BaseStyles } from '@primer/react'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <BaseStyles>
          <App />
        </BaseStyles>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)