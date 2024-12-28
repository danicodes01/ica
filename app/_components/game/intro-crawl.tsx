//this
import React, { useEffect, useRef, useState, useMemo } from 'react';

const SCROLL_SPEED = 25; 


interface IntroCrawlProps {
  onComplete: () => void;
}

export default function IntroCrawl({ onComplete }: IntroCrawlProps) {
  const crawlRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [animationDuration, setAnimationDuration] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const lines = useMemo(
    () => [
      'In the depths of cyberspace, where binary stars pulse with ancient machine language.',
      'Darkness has crept through the fiber-optic threads that bind our digital universe.',
      'Three sentinel planets remain as the Crystal Database dims.',
      'CHROMANOVA, where Pixel-Weavers craft interfaces of pure light.',
      'SYNTAXIA, where Logic-Singers speak in algorithms.',
      'QUANTUMCORE, where Quantum-Mystics meditate across multiple execution threads.',
      'Each guards a shard of the Source Code that once kept darkness at bay.',
      'For a thousand cycles, they fought alone, watching their neighbors fall to binary decay.',
      'Now a shadow-virus threatens their quantum-shielded networks.',
      'They discovered their coding disciplines were never meant to be separate.',
      'Together, they uncovered the prophecy of the Luminous Protocol.',
      'It requires a chosen compiler – a Code Jedi from beyond the dark firewall.',
      "One who can unite CHROMANOVA's light, SYNTAXIA's logic, and QUANTUMCORE's quantum mysteries.",
      'You are that chosen one.',
      "As darkness corrupts the servers, you must master each realm's sacred coding arts.",
      "Only by implementing the Luminous Protocol can you restore the Crystal Database.",
      'May the Source be with you...',
      '',
      '',
      ''
    ],
    []
  );

  useEffect(() => {
    if (contentRef.current && crawlRef.current) {
      const contentHeight = contentRef.current.offsetHeight;
      const containerHeight = crawlRef.current.offsetHeight;
      const totalScrollDistance = containerHeight + contentHeight;
      
      // Calculate duration based on total distance and scroll speed
      const duration = totalScrollDistance / SCROLL_SPEED;
      
      // Add a small delay before starting
      setTimeout(() => {
        setAnimationDuration(duration);
        setIsStarted(true);
      }, 1000);
    }
  }, []);

  // Trigger onComplete callback when animation ends
  useEffect(() => {
    if (isStarted && animationDuration > 0) {
      const timer = setTimeout(() => {
        onComplete();
      }, (animationDuration * 1000) + 2000); // Add 2 seconds buffer
  
      return () => clearTimeout(timer);
    }
  }, [isStarted, animationDuration, onComplete]);

  return (
    <div className="starwars-container" ref={crawlRef}>
      {/* Add fade mask */}
      <div className="fade-mask" />
      
      <div 
        className="starwars-crawl" 
        style={{
          animation: animationDuration ? `crawl ${animationDuration}s linear forwards` : 'none'
        }}
      >
        <div className="starwars-content" ref={contentRef}>
          {lines.map((line, index) => (
            <div
              key={index}
              className="starwars-line"
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}