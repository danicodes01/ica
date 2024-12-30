// app/_components/game/utils/gameRenderer.ts

import { Planet } from '../../../types/planet';
import { GameColors } from '../../../types/game';
import { PlanetRenderer } from './planetRenderer';

interface StarOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  alpha: number;
  colors: GameColors;
}

interface LabelOptions {
  ctx: CanvasRenderingContext2D;
  planet: Planet;
  isHovered: boolean;
  colors: GameColors;
}

interface UFOOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  colors: GameColors;
  isMoving: boolean;
}

export class GameRenderer {
  static drawStar({ ctx, x, y, size, alpha }: StarOptions): void {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    const starColor = `rgba(235, 235, 245, ${alpha})`;
    gradient.addColorStop(0, starColor);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawPlanetLabel({ ctx, planet, isHovered, colors }: LabelOptions): void {
    const { x, y, radius } = planet.position;

    ctx.save();
    // Set the font to Press Start 2P
    ctx.font = `${isHovered ? '7.5px' : '9px'} 'Press Start 2P'`;
    const titlewords = planet.name.split(' ');
    const halfTitle = Math.ceil(titlewords.length / 2);

    const lineA = titlewords.slice(0, halfTitle).join(" ");
    const lineB = titlewords.slice(halfTitle).join(" ");

    ctx.textAlign = 'center';
    ctx.fillStyle = isHovered ? colors.accent : colors.foreground;

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
  }

  static drawUFO({ ctx, x, y, colors, isMoving }: UFOOptions): void {
    // Draw UFO with glow effect
    ctx.save();
    ctx.shadowColor = colors.accent;
    ctx.shadowBlur = 15;
    ctx.font = '30px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('🛸', x - 14, y + 10);
    ctx.shadowBlur = 0;

    // Draw movement trail if moving
    if (isMoving) {
      const trailGradient = ctx.createRadialGradient(x, y, 0, x, y, 25);
      trailGradient.addColorStop(0, colors.glow);
      trailGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = trailGradient;
      ctx.beginPath();
      ctx.arc(x, y + 5, 25, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  static drawStarfield(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    colors: GameColors
  ): void {
    const starCount = Math.floor((width * height) / 6000);

    for (let i = 0; i < starCount; i++) {
      this.drawStar({
        ctx,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.3,
        colors
      });
    }
  }

  static drawPlanet(
    ctx: CanvasRenderingContext2D,
    planet: Planet,
    isHovered: boolean,
    colors: GameColors
  ): void {
    const { x, y, radius } = planet.position;

    const drawOptions = {
      ctx,
      x,
      y,
      radius,
      isUnlocked: planet.isUnlocked,
      isHovered,
      accentColor: colors.accent,
    };

    // Draw the planet using PlanetRenderer
    PlanetRenderer.drawPlanet(planet.type, drawOptions);

    // Draw the label
    this.drawPlanetLabel({ ctx, planet, isHovered, colors });
  }

  static isNearPlanet(
    playerX: number,
    playerY: number,
    planet: Planet,
    threshold = 30
  ): boolean {
    const dx = playerX - planet.position.x;
    const dy = playerY - planet.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < planet.position.radius + threshold;
  }
}