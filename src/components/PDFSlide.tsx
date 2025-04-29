import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
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
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="max-h-full"
        >
          <Page 
            pageNumber={pageNumber} 
            className="max-h-full"
            renderTextLayer={false}
            renderAnnotationLayer={false}
            scale={calculateScale()}
          />
        </Document>
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