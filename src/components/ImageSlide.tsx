import React from 'react';

interface ImageSlideProps {
  imageUrl: string;
  theme: 'light' | 'dark';
  dimensions: {
    width: number;
    height: number;
  };
}

const ImageSlide: React.FC<ImageSlideProps> = ({ imageUrl, theme, dimensions }) => {
  return (
    <div 
      className={`${theme === 'light' ? 'bg-slate-100' : 'bg-slate-800'}`} 
      style={{
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}
    >
      <img
        src={imageUrl}
        alt="Slide"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          width: 'auto',
          height: 'auto'
        }}
      />
    </div>
  );
};

export default ImageSlide; 