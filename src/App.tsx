import React from 'react';
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

  return (
    <div className="font-sans w-screen h-screen overflow-hidden">
      <Slideshow 
        pdfs={pdfs}
        slideDuration={slideDuration}
      />
    </div>
  );
}

export default App;