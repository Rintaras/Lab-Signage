const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

// Express サーバーの設定
const setupServer = () => {
  const server = express();
  
  // CORSの設定を追加
  server.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  }));

  // 静的ファイルの提供
  const pdfDir = path.join(
    process.env.NODE_ENV === 'development' 
      ? process.cwd()
      : process.resourcesPath,
    'public',
    'pdfs'
  );

  // PDFディレクトリが存在しない場合は作成
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  // 静的ファイルの提供
  server.use('/pdfs', express.static(pdfDir, {
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }));

  // PDFファイルリストを提供するエンドポイント
  server.get('/api/pdfs', (req, res) => {
    try {
      const files = fs.readdirSync(pdfDir)
        .filter(file => file.toLowerCase().endsWith('.pdf'))
        .map(file => ({
          name: file,
          path: `/pdfs/${file}`
        }));
      res.json(files);
    } catch (error) {
      console.error('Error reading PDF directory:', error);
      res.status(500).json({ error: 'Failed to read PDF directory' });
    }
  });

  // PDFファイルを提供するエンドポイント
  server.get('/pdfs/:filename', (req, res) => {
    const pdfPath = path.join(pdfDir, req.params.filename);
    
    if (fs.existsSync(pdfPath)) {
      res.sendFile(pdfPath, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=31536000'
        }
      });
    } else {
      res.status(404).json({ error: 'PDF file not found' });
    }
  });

  // 開発環境の場合は3002ポートで起動（Viteは3001を使用）
  const port = 3002;
  const host = '0.0.0.0'; // すべてのネットワークインターフェースでリッスン
  server.listen(port, host, () => {
    console.log(`API server running on http://${host}:${port}`);
  });
};

function createWindow() {
  let width = 1920; // デフォルトの幅
  let height = 1080; // デフォルトの高さ

  try {
    // プライマリディスプレイのサイズを取得
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: displayWidth, height: displayHeight } = primaryDisplay.workAreaSize;
    width = displayWidth;
    height = displayHeight;
    console.log(`Display size: ${width}x${height}`);
  } catch (error) {
    console.error('Error getting display size:', error);
    console.log('Using default display size');
  }

  const win = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
      webviewTag: true,
      plugins: true
    },
    fullscreen: true,
    frame: false,
    show: false,
    resizable: true,
    maximizable: true,
    autoHideMenuBar: true,
    useContentSize: true
  });

  // APIサーバーのセットアップ
  setupServer();

  // 開発環境ではViteの開発サーバーに接続
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3003').catch(err => {
      console.error('Failed to load development URL:', err);
      // 本番環境のファイルをフォールバックとして読み込む
      win.loadFile(path.join(__dirname, '../dist/index.html'));
    });
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
    try {
      const newDisplay = screen.getPrimaryDisplay();
      const { width: newWidth, height: newHeight } = newDisplay.workAreaSize;
      win.setSize(newWidth, newHeight);
      win.setFullScreen(true);
    } catch (error) {
      console.error('Error handling display metrics change:', error);
    }
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

  // コンテンツの読み込み完了時の処理
  win.webContents.on('did-finish-load', () => {
    console.log('Content loaded successfully');
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