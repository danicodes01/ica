
export interface DrawOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  isUnlocked: boolean;
  isHovered: boolean;
  accentColor: string;
}

export interface PlanetDrawFunction {
  (options: DrawOptions): void;
}

export interface PlanetDrawings {
  [key: string]: PlanetDrawFunction;
}