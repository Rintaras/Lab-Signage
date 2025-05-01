import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// PDFキャッシュ用のMap
const pdfCache = new Map<string, any>();

interface PDFSlideProps {
  pdfUrl: string;
  theme: 'light' | 'dark';
  dimensions: {
    width: number;
    height: number;
  };
}

const PDFSlide: React.FC<PDFSlideProps> = ({ pdfUrl, theme, dimensions }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // キャッシュにPDFが存在しない場合のみ読み込む
    if (!pdfCache.has(pdfUrl)) {
      setIsLoading(true);
      fetch(pdfUrl)
        .then(response => response.arrayBuffer())
        .then(data => {
          pdfCache.set(pdfUrl, data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error preloading PDF:', error);
          setError('PDFのプリロードに失敗しました');
          setIsLoading(false);
        });
    }
  }, [pdfUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setError('PDFの読み込みに失敗しました');
  }

  const styles = {
    light: {
      bg: 'bg-white',
      text: 'text-slate-900',
    },
    dark: {
      bg: 'bg-slate-900',
      text: 'text-white',
    }
  };

  const currentTheme = styles[theme];

  // PDFの表示サイズを計算
  const calculateScale = () => {
    const controlsHeight = 25;
    const maxWidth = dimensions.width;
    const maxHeight = dimensions.height - controlsHeight;
    return Math.min(maxWidth / 800, maxHeight / 600) * 1.5;
  };

  return (
    <div className={`h-full w-full ${currentTheme.bg} flex flex-col items-center justify-center fade-in m-0 overflow-hidden`} style={{ width: dimensions.width, height: dimensions.height }}>
      <div className="relative w-full h-full flex items-center justify-center">
        {error ? (
          <div className={`text-center ${currentTheme.text}`}>
            <p className="text-xl mb-2">{error}</p>
            <p className="text-sm">PDF URL: {pdfUrl}</p>
          </div>
        ) : isLoading ? (
          <div className={`text-center ${currentTheme.text}`}>
            <p>PDFをプリロード中...</p>
          </div>
        ) : (
          <Document
            file={pdfCache.get(pdfUrl) || pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            className="max-h-full"
            loading={null}
          >
            <Page 
              pageNumber={pageNumber} 
              className="max-h-full"
              renderTextLayer={false}
              renderAnnotationLayer={false}
              scale={calculateScale()}
              loading={null}
            />
          </Document>
        )}
      </div>
      <div className={`${currentTheme.text} text-xs absolute bottom-0 right-0 pr-1 pb-1 bg-opacity-50`}>
        <p>
          {pageNumber} / {numPages}
        </p>
      </div>
    </div>
  );
};

export default PDFSlide;