import React, { useEffect, useState } from 'react';
import Slideshow from './components/Slideshow';

function App() {
  // Set slide duration to 10 seconds per slide
  const slideDuration = 10;

  const [pdfs, setPdfs] = useState<string[]>([]);

  // PDFファイルを自動で読み込む
  useEffect(() => {
    const loadPdfs = async () => {
      try {
        // publicフォルダ内のpdfsディレクトリをスキャン
        const response = await fetch('/api/pdfs');
        if (!response.ok) throw new Error('Failed to fetch PDF list');
        const files: string[] = await response.json();
        
        // ファイル名でソート
        const sortedFiles = files.sort((a, b) => a.localeCompare(b));
        setPdfs(sortedFiles.map(file => `/pdfs/${file}`));
      } catch (error) {
        console.error('Error loading PDFs:', error);
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
  if (pdfs.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading PDFs...</div>
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