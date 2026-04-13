'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface FloatingMenuProps {
  position?: 'left' | 'right';
}

export default function FloatingMenu({ position = 'right' }: FloatingMenuProps) {
  const [currentSection, setCurrentSection] = useState('base64');
  const [isExpanded, setIsExpanded] = useState(false);
  const { resolvedTheme } = useTheme();

  const sections = [
    { id: 'base64', name: 'Base64', href: '#base64' },
    { id: 'query', name: 'Query JSON', href: '#query' },
    { id: 'url', name: 'URL Encode', href: '#url' },
  ];

  // Track current section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      const sectionElements = sections.map(section => ({
        ...section,
        element: document.querySelector(section.href)
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          
          if (scrollPosition >= elementTop) {
            setCurrentSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsExpanded(false);
  };

  return (
    <>
      {/* Button container */}
      <div className={`fixed top-1/4 z-50 transition-all duration-300 ${
        position === 'right' ? 'right-0' : 'left-0'
      }`}>
        <div 
          className="relative"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* Hoverable button with progress indicator lines */}
          <div className={`group relative p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-300 cursor-pointer ${
            isExpanded ? 'opacity-0' : 'opacity-100'
          }`}>
            {/* Progress indicator lines */}
            <div className="flex flex-col items-center gap-2">
              {sections.map((section, index) => (
                <div key={section.id} className="relative">
                  {/* Line - made smaller */}
                  <div className={`w-6 h-0.5 transition-all duration-300 ${
                    currentSection === section.id 
                      ? 'bg-blue-500 shadow-sm shadow-blue-500/50' 
                      : 'bg-gray-400 dark:bg-gray-600'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sliding navigation panel - positioned outside button container */}
      <div 
        className={`fixed top-1/4 bg-white/10 dark:bg-black/20 backdrop-blur-md shadow-2xl border border-white/20 dark:border-gray-700/50 transition-transform duration-300 ${
          position === 'right' 
            ? `right-0 ${isExpanded ? 'translate-x-0' : 'translate-x-full'} rounded-l-xl`
            : `left-0 ${isExpanded ? 'translate-x-0' : '-translate-x-full'} rounded-r-xl`
        } w-28`}
        style={{
          top: 'calc(25% - 60px)'
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="p-3">
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.href)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
                  currentSection === section.id
                    ? 'bg-blue-600/80 text-white shadow-lg shadow-blue-600/25'
                    : 'text-gray-800 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
