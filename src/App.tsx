import React, { useEffect, useState } from 'react';
import Slideshow from './components/Slideshow';

function App() {
  // Set slide duration to 10 seconds per slide
  const slideDuration = 10;

  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 画像ファイルを自動で読み込む
  useEffect(() => {
    const loadImages = async () => {
      try {
        // 現在のホスト名を取得
        const hostname = window.location.hostname;
        const port = 3002;
        const apiUrl = `http://${hostname}:${port}/api/images`;

        console.log('Loading images from:', apiUrl);

        // publicフォルダ内のimagesディレクトリをスキャン
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image list: ${response.status} ${response.statusText}`);
        }
        const files = await response.json();
        
        if (!Array.isArray(files) || files.length === 0) {
          throw new Error('No image files found');
        }

        console.log('Found image files:', files);

        // ファイル名でソート
        const sortedFiles = files
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(file => `http://${hostname}:${port}${file.path}`);

        console.log('Sorted image URLs:', sortedFiles);

        setImages(sortedFiles);
        setError(null);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
        setError(error instanceof Error ? error.message : '画像の読み込みに失敗しました');
        setIsLoading(false);
      }
    };

    loadImages();
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

  // 画像が読み込まれるまで待機
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">画像を読み込んでいます...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">画像ファイルが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="font-sans w-screen h-screen overflow-hidden" style={{ width: dimensions.width, height: dimensions.height }}>
      <Slideshow 
        images={images}
        slideDuration={slideDuration}
        dimensions={dimensions}
      />
    </div>
  );
}

export default App;