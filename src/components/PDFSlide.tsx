import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFSlideProps {
  pdfUrl: string;
  theme: 'light' | 'dark';
}

const PDFSlide: React.FC<PDFSlideProps> = ({ pdfUrl, theme }) => {
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

  return (
    <div className={`h-full w-full ${currentTheme.bg} p-8 lg:p-12 flex flex-col items-center justify-center fade-in`}>
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
        />
      </Document>
      <div className={`mt-4 ${currentTheme.text}`}>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </div>
    </div>
  );
};

export default PDFSlide;