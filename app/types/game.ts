export enum GameArea {
    MISSION_CONTROL = 'mission-control',
    FRONTEND_CORPS = 'frontend-corps',
    SYSTEMS_DIVISION = 'systems-division'
  }
  
  export interface GamePosition {
    x: number;
    y: number;
  }
  
  export interface GameColors {
    background: string;
    foreground: string;
    accent: string;
    stars: string;
    glow: string;
  }
  
  export interface GameState {
    playerPosition: GamePosition;
    currentArea: GameArea;
    activeChallenge: string | null;
    isPaused: boolean;
  }
  
  export interface GameDimensions {
    width: number;
    height: number;
  }