const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

// Express サーバーの設定
const setupServer = () => {
  const server = express();
  server.use(cors());

  // PDFファイルリストを提供するエンドポイント
  server.get('/api/pdfs', (req, res) => {
    const pdfDir = path.join(process.env.NODE_ENV === 'development' 
      ? process.cwd()
      : process.resourcesPath, 
      'public', 'pdfs'
    );

    console.log('PDF directory path:', pdfDir);
    
    try {
      if (!fs.existsSync(pdfDir)) {
        console.error('PDF directory does not exist:', pdfDir);
        return res.status(404).json({ error: 'PDF directory not found' });
      }

      const files = fs.readdirSync(pdfDir)
        .filter(file => file.toLowerCase().endsWith('.pdf'));
      
      console.log('Found PDF files:', files);
      
      if (files.length === 0) {
        console.warn('No PDF files found in directory:', pdfDir);
      }

      res.json(files);
    } catch (error) {
      console.error('Error reading PDF directory:', error);
      res.status(500).json({ error: 'Failed to read PDF directory', details: error.message });
    }
  });

  // 開発環境の場合は3002ポートで起動（Viteは3001を使用）
  const port = 3002;
  server.listen(port, () => {
    console.log(`API server running on port ${port}`);
  });
};

function createWindow() {
  // プライマリディスプレイのサイズを取得
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const win = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    fullscreen: true,
    frame: false,
    show: false,
    // 画面の自動調整を有効化
    resizable: true,
    maximizable: true,
    // 画面の自動調整を有効化
    autoHideMenuBar: true,
    // 画面の自動調整を有効化
    useContentSize: true
  });

  // APIサーバーのセットアップ
  setupServer();

  // 開発環境ではViteの開発サーバーに接続
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3001');
  } else {
    // 本番環境ではビルドされたファイルを読み込む
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // ウィンドウが準備できたら表示
  win.once('ready-to-show', () => {
    win.show();
    // フルスクリーン表示
    win.setFullScreen(true);
  });

  // 画面サイズが変更された時の処理
  screen.on('display-metrics-changed', () => {
    const newDisplay = screen.getPrimaryDisplay();
    const { width: newWidth, height: newHeight } = newDisplay.workAreaSize;
    win.setSize(newWidth, newHeight);
    win.setFullScreen(true);
  });

  // ESCキーでアプリケーションを終了
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Escape') {
      app.quit();
    }
  });

  // エラーが発生した場合のハンドリング
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 