export type PlanetType = 'moon' | 'venus' | 'saturn';

export interface PlanetVisuals {
  baseColor: string;
  accentColor: string;
  radius: number;
  special?: {
    rings?: boolean;    // For Saturn
    craters?: boolean;  // For Moon
    swirls?: boolean;   // For Venus
  }
}

export interface PlanetCoordinates {
  x: number;
  y: number;
  z: number;
}

export interface PlanetTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
}