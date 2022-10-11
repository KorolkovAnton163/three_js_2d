export interface ArrowPoint {
  uid: string | null;
  x: number;
  y: number;
  connection: ArrowConnectionPosition | null;
}

export interface ArrowElementStyle {
  marker?: {
    start: boolean;
    end: boolean;
  };
  stroke?: {
    style: string;
    dasharray: boolean;
    width: number;
  };
}

export enum ArrowConnectionPosition {
  top = 'top',
  left = 'left',
  right = 'right',
  bottom = 'bottom',
  position = 'position',
}

export default interface ArrowElementData {
  start?: ArrowPoint;
  end?: ArrowPoint;
  middle: {
    center: boolean;
  };
  style?: ArrowElementStyle;
  label: {
    enabled: boolean;
    text: string | null;
  };
}
