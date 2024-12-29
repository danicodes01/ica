'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, GameColors, GameArea } from '../../types/game';
import { Planet } from '../../types/planet';
import { getGamePlanets } from '../../_data/planets';
import IntroCrawl from './intro-crawl';


import { PlanetRenderer } from './utils/planetRenderer';

// constants
const COLORS: GameColors = {
  background: '#1C1C1EFF',
  foreground: '#EBEBF599',
  accent: '#64D2FFFF',
  stars: 'rgba(235, 235, 245, 0.8)',
  glow: 'rgba(100, 210, 255, 0.6)',
};

const SHIP_SPEED = 5;

interface GameCanvasProps {
  initialArea?: GameArea;
}

export default function GameCanvas({
  initialArea = GameArea.MISSION_CONTROL,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredPlanet, sethoveredPlanet] = useState<Planet | null>(null);
  const [planets, setplanets] = useState<Planet[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  // Initialize game state using the GameState interface
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [gameState, setGameState] = useState<GameState>({
    playerPosition: { x: 0, y: 0 },
    currentArea: initialArea,
    activeChallenge: null,
    isPaused: false,
  });

  // Update planets when dimensions change
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setplanets(getGamePlanets(dimensions.width, dimensions.height));
    }
  }, [dimensions.width, dimensions.height]);

  // Handle window resize and initial setup
  useEffect(() => {
    const updateDimensions = (): void => {
      if (containerRef.current && canvasRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        setDimensions({ width, height });
        canvasRef.current.width = width;
        canvasRef.current.height = height;

        // Center the ship
        setGameState(prev => ({
          ...prev,
          playerPosition: { x: width / 2, y: height / 2 },
        }));
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Add these handler functions
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart) return;
  
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
  
    setGameState(prev => {
      const newX = Math.max(
        20,
        Math.min(dimensions.width - 20, prev.playerPosition.x + deltaX),
      );
      const newY = Math.max(
        20,
        Math.min(dimensions.height - 20, prev.playerPosition.y + deltaY),
      );
  
      return {
        ...prev,
        playerPosition: { x: newX, y: newY },
      };
    });

    setTouchStart({ x: touch.clientX, y: touch.clientY });
  }, [touchStart, dimensions.width, dimensions.height]);

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  // Modify your keyboard input useEffect to include touch events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (gameState.isPaused) return;
      setKeys(prev => new Set([...prev, e.key]));
    };
  
    const handleKeyUp = (e: KeyboardEvent): void => {
      setKeys(prev => {
        const newKeys = new Set([...prev]);
        newKeys.delete(e.key);
        return newKeys;
      });
    };
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState.isPaused, handleTouchMove]);
  // Update game state
  const updateGameState = (updates: Partial<GameState>): void => {
    setGameState(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const drawPlanetLabel = (
    ctx: CanvasRenderingContext2D,
    planet: Planet,
    isHovered: boolean,
  ): void => {
    const { x, y, radius } = planet.position;

    ctx.save();
    // Set the font to Press Start 2P
    ctx.font = `${isHovered ? '7.5px' : '9px'} 'Press Start 2P'`;
    const titlewords = planet.name.split(' ');
    const halfTitle = Math.ceil(titlewords.length / 2)

    const lineA = titlewords.slice(0, halfTitle).join(" ");
    const lineB = titlewords.slice(halfTitle).join(" ");

    
    ctx.textAlign = 'center';
    ctx.fillStyle = isHovered ? COLORS.accent : COLORS.foreground;

    // Draw the planet name
    ctx.fillText(lineA, x, y - radius - 30);
    ctx.fillText(lineB, x, y - radius - 20);
    // Draw description if hovered
    if (isHovered) {
      ctx.font = '2px Press Start 2P';

      const words = planet.description.split(' ');
      const halfLength = Math.ceil(words.length / 2);

      const line1 = words.slice(0, halfLength).join(' ');
      const line2 = words.slice(halfLength).join(' ');

      // Draw each line with spacing
      ctx.fillText(line1, x, y - radius - 55);
      ctx.fillText(line2, x, y - radius - 45);
    }
    ctx.restore();
  };

  // Setup canvas and game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateGame = (): void => {
      if (gameState.isPaused) return;

      // Update ship position based on keyboard input
      let newX = gameState.playerPosition.x;
      let newY = gameState.playerPosition.y;

      if (keys.has('a')) newX -= SHIP_SPEED;
      if (keys.has('d')) newX += SHIP_SPEED;
      if (keys.has('w')) newY -= SHIP_SPEED;
      if (keys.has('s')) newY += SHIP_SPEED;

      // Keep ship within canvas bounds
      newX = Math.max(20, Math.min(dimensions.width - 20, newX));
      newY = Math.max(20, Math.min(dimensions.height - 20, newY));

      if (
        newX !== gameState.playerPosition.x ||
        newY !== gameState.playerPosition.y
      ) {
        updateGameState({
          playerPosition: { x: newX, y: newY },
        });
      }
    };

    const drawStar = (
      x: number,
      y: number,
      size: number,
      alpha: number,
    ): void => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      const starColor = `rgba(235, 235, 245, ${alpha})`;
      gradient.addColorStop(0, starColor);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    };

    const isNearPlanet = (
      playerX: number,
      playerY: number,
      planet: Planet,
    ): boolean => {
      const dx = playerX - planet.position.x;
      const dy = playerY - planet.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < planet.position.radius + 30;
    };

    const checkPlanetInteractions = (): void => {
      const playerX = gameState.playerPosition.x;
      const playerY = gameState.playerPosition.y;

      for (const planet of planets) {
        if (isNearPlanet(playerX, playerY, planet)) {
          sethoveredPlanet(planet);
          return;
        }
      }

      if (hoveredPlanet) {
        sethoveredPlanet(null);
      }
    };

    const drawPlanet = (
  ctx: CanvasRenderingContext2D,
  planet: Planet,
): void => {
  const { x, y, radius } = planet.position;
  const isHovered = hoveredPlanet?.id === planet.id;

  const drawOptions = {
    ctx,
    x,
    y,
    radius,
    isUnlocked: planet.isUnlocked,
    isHovered,
    accentColor: COLORS.accent,
  };

  switch (planet.id) {
    case 'mission-control':
      PlanetRenderer.drawMoon(drawOptions);
      break;
    case 'frontend-corps':
      PlanetRenderer.drawChromanova(drawOptions);
      break;
    case 'systems-division':
      PlanetRenderer.drawSyntaxia(drawOptions);
      break;
    case 'quantum-core':
      PlanetRenderer.drawQuantumCore(drawOptions);
      break;
  }

  drawPlanetLabel(ctx, planet, isHovered);
};
    const renderGame = (): void => {
      // Clear canvas with background
      ctx.fillStyle = COLORS.background;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Calculate star count based on screen size
      const starCount = Math.floor(
        (dimensions.width * dimensions.height) / 6000,
      );

      // Draw stars with different sizes and opacities
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * dimensions.width;
        const y = Math.random() * dimensions.height;
        const size = Math.random() * 2 + 0.5;
        const alpha = Math.random() * 0.5 + 0.3;
        drawStar(x, y, size, alpha);
      }

      // Draw planets
      planets.forEach(planet => drawPlanet(ctx, planet));
      checkPlanetInteractions();

      // Draw UFO with glow effect
      ctx.shadowColor = COLORS.accent;
      ctx.shadowBlur = 15;
      ctx.font = '30px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(
        '🛸',
        gameState.playerPosition.x - 14,
        gameState.playerPosition.y + 10,
      );
      ctx.shadowBlur = 0;

      // Draw movement trail
      if (keys.size > 0) {
        const trailGradient = ctx.createRadialGradient(
          gameState.playerPosition.x,
          gameState.playerPosition.y,
          0,
          gameState.playerPosition.x,
          gameState.playerPosition.y,
          25,
        );
        trailGradient.addColorStop(0, COLORS.glow);
        trailGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = trailGradient;
        ctx.beginPath();
        ctx.arc(
          gameState.playerPosition.x,
          gameState.playerPosition.y + 5,
          25,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    };

    // Create the game loop
    const loop = window.setInterval(() => {
      updateGame();
      renderGame();
    }, 1000 / 60);

    // Cleanup function
    return () => {
      window.clearInterval(loop);
    };
  }, [
    keys,
    gameState.playerPosition,
    gameState.isPaused,
    dimensions,
    hoveredPlanet,
    planets,
  ]);

  return (
    <div ref={containerRef} className='fixed inset-0 overflow-hidden bg-[#1C1C1EFF]'>
      <div className='fixed top-4 left-1/2 transform -translate-x-1/2 pointer-events-none'>
        <h1 className='font-ps2p text-[color:var(--game-text)] text-1xl text-center'>
          INTERGALACTIC CODE ACADEMY
        </h1>
      </div>
      {showIntro && (
        <div className='fixed inset-0 z-50'>
          <IntroCrawl onComplete={() => setShowIntro(false)} />
        </div>
      )}
      {/* Game Title */}


      <canvas
        ref={canvasRef}
        className="block w-full h-full" // Ensure canvas fills container
        style={{ touchAction: 'none' }} // Disable touch scrolling
      />
    </div>
  );
}
