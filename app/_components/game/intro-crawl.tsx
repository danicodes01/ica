import React, { useEffect, useRef, useState, useMemo } from 'react';

const SCROLL_SPEED = 33; // Control how fast the crawl scrolls

interface IntroCrawlProps {
  onComplete: () => void;
}

export default function IntroCrawl({ onComplete }: IntroCrawlProps) {
  const crawlRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [animationDuration, setAnimationDuration] = useState<number>(0);
  const [hideFade, setHideFade] = useState<boolean>(false);

  const lines = useMemo(
    () => [
      'CODE WARS',
      'The Crystal Database dims.',
      'Three sentinel planets stand as the',
      'last hope ... CHROMANOVA, where Pixel-Weavers',
      'craft pure light and motion. SYNTAXIA,',
      'where Logic-Singers dream in recursive',
      'patterns ... QUANTUMCORE, where Quantum-Mystics',
      'meditate in data-temples. Each world guards',
      'a fragment of the Source Code',
      'that kept darkness at bay. For cycles,',
      'these civilizations fought the encroaching void.',
      'But when the shadow-virus threatens their',
      'networks, they discover their coding arts',
      'were meant to unite. Together, they unlock',
      'the Luminous Protocol, an ancient system.',
      'But it requires a Code Jedi to',
      'weave together their powers. You are',
      'that chosen one. As darkness corrupts',
      'server clusters, you must master each',
      'planet\'s arts. Time is short. Only the',
      'Luminous Protocol can restore light to',
      'the universe. May your functions be pure,',
      'your algorithms true. And may the Source',
      'be with you always...'
    ],
    []
  );

  useEffect(() => {
    if (contentRef.current && crawlRef.current) {
      const contentHeight = contentRef.current.offsetHeight;
      const containerHeight = crawlRef.current.offsetHeight;
      const bufferDistance = 0; // Extra scroll buffer
      const totalScrollDistance = containerHeight + contentHeight + bufferDistance;

      const newEndPosition = -contentHeight - containerHeight;

      const duration = totalScrollDistance / SCROLL_SPEED;

      setAnimationDuration(duration);
      setIsStarted(true);

      document.documentElement.style.setProperty('--end-position', `${newEndPosition}px`);
    }
  }, [lines.length, onComplete]);

  useEffect(() => {
    if (isStarted) {
      // Activate fade-mask immediately when the text animation starts
      document.querySelector('.fade-mask')?.classList.add('active');

      // Set a 60-second timeout to deactivate the fade-mask
      const timer = setTimeout(() => {
        setHideFade(true);
      }, 60001); // 60 seconds

      return () => clearTimeout(timer);
    }
  }, [isStarted]);

  useEffect(() => {
    if (hideFade) {
      // Remove the active class from fade-mask once the timeout has completed
      document.querySelector('.fade-mask')?.classList.remove('active');
    }
  }, [hideFade]);

  return (
    <div className="starwars-container" ref={crawlRef}>
      <div className="fade-mask" />
      <div
        className="starwars-crawl"
        style={{
          animation: animationDuration
            ? `crawl ${animationDuration}s linear forwards`
            : 'none',
        }}
      >
        <div className="starwars-content" ref={contentRef}>
          {lines.map((line, index) => (
            <div
              key={index}
              className={`starwars-line ${index === 0 ? 'fade-out' : ''}`}
       
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}