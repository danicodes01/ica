export interface CanvasDrawOptions {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    radius: number;
    isUnlocked: boolean;
    isHovered: boolean;
    accentColor: string;
  }
  
  export interface StarProperties {
    x: number;
    y: number;
    size: number;
    alpha: number;
  }
  
  export interface ParticleEffect {
    position: {
      x: number;
      y: number;
    };
    velocity: {
      x: number;
      y: number;
    };
    size: number;
    life: number;
    maxLife: number;
    color: string;
  }
  
  export interface AnimationFrame {
    timestamp: number;
    deltaTime: number;
  }