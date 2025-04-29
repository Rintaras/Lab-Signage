import React, { useEffect, useState } from 'react';
import Slideshow from './components/Slideshow';

function App() {
  // Set slide duration to 10 seconds per slide
  const slideDuration = 10;

  // PDFs from the public folder
  const pdfs = [
    '/pdfs/A-3-7_Kaneda_Masashi.pdf',
    '/pdfs/A-3-21_Kubota_Teruyoshi.pdf',
    '/pdfs/A-3-23_Ozawa_Takuto.pdf',
    '/pdfs/A-3-19_Noji_Kakeru.pdf',
    '/pdfs/A-3-8_Aoki_Yuya.pdf',
    '/pdfs/A-3-12_Komatsu_Daisuke.pdf',
    '/pdfs/A-3-18_Tatsukawa_Koumitsu.pdf',
    '/pdfs/A-3-10_Nemoto_Yuki.pdf',
    '/pdfs/A-3-9_Takahashi_Yuki.pdf',
    '/pdfs/A-3-22_Ono_Ryota.pdf',
    '/pdfs/A-3-11_Haga_Kippei.pdf',
    '/pdfs/A-3-20_Kurusu_Shogo.pdf'
  ];

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