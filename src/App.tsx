import React, { useEffect, useState } from 'react';
import Slideshow from './components/Slideshow';

function App() {
  // Set slide duration to 10 seconds per slide
  const slideDuration = 10;

  const [pdfs, setPdfs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPreloading, setIsPreloading] = useState(true);

  // PDFファイルを自動で読み込む
  useEffect(() => {
    const loadPdfs = async () => {
      try {
        // 現在のホスト名を取得
        const hostname = window.location.hostname;
        const port = 3002;
        const apiUrl = `http://${hostname}:${port}/api/pdfs`;

        console.log('Loading PDFs from:', apiUrl);

        // publicフォルダ内のpdfsディレクトリをスキャン
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF list: ${response.status} ${response.statusText}`);
        }
        const files = await response.json();
        
        if (!Array.isArray(files) || files.length === 0) {
          throw new Error('No PDF files found');
        }

        console.log('Found PDF files:', files);

        // ファイル名でソート
        const sortedFiles = files
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(file => `http://${hostname}:${port}${file.path}`);

        console.log('Sorted PDF URLs:', sortedFiles);

        setPdfs(sortedFiles);
        setError(null);

        // すべてのPDFをプリロード
        await Promise.all(
          sortedFiles.map(async (pdfUrl) => {
            try {
              console.log('Preloading PDF:', pdfUrl);
              const response = await fetch(pdfUrl);
              if (!response.ok) {
                throw new Error(`Failed to preload PDF: ${response.status} ${response.statusText}`);
              }
              const data = await response.arrayBuffer();
              console.log('Successfully preloaded PDF:', pdfUrl);
              return data;
            } catch (error) {
              console.error(`Error preloading PDF ${pdfUrl}:`, error);
              return null;
            }
          })
        );

        setIsPreloading(false);
      } catch (error) {
        console.error('Error loading PDFs:', error);
        setError(error instanceof Error ? error.message : 'PDFの読み込みに失敗しました');
        setIsPreloading(false);
      }
    };

    loadPdfs();
  }, []);

  // 画面サイズの状態を管理
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // 画面サイズが変更された時の処理
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // PDFが読み込まれるまで待機
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (isPreloading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">PDFをプリロード中...</div>
      </div>
    );
  }

  if (pdfs.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">PDFファイルが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="font-sans w-screen h-screen overflow-hidden" style={{ width: dimensions.width, height: dimensions.height }}>
      <Slideshow 
        pdfs={pdfs}
        slideDuration={slideDuration}
        dimensions={dimensions}
      />
    </div>
  );
}

export default App;