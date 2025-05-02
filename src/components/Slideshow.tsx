import React, { useState, useEffect, useCallback } from 'react';
import PDFSlide from './PDFSlide';
import { Sun, Moon, ChevronLeft, ChevronRight, Pause, Play, Clock, Eye, EyeOff } from 'lucide-react';

interface SlideshowProps {
  pdfs: string[];
  slideDuration: number;
  dimensions: {
    width: number;
    height: number;
  };
}

const Slideshow: React.FC<SlideshowProps> = ({ pdfs, slideDuration, dimensions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showClock, setShowClock] = useState(true);
  const [isAutoTheme, setIsAutoTheme] = useState(true);
  const [lastAutoUpdate, setLastAutoUpdate] = useState<number>(0);

  const totalSlides = pdfs.length;

  // 時間帯に応じたテーマの自動切り替え
  useEffect(() => {
    const updateThemeByTime = (date: Date) => {
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const currentMinutes = hour * 60 + minutes;
      
      if ((hour === 18 && minutes === 0) || (hour === 5 && minutes === 0)) {
        if (lastAutoUpdate !== currentMinutes) {
          setIsAutoTheme(true);
          setLastAutoUpdate(currentMinutes);
        }
      }

      if (isAutoTheme) {
        const shouldBeDark = hour >= 18 || hour < 5;
        setTheme(shouldBeDark ? 'dark' : 'light');
      }
    };

    updateThemeByTime(new Date());

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      updateThemeByTime(now);
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoTheme, lastAutoUpdate]);

  // 時刻のフォーマット
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // 日付のフォーマット
  const formatDate = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${month}/${day} (${dayOfWeek})`;
  };

  // 次のスライドに移動
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setProgress(0);
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= totalSlides ? 0 : nextIndex;
      });
      setIsTransitioning(false);
    }, 800);
  }, [totalSlides, isTransitioning]);

  // 前のスライドに移動
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setProgress(0);
    
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex - 1;
        return nextIndex < 0 ? totalSlides - 1 : nextIndex;
      });
      setIsTransitioning(false);
    }, 800);
  }, [totalSlides, isTransitioning]);

  // 自動スライドショー
  useEffect(() => {
    if (isPaused) return;

    let progressInterval: NodeJS.Timeout;
    let slideInterval: NodeJS.Timeout;

    const updateProgress = () => {
      if (!isPaused && !isTransitioning) {
        setProgress((prev) => {
          const newProgress = prev + (100 / (slideDuration * 10));
          return newProgress >= 100 ? 0 : newProgress;
        });
      }
    };

    const startIntervals = () => {
      progressInterval = setInterval(updateProgress, 100);
      slideInterval = setInterval(() => {
        if (!isPaused && !isTransitioning) {
          setProgress(0);
          nextSlide();
        }
      }, slideDuration * 1000);
    };

    startIntervals();

    return () => {
      clearInterval(progressInterval);
      clearInterval(slideInterval);
    };
  }, [isPaused, slideDuration, nextSlide, isTransitioning]);

  // テーマ切り替え
  const toggleTheme = useCallback(() => {
    setIsAutoTheme(false);
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  // 再生/一時停止切り替え
  const togglePlayPause = () => {
    setIsPaused((prev) => !prev);
  };

  // テーマカラー
  const themeColors = {
    light: {
      bg: 'bg-slate-100',
      text: 'text-slate-900',
      control: 'bg-white text-slate-700 hover:bg-slate-200',
      progress: 'bg-blue-600',
      progressBg: 'bg-slate-200'
    },
    dark: {
      bg: 'bg-slate-800',
      text: 'text-white',
      control: 'bg-slate-700 text-white hover:bg-slate-600',
      progress: 'bg-blue-400',
      progressBg: 'bg-slate-700'
    }
  };

  const currentTheme = themeColors[theme];

  return (
    <div className={`h-screen w-screen flex flex-col ${currentTheme.bg}`} style={{ width: dimensions.width, height: dimensions.height }}>
      {/* 時計の表示 */}
      {showClock && (
        <div className={`absolute top-4 right-4 flex flex-col items-end z-50`}>
          <div className={`
            backdrop-blur-xl 
            ${theme === 'light' 
              ? 'bg-white/60 text-slate-800 shadow-[0_8px_32px_rgba(0,0,0,0.15)]' 
              : 'bg-slate-900/60 text-white shadow-[0_8px_32px_rgba(255,255,255,0.15)]'
            }
            rounded-2xl 
            p-4
            border-2
            ${theme === 'light' ? 'border-white/70' : 'border-slate-700/70'}
          `}>
            <div className="text-5xl font-extralight tracking-wider drop-shadow-md">
              {formatTime(currentTime)}
            </div>
            <div className={`
              text-sm font-medium text-right mt-1
              ${theme === 'light' ? 'text-slate-700' : 'text-slate-200'}
            `}>
              {formatDate(currentTime)}
            </div>
          </div>
        </div>
      )}

      {/* メインスライドコンテナ */}
      <div className="flex-grow relative overflow-hidden z-0">
        {pdfs.map((pdf, index) => (
          <div
            key={pdf}
            className="absolute inset-0 w-full h-full"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              transform: index === currentIndex ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
              transition: 'all 800ms cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'transform, opacity',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: index === currentIndex ? 'auto' : 'none'
            }}
          >
            <PDFSlide
              pdfUrl={pdf}
              theme={theme}
              dimensions={dimensions}
            />
          </div>
        ))}
      </div>
      
      {/* コントロールパネル */}
      <div className={`p-4 border-t ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* ナビゲーションコントロール */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={prevSlide} 
              className={`p-2 rounded-full ${currentTheme.control}`}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button 
              onClick={togglePlayPause} 
              className={`p-2 rounded-full ${currentTheme.control}`}
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
            
            <button 
              onClick={nextSlide} 
              className={`p-2 rounded-full ${currentTheme.control}`}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          {/* プログレスドット */}
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? `w-4 ${currentTheme.progress}` 
                    : `${theme === 'light' ? 'bg-slate-300' : 'bg-slate-600'}`
                }`}
              />
            ))}
          </div>
          
          {/* テーマコントロール */}
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${currentTheme.text}`}>
              {currentIndex + 1} / {totalSlides}
            </span>
            
            <button 
              onClick={() => setShowClock(prev => !prev)} 
              className={`p-2 rounded-full ${currentTheme.control} relative`}
              aria-label={showClock ? "Hide clock" : "Show clock"}
              title={showClock ? "Hide clock display" : "Show clock display"}
            >
              {showClock ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>

            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleTheme} 
                className={`p-2 rounded-full ${currentTheme.control}`}
                aria-label={theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}
                title={theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button 
                onClick={() => setIsAutoTheme(prev => !prev)}
                className={`p-2 rounded-full ${currentTheme.control} ${isAutoTheme ? 'ring-2 ring-blue-400' : ''}`}
                aria-label={isAutoTheme ? "Disable auto theme" : "Enable auto theme"}
                title={isAutoTheme ? "Auto theme enabled (18:00-05:00 Dark)" : "Auto theme disabled"}
              >
                <Clock size={20} className={isAutoTheme ? '' : 'opacity-50'} />
              </button>
            </div>
          </div>
        </div>
        
        {/* プログレスバー */}
        <div className={`mt-2 w-full h-1 ${currentTheme.progressBg} rounded-full overflow-hidden`}>
          <div 
            className={`h-full ${currentTheme.progress} transition-all duration-100 ease-linear`}
            style={{ 
              width: `${progress}%`,
              transition: isPaused ? 'none' : 'width 100ms linear'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Slideshow;