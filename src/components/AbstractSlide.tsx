import React from 'react';
import { ResearchAbstract } from '../types/abstract';

interface AbstractSlideProps {
  abstract: ResearchAbstract;
  theme: 'light' | 'dark';
}

const AbstractSlide: React.FC<AbstractSlideProps> = ({ abstract, theme }) => {
  // Theme-based styling
  const styles = {
    light: {
      bg: 'bg-white',
      title: 'text-slate-900',
      subtitle: 'text-slate-700',
      text: 'text-slate-600',
      accent: 'text-blue-700',
      border: 'border-slate-200'
    },
    dark: {
      bg: 'bg-slate-900',
      title: 'text-white',
      subtitle: 'text-slate-200',
      text: 'text-slate-300',
      accent: 'text-blue-400',
      border: 'border-slate-700'
    }
  };

  const currentTheme = styles[theme];

  return (
    <div className={`h-full w-full ${currentTheme.bg} p-8 lg:p-12 flex flex-col fade-in`}>
      <div className="mb-6">
        <h1 className={`font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${currentTheme.title}`}>
          {abstract.title}
        </h1>
        
        <div className={`space-y-1 ${currentTheme.subtitle}`}>
          <div className="flex flex-wrap gap-x-2">
            {abstract.authors.map((author, index) => (
              <span key={index} className="flex items-baseline">
                <span className="font-medium">{author.name}</span>
                <span className="text-sm italic ml-1">
                  ({author.affiliation})
                  {index < abstract.authors.length - 1 ? "," : ""}
                </span>
              </span>
            ))}
          </div>
          
          <p className={`text-sm ${currentTheme.accent} font-medium`}>
            {abstract.journal}, {abstract.year}
            {abstract.doi && <span className="ml-2">DOI: {abstract.doi}</span>}
          </p>
        </div>
      </div>
      
      <div className={`flex-grow overflow-auto mb-6 ${currentTheme.text}`}>
        <div className={`${currentTheme.border} border-l-4 pl-4 py-1 mb-4 ${currentTheme.accent} font-medium`}>
          Abstract
        </div>
        <p className="text-base lg:text-lg leading-relaxed mb-6">
          {abstract.abstract}
        </p>
        
        <div className={`flex flex-wrap gap-2 mt-4`}>
          {abstract.keywords.map((keyword, index) => (
            <span 
              key={index} 
              className={`px-3 py-1 text-xs rounded-full ${
                theme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'
              }`}
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AbstractSlide;