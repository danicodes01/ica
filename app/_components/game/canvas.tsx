'use client';

import { useEffect, useRef, useState } from 'react';
import { GameState, GameColors, GameArea } from '../../types/game';
import { Station } from '../../types/station';
import { getGameStations } from '../../_data/stations';

import { drawMoon, drawSaturn, drawVenus } from './utils/drawStations';

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
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // Initialize game state using the GameState interface
  const [gameState, setGameState] = useState<GameState>({
    playerPosition: { x: 0, y: 0 },
    currentArea: initialArea,
    activeChallenge: null,
    isPaused: false,
  });

  // Intro sequence effect
  useEffect(() => {
    const crawlContainer = document.querySelector(
      '.starwars-crawl',
    ) as HTMLElement;
    if (crawlContainer) {
      crawlContainer.style.animationDuration = '10s'; // Slower scroll speed
    }

    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 6000); // Extend delay for fade out

    const hideTimer = setTimeout(() => {
      setShowIntro(false);
    }, 6000); // Match fade-out timing

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Update stations when dimensions change
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setStations(getGameStations(dimensions.width, dimensions.height));
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

  // Handle keyboard input
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

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.isPaused]);

  // Update game state
  const updateGameState = (updates: Partial<GameState>): void => {
    setGameState(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const drawStationLabel = (
    ctx: CanvasRenderingContext2D,
    station: Station,
    isHovered: boolean,
  ): void => {
    const { x, y, radius } = station.position;

    ctx.save();
    // Set the font to Press Start 2P
    ctx.font = `${isHovered ? '16px' : '14px'} 'Press Start 2P'`;
    ctx.textAlign = 'center';
    ctx.fillStyle = isHovered ? COLORS.accent : COLORS.foreground;

    // Draw the station name
    ctx.fillText(station.name, x, y - radius - 20);

    // Draw description if hovered
    if (isHovered) {
      ctx.font = '12px Press Start 2P';
      ctx.fillText(station.description, x, y - radius - 40);
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

    const isNearStation = (
      playerX: number,
      playerY: number,
      station: Station,
    ): boolean => {
      const dx = playerX - station.position.x;
      const dy = playerY - station.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < station.position.radius + 30;
    };

    const checkStationInteractions = (): void => {
      const playerX = gameState.playerPosition.x;
      const playerY = gameState.playerPosition.y;

      for (const station of stations) {
        if (isNearStation(playerX, playerY, station)) {
          setHoveredStation(station);
          return;
        }
      }

      if (hoveredStation) {
        setHoveredStation(null);
      }
    };

    const drawStation = (
      ctx: CanvasRenderingContext2D,
      station: Station,
    ): void => {
      const { x, y, radius } = station.position;
      const isHovered = hoveredStation?.id === station.id;

      switch (station.id) {
        case 'mission-control':
          drawMoon(
            ctx,
            x,
            y,
            radius,
            station.isUnlocked,
            isHovered,
            COLORS.accent,
          );
          break;
        case 'frontend-corps':
          drawVenus(
            ctx,
            x,
            y,
            radius,
            station.isUnlocked,
            isHovered,
            COLORS.accent,
          );
          break;
        case 'systems-division':
          drawSaturn(
            ctx,
            x,
            y,
            radius,
            station.isUnlocked,
            isHovered,
            COLORS.accent,
          );
          break;
      }

      // Draw the label after drawing the station
      drawStationLabel(ctx, station, isHovered);
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

      // Draw stations
      stations.forEach(station => drawStation(ctx, station));
      checkStationInteractions();

      // Draw UFO with glow effect
      ctx.shadowColor = COLORS.accent;
      ctx.shadowBlur = 15;
      ctx.font = '28px Arial';
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
    hoveredStation,
    stations,
  ]);

  return (
    <div ref={containerRef} className='fixed inset-0 bg-[#1C1C1EFF]'>
      {showIntro && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-1000 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className='starwars-container'>
            <div className='starwars-crawl'>
              <div className='starwars-title'>INTERGALACTIC CODE ACADEMY</div>
              <div className='starwars-content'>
                <p>In a digital galaxy far, far away...</p>
                <p>
                  Aspiring developers embark on an epic journey through the
                  cosmos of code.
                </p>
                <p>
                  Your mission, should you choose to accept it, is to navigate
                  through our celestial learning stations, conquering challenges
                  and expanding your programming prowess.
                </p>
                <p>May the code be with you...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Title */}
      <div className='fixed top-4 left-1/2 transform -translate-x-1/2 pointer-events-none'>
        <h1 className='font-ps2p text-[color:var(--game-text)] text-3xl text-center'>
          INTERGALACTIC CODE ACADEMY
        </h1>
      </div>

      <canvas ref={canvasRef} className='block' />
    </div>
  );
}
