import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// PDF.jsのワーカーを設定
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFSlideProps {
  pdfUrl: string;
  theme: 'light' | 'dark';
  dimensions: {
    width: number;
    height: number;
  };
}

// PDFキャッシュを管理するMap
const pdfCache = new Map<string, ArrayBuffer>();

const PDFSlide: React.FC<PDFSlideProps> = ({ pdfUrl, theme, dimensions }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // キャッシュをチェック
        if (pdfCache.has(pdfUrl)) {
          const cachedData = pdfCache.get(pdfUrl);
          if (cachedData) {
            setPdfData(cachedData);
            return;
          }
        }

        // PDFをダウンロード
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error(`PDFの読み込みに失敗しました: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        
        // キャッシュに保存
        pdfCache.set(pdfUrl, arrayBuffer);
        setPdfData(arrayBuffer);
      } catch (err) {
        console.error('PDF読み込みエラー:', err);
        setError(err instanceof Error ? err.message : 'PDFの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDFドキュメント読み込みエラー:', error);
    setError(error.message);
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}>
        <div className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
          <p className="text-lg font-medium">エラーが発生しました</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !pdfData) {
    return (
      <div className={`flex items-center justify-center h-full ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}>
        <div className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
          <p className="text-lg font-medium">PDFを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center h-full ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`}>
      <Document
        file={pdfData}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <div className={`text-center ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
            <p className="text-lg font-medium">PDFを読み込んでいます...</p>
          </div>
        }
      >
        {numPages && (
          <Page
            pageNumber={1}
            width={dimensions.width * 0.9}
            height={dimensions.height * 0.9}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-2xl"
          />
        )}
      </Document>
    </div>
  );
};

export default PDFSlide;