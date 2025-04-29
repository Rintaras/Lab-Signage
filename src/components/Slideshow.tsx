import React, { useState, useEffect, useCallback } from 'react';
import PDFSlide from './PDFSlide';
import { Sun, Moon, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

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

  const totalSlides = pdfs.length;

  // Function to move to the next slide
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setProgress(0);
    
    // フェードアウト後にインデックスを更新
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
      // インデックス更新後すぐにトランジションを終了
      setIsTransitioning(false);
    }, 800);
  }, [totalSlides, isTransitioning]);

  // Function to move to the previous slide
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setProgress(0);
    
    // フェードアウト後にインデックスを更新
    setTimeout(() => {
      setCurrentIndex((prevIndex) => prevIndex === 0 ? totalSlides - 1 : prevIndex - 1);
      // インデックス更新後すぐにトランジションを終了
      setIsTransitioning(false);
    }, 800);
  }, [totalSlides, isTransitioning]);

  // Automatic slideshow timer
  useEffect(() => {
    if (isPaused) return;

    let progressInterval: NodeJS.Timeout;
    let slideInterval: NodeJS.Timeout;

    const updateProgress = () => {
      if (!isPaused && !isTransitioning) {
        setProgress((prev) => {
          const newProgress = prev + (100 / (slideDuration * 10));
          return newProgress;
        });
      }
    };

    const startIntervals = () => {
      // プログレスバーの更新（100ms間隔）
      progressInterval = setInterval(updateProgress, 100);

      // スライド切り替え（slideDuration秒間隔）
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

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Toggle play/pause state
  const togglePlayPause = () => {
    setIsPaused((prev) => !prev);
  };

  // Color theme variables
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
      {/* Main Slide Container */}
      <div className="flex-grow relative overflow-hidden">
        <div 
          key={currentIndex}
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'scale(0.95) translateY(10px)' : 'scale(1) translateY(0)',
            transition: 'all 800ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform, opacity',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <PDFSlide 
            pdfUrl={pdfs[currentIndex]}
            theme={theme}
            dimensions={dimensions}
          />
        </div>
      </div>
      
      {/* Controls & Indicators */}
      <div className={`p-4 border-t ${theme === 'light' ? 'border-slate-200' : 'border-slate-700'}`}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Left side - Navigation controls */}
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
          
          {/* Center - Progress dots */}
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
          
          {/* Right side - Theme toggle & slide info */}
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${currentTheme.text}`}>
              {currentIndex + 1} / {totalSlides}
            </span>
            
            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-full ${currentTheme.control}`}
              aria-label={theme === 'light' ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
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