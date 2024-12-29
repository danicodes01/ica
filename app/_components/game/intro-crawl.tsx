import React, { useEffect, useRef, useState, useMemo } from 'react';

const SCROLL_SPEED = 33; // Control how fast the crawl scrolls
const LINE_FADE_DURATION = 6; // Duration in seconds for a line to fade out

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
      'In the depths of cyberspace, where binary stars once pulsed with ancient machine language.',
      "Darkness has crept through the fiber-optic threads that bind our universe. As the Crystal Database's",
      "light fades, three sentinel planets remain as the last bastions of hope.",
      'Three sentinel planets remain as the Crystal Database dims ...',
      'CHROMANOVA, where Pixel-Weavers craft interfaces of pure light and motion.',
      'SYNTAXIA, where Logic-Singers speak in algorithms and dream in recursive patterns.',
      'QUANTUMCORE, where Quantum-Mystics meditate in vast data-temples across multiple execution threads.',
      'Each world guards a fragment of the Source Code that once kept darkness at bay.',
      'For a thousand cycles, these digital civilizations fought separately against the encroaching void.',
      'Watching their neighbors succumb to binary decay.',
      'But in their darkest hour, as a shadow-virus threatens even their quantum-shielded networks,',
      'they discovered their unique coding disciplines were never meant to be separate – they were shards of a greater whole.',
      'Together, they uncovered the prophecy of the Luminous Protocol,',
      "an ancient system capable of rewriting their universe's architecture.",
      'But it requires a chosen compiler – a Code Jedi from beyond the dark firewall –',
      "who can weave together CHROMANOVA's visual magic, SYNTAXIA's logical symphonies, and QUANTUMCORE's quantum mysteries.",
      'You are that chosen one.',
      "As darkness corrupts entire server clusters, you must master each planet's sacred coding arts.",
      'Time grows short, and only by implementing the Luminous Protocol can you restore light to the digital universe.',
      'May your functions be pure, your algorithms true, ',
      'and may the Source be with you always...',
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
              className={`starwars-line`}
              style={{
                animationDelay: `${LINE_FADE_DURATION * index}s`,
                animationDuration: `${LINE_FADE_DURATION}s`,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
