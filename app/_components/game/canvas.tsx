'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, GameColors, GameArea } from '../../types/game';
import { Planet } from '../../types/planet';
import { getGamePlanets } from '../../_data/planets';
import IntroCrawl from './intro-crawl';
import { GameRenderer } from './utils/gameRenderer';
import { PlanetRenderer } from './utils/planetRenderer';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// constants
const COLORS: GameColors = {
  background: '#1C1C1EFF',
  foreground: '#EBEBF599',
  accent: '#64D2FFFF',
  stars: 'rgba(235, 235, 245, 0.8)',
  glow: 'rgba(100, 210, 255, 0.6)',
};

const SHIP_SPEED = 5;
const INTERACTION_RADIUS = 50;

interface GameCanvasProps {
  initialArea?: GameArea;
}

export default function GameCanvas({
  initialArea = GameArea.MISSION_CONTROL,
}: GameCanvasProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const mouseMovingTimeout = useRef<NodeJS.Timeout>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredPlanet, sethoveredPlanet] = useState<Planet | null>(null);
  const [planets, setplanets] = useState<Planet[]>([]);
  const [showIntro, setShowIntro] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      const hasSeenIntro = sessionStorage.getItem(`hasSeenIntro-${session.user.email}`);
      if (!hasSeenIntro) {
        setShowIntro(true);
      }
    }
  }, [session]);

  const [gameState, setGameState] = useState<GameState>({
    playerPosition: { x: 0, y: 0 },
    currentArea: initialArea,
    activeChallenge: null,
    isPaused: false,
  });

  const updateGameState = useCallback((updates: Partial<GameState>): void => {
    setGameState(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      // Directly update player position instead of using mouseTarget
      setGameState(prev => ({
        ...prev,
        playerPosition: {
          x: Math.max(
            20,
            Math.min(dimensions.width - 20, e.clientX - rect.left),
          ),
          y: Math.max(
            20,
            Math.min(dimensions.height - 20, e.clientY - rect.top),
          ),
        },
      }));

      setIsMouseMoving(true);
      if (mouseMovingTimeout.current) {
        clearTimeout(mouseMovingTimeout.current);
      }

      mouseMovingTimeout.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 100);
    },
    [dimensions.width, dimensions.height],
  );
  const handlePlanetInteraction = useCallback((planetId: string) => {
    if (!planetId) return;
    
    // Just navigate to the first station of that planet
    router.push(`/station/${planetId}-1`);
  }, [router]);
  
  const handleCanvasClick = useCallback(
    (e: MouseEvent) => {
      if (!canvasRef.current || !hoveredPlanet) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
  
      const playerX = gameState.playerPosition.x;
      const playerY = gameState.playerPosition.y;
  
      const distanceToPlayer = Math.sqrt(
        Math.pow(clickX - playerX, 2) + Math.pow(clickY - playerY, 2),
      );
  
      if (distanceToPlayer <= INTERACTION_RADIUS && hoveredPlanet) {
        handlePlanetInteraction(hoveredPlanet.id);
      }
    },
    [gameState.playerPosition, hoveredPlanet, handlePlanetInteraction],
  );
  useEffect(() => {
    return () => {
      if (mouseMovingTimeout.current) {
        clearTimeout(mouseMovingTimeout.current);
      }
    };
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
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
    },
    [touchStart, dimensions.width, dimensions.height],
  );

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
  }, []);

  const checkPlanetInteractions = useCallback(() => {
    const playerX = gameState.playerPosition.x;
    const playerY = gameState.playerPosition.y;

    for (const planet of planets) {
      if (GameRenderer.isNearPlanet(playerX, playerY, planet)) {
        sethoveredPlanet(planet);
        return;
      }
    }

    if (hoveredPlanet) {
      sethoveredPlanet(null);
    }
  }, [gameState.playerPosition, planets, hoveredPlanet]);

  const drawPlanetLabel = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      planet: Planet,
      isHovered: boolean,
    ): void => {
      const { x, y, radius } = planet.position;

      ctx.save();
      ctx.font = `${isHovered ? '7.5px' : '9px'} 'Press Start 2P'`;
      const titlewords = planet.name.split(' ');
      const halfTitle = Math.ceil(titlewords.length / 2);
      const lineA = titlewords.slice(0, halfTitle).join(' ');
      const lineB = titlewords.slice(halfTitle).join(' ');

      ctx.textAlign = 'center';
      ctx.fillStyle = isHovered ? COLORS.accent : COLORS.foreground;
      ctx.fillText(lineA, x, y - radius - 30);
      ctx.fillText(lineB, x, y - radius - 20);

      if (isHovered) {
        ctx.font = '2px Press Start 2P';
        const words = planet.description.split(' ');
        const halfLength = Math.ceil(words.length / 2);
        const line1 = words.slice(0, halfLength).join(' ');
        const line2 = words.slice(halfLength).join(' ');
        ctx.fillText(line1, x, y - radius - 55);
        ctx.fillText(line2, x, y - radius - 45);
      }
      ctx.restore();
    },
    [],
  );

  const drawPlanet = useCallback(
    (ctx: CanvasRenderingContext2D, planet: Planet): void => {
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
    },
    [hoveredPlanet, drawPlanetLabel],
  );

  const renderGame = useCallback(
    (ctx: CanvasRenderingContext2D): void => {
      ctx.fillStyle = COLORS.background;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      GameRenderer.drawStarfield(
        ctx,
        dimensions.width,
        dimensions.height,
        COLORS,
      );
      planets.forEach(planet => drawPlanet(ctx, planet));
      checkPlanetInteractions();

      GameRenderer.drawUFO({
        ctx,
        x: gameState.playerPosition.x,
        y: gameState.playerPosition.y,
        colors: {
          ...COLORS,
          glow:
            hoveredPlanet?.id === 'systems-division'
              ? 'rgba(100, 255, 100, 0.6)'
              : COLORS.glow,
        },
        isMoving: keys.size > 0 || isMouseMoving,
      });
    },
    [
      dimensions,
      planets,
      drawPlanet,
      checkPlanetInteractions,
      gameState.playerPosition,
      hoveredPlanet,
      keys,
      isMouseMoving,
    ],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (gameState.isPaused) return;
  
      // Handle spacebar interaction
      if (e.code === 'Space') {
        e.preventDefault();
        if (hoveredPlanet) {
          handlePlanetInteraction(hoveredPlanet.id);
        }
        return;
      }
  
      if (['a', 'w', 's', 'd'].includes(e.key.toLowerCase())) {
        setKeys(prev => new Set([...prev, e.key.toLowerCase()]));
      }
    };

    const handleKeyUp = (e: KeyboardEvent): void => {
      setKeys(prev => {
        const newKeys = new Set([...prev]);
        newKeys.delete(e.key.toLowerCase());
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.isPaused, hoveredPlanet, router, handlePlanetInteraction]);

  // Effects
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setplanets(getGamePlanets(dimensions.width, dimensions.height));
    }
  }, [dimensions.width, dimensions.height]);

  useEffect(() => {
    const updateDimensions = (): void => {
      if (containerRef.current && canvasRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        setDimensions({ width, height });
        canvasRef.current.width = width;
        canvasRef.current.height = height;
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('click', handleCanvasClick);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [
    handleCanvasClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseMove,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateGame = (): void => {
      if (gameState.isPaused) return;

      // Only handle keyboard movement when mouse isn't moving
      if (!isMouseMoving && keys.size > 0) {
        let newX = gameState.playerPosition.x;
        let newY = gameState.playerPosition.y;

        if (keys.has('a')) newX -= SHIP_SPEED;
        if (keys.has('d')) newX += SHIP_SPEED;
        if (keys.has('w')) newY -= SHIP_SPEED;
        if (keys.has('s')) newY += SHIP_SPEED;

        // Apply boundaries
        newX = Math.max(20, Math.min(dimensions.width - 20, newX));
        newY = Math.max(20, Math.min(dimensions.height - 20, newY));

        updateGameState({
          playerPosition: { x: newX, y: newY },
        });
      }

      renderGame(ctx);
    };

    const gameLoop = setInterval(updateGame, 1000 / 60);
    return () => clearInterval(gameLoop);
  }, [
    dimensions,
    gameState.playerPosition,
    gameState.isPaused,
    keys,
    updateGameState,
    renderGame,
    isMouseMoving,
  ]);

  return (
    <div
      ref={containerRef}
      className='fixed inset-0 bg-[#1C1C1EFF]'
      onContextMenu={e => e.preventDefault()}
    >
      <div className='fixed top-4 left-1/2 transform -translate-x-1/2 pointer-events-none'>
        <h1 className='font-ps2p text-[color:var(--game-text)] text-1xl text-center'>
          INTERGALACTIC CODE ACADEMY
        </h1>
      </div>
      {showIntro && (
        <div className='fixed inset-0 z-50'>
          <IntroCrawl
           onComplete={() => {
            if (session?.user?.email) {
              sessionStorage.setItem(`hasSeenIntro-${session.user.email}`, 'true');
              setShowIntro(false);
            }
          }}
          />
        </div>
      )}

      <canvas
        ref={canvasRef}
        className='block w-full h-full'
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
